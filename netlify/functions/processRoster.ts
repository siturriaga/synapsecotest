// netlify/functions/processRoster.ts
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { Buffer } from "buffer";
import { getAdmin, getOptionalStorageBucket, verifyBearerUid } from "./_lib/firebaseAdmin";
import * as mammoth from "mammoth";
import pdfParse from "pdf-parse";
import * as ExcelJS from 'exceljs';

type Mode = "preview" | "commit";

function json(statusCode: number, body: any) {
  return { statusCode, headers: { "content-type": "application/json" }, body: JSON.stringify(body) };
}

const HEADER_ALIASES: Record<string, string> = {
  "student name": "name", "student": "name", "full name": "name", "nombre": "name", "alumno": "name",
  "first name": "firstName", "firstname": "firstName", "given name": "firstName",
  "last name": "lastName", "lastname": "lastName", "surname": "lastName",
  "preferred name": "preferredName", "nickname": "preferredName", "alias": "preferredName",
  "name variants": "nameVariants", "aka": "nameVariants",
  "score": "score", "test score": "score", "assessment score": "score", "points": "score", "grade": "score",
  "test": "testName", "exam": "testName", "assessment": "testName", "benchmark": "testName",
  "period": "period", "prd": "period", "block": "period", "clase": "period",
  "quarter": "quarter", "qtr": "quarter", "term": "quarter"
};
const norm = (h: string) => h.toLowerCase().replace(/[\s_\-]+/g, " ").trim();
const mapH = (h: string, overrides?: Record<string, string>) => overrides?.[h] ?? (HEADER_ALIASES[norm(h)] ?? norm(h));
const cq = (q: any) => { const s = String(q || '').toUpperCase().replace(/\s+/g, ''); if (["Q1", "Q2", "Q3", "Q4"].includes(s)) return s as any; if (["1", "2", "3", "4"].includes(s)) return ('Q' + s) as any; return null; }
const cp = (p: any) => { const n = Number(p); return (Number.isInteger(n) && n >= 1 && n <= 8) ? n : null }

function parseScore(value: any): number | null {
  if (value === null || value === undefined) return null;
  const cleaned = String(value).replace(/[^0-9.\-]+/g, '').trim();
  if (!cleaned) return null;
  const num = Number(cleaned);
  if (!Number.isFinite(num)) return null;
  return num;
}

function buildNameParts(row: any) {
  const variants: string[] = [];
  const direct = String(row.name || '').trim();
  if (direct) variants.push(direct);
  const first = String(row.firstName || '').trim();
  const last = String(row.lastName || '').trim();
  const preferred = String(row.preferredName || '').trim();
  if (first || last) {
    variants.push([first, last].filter(Boolean).join(' ').trim());
    variants.push([last, first].filter(Boolean).join(', ').trim());
  }
  if (preferred) variants.push(preferred);
  const extras = String(row.nameVariants || '').split(/[;,]/).map((s) => s.trim()).filter(Boolean);
  variants.push(...extras);
  const unique = [...new Set(variants.map((value) => value.replace(/\s+/g, ' ').trim()).filter(Boolean))];
  return unique;
}

function summariseScores(rows: any[]) {
  const scores = rows
    .map((row) => (typeof row.data.score === 'number' ? row.data.score : null))
    .filter((score): score is number => score !== null)
    .sort((a, b) => a - b);
  if (scores.length === 0) {
    return { count: 0, average: null, median: null, min: null, max: null };
  }
  const total = scores.reduce((acc, value) => acc + value, 0);
  const average = total / scores.length;
  const median = scores.length % 2 === 1
    ? scores[Math.floor(scores.length / 2)]
    : (scores[scores.length / 2 - 1] + scores[scores.length / 2]) / 2;
  return {
    count: scores.length,
    average,
    median,
    min: scores[0],
    max: scores[scores.length - 1]
  };
}

async function getUpload(uid: string, uploadId: string) {
  const admin = getAdmin();
  const rec = await admin.firestore().doc(`users/${uid}/uploads/${uploadId}`).get();
  if (!rec.exists) { const e: any = new Error("uploadId not found"); e.status = 404; throw e; }
  const data = rec.data()!;
  const storageInfo: any = data.storage;
  const inline = data.inlineData || storageInfo?.data;

  if (inline) {
    return { buffer: Buffer.from(inline, "base64"), meta: data };
  }

  if (storageInfo?.kind === "bucket" && storageInfo.objectPath) {
    const bucket = getOptionalStorageBucket();
    if (!bucket) {
      const err: any = new Error(
        "Roster upload references Firebase Storage but FIREBASE_STORAGE_BUCKET is not configured. Re-upload the roster or set the env var."
      );
      err.status = 500;
      throw err;
    }
    try {
      const [buf] = await bucket.file(storageInfo.objectPath).download();
      return { buffer: buf, meta: data };
    } catch (error: any) {
      const message = String(error?.message || "");
      const bucketMissing = error?.code === 404 || /bucket does not exist/i.test(message);
      const err: any = new Error(
        bucketMissing
          ? "Configured Firebase Storage bucket was not found. Reconfigure FIREBASE_STORAGE_BUCKET or upload a new roster."
          : "Unable to read roster from Firebase Storage. Try re-uploading the file."
      );
      err.status = 500;
      throw err;
    }
  }

  const bucket = getOptionalStorageBucket();
  if (bucket && data.objectPath) {
    const [buf] = await bucket.file(data.objectPath).download();
    return { buffer: buf, meta: data };
  }

  const e: any = new Error("Roster upload source unavailable");
  e.status = 500;
  throw e;
}

/**
 * PARSES CSV or XLSX buffer using the ExcelJS library.
 */
async function parseCSVorXLSX(buf: Buffer): Promise<Record<string, any>[]> {
  const workbook = new ExcelJS.Workbook();
  const rows: Record<string, any>[] = [];

  await workbook.xlsx.load(buf as any);

  const worksheet = workbook.getWorksheet(1);
  if (!worksheet) return [];

  const headerRow = worksheet.getRow(1);
  const headerRowValues: ExcelJS.CellValue[] = (headerRow?.values?.slice(1) || []) as ExcelJS.CellValue[];
  const headers: string[] = headerRowValues
    .map((h: ExcelJS.CellValue) => String(h || "").trim());

  worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
    if (rowNumber === 1) return;

    const rowData: Record<string, any> = {};
    const rowValues: ExcelJS.CellValue[] = (row.values?.slice(1) || []) as ExcelJS.CellValue[];

    (headers as string[]).forEach((header: string, index: number) => {
      const cellValue = rowValues[index];
      let cellStringValue: string;

      if (cellValue && typeof cellValue === 'object' && 'text' in cellValue) {
        cellStringValue = String((cellValue as { text: string }).text || String(cellValue));
      } else {
        cellStringValue = String(cellValue || "");
      }

      rowData[header] = cellStringValue.trim();
    });

    rows.push(rowData);
  });

  return rows;
}

async function parseDOCX(buf: Buffer): Promise<any[]> {
  const { value } = await mammoth.extractRawText({ buffer: buf as any });
  const lines = value.split("\n").map(s => s.trim()).filter(Boolean);
  const headerIdx = lines.findIndex(l => /\bname\b/i.test(l));
  if (headerIdx < 0) return [];
  const header = lines[headerIdx].split(/\t+|\s{2,}/);
  const out: any[] = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const cols = lines[i].split(/\t+|\s{2,}/);
    if (cols.length < 1) continue;
    const o: any = {}; header.forEach((h, ix) => o[h] = cols[ix] ?? ""); out.push(o);
  }
  return out;
}

async function parsePDF(buf: Buffer): Promise<any[]> {
  const parsed = await pdfParse(buf);
  const lines = (parsed.text || "").split("\n").map(s => s.trim()).filter(Boolean);
  const headerIdx = lines.findIndex(l => /\bname\b/i.test(l));
  if (headerIdx < 0) return [];
  const header = lines[headerIdx].split(/\s{2,}|\t+/);
  const out: any[] = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const cols = lines[i].split(/\s{2,}|\t+/);
    if (cols.length < 1) continue;
    const o: any = {}; header.forEach((h, ix) => o[h] = cols[ix] ?? ""); out.push(o);
  }
  return out;
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    if (event.httpMethod !== "POST") return json(405, { error: "Use POST" });

    const uid: string = await verifyBearerUid(event.headers.authorization) as string;
    const body: { uploadId: string; mode?: string; headerOverrides?: Record<string, string>; } = JSON.parse(event.body || "{}");

    const uploadId = body.uploadId;
    const mode: Mode = body.mode === 'commit' ? 'commit' : 'preview';
    const overrides = body.headerOverrides || {};
    if (!uploadId) return json(400, { error: "Missing uploadId" });

    const admin = getAdmin();
    const { buffer, meta } = await getUpload(uid, uploadId);
    const storageWarning: string | undefined = meta.storageWarning;
    const name = String(meta.filename || "").toLowerCase();
    const mime = String(meta.mimetype || "").toLowerCase();

    let rows: any[] = [];
    if (mime.includes("csv") || name.endsWith(".csv") || mime.includes("spreadsheet") || name.endsWith(".xlsx") || name.endsWith(".xls")) {
      rows = await parseCSVorXLSX(buffer);
    } else if (mime.includes("word") || name.endsWith(".docx")) {
      rows = await parseDOCX(buffer);
    } else if (mime.includes("pdf") || name.endsWith(".pdf")) {
      rows = await parsePDF(buffer);
    } else {
      return json(415, { error: "Unsupported file type" });
    }

    const mappedRows = rows.map((r) => {
      const m: any = {};
      Object.keys(r).forEach((k) => {
        const mappedKey = mapH(k, overrides);
        m[mappedKey] = r[k];
      });
      return m;
    });

    const reviewed = mappedRows.map((r: any, idx: number) => {
      const issues: string[] = [];
      const nameCandidates = buildNameParts(r);
      const displayName = nameCandidates[0] ?? null;
      if (!displayName) {
        issues.push("missing_name");
      }

      const period = cp(r.period ?? meta.period);
      const quarter = cq(r.quarter ?? meta.quarter);
      if (!period) issues.push("invalid_period");
      if (!quarter) issues.push("invalid_quarter");

      const score = parseScore(r.score);
      if (score === null) {
        issues.push("missing_score");
      }

      const testName = String(r.testName || meta.testName || '').trim();
      if (!testName) {
        issues.push("missing_test_name");
      }

      return {
        row: idx + 2,
        data: {
          displayName: displayName,
          nameVariants: nameCandidates,
          period: period,
          quarter: quarter,
          score: score,
          testName: testName || null
        },
        status: issues.length ? "needs_review" : "ok",
        issues: issues.length ? issues : undefined
      };
    });

    const stats = {
      total: reviewed.length,
      ok: reviewed.filter(r => r.status === 'ok').length,
      needs_review: reviewed.filter(r => r.status === 'needs_review').length
    };
    const assessmentSummary = summariseScores(reviewed.filter((row) => row.status === 'ok'));

    if (mode === 'preview') {
      return json(200, { rows: reviewed, stats, assessmentSummary, ...(storageWarning ? { storageWarning } : {}) });
    }

    const batch = admin.firestore().batch();
    const now = admin.firestore.FieldValue.serverTimestamp();
    let written = 0, skipped = 0;
    const validRows = reviewed.filter((row) => row.status === 'ok');
    const testName = validRows[0]?.data.testName || meta.testName || 'Untitled assessment';
    const testKey = testName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `assessment-${Date.now()}`;

    validRows.forEach((row: any) => {
      const ref = admin.firestore().collection(`users/${uid}/assessments`).doc();
      batch.set(ref, {
        displayName: row.data.displayName,
        nameVariants: row.data.nameVariants,
        period: row.data.period,
        quarter: row.data.quarter,
        score: row.data.score,
        testName: row.data.testName,
        sourceUploadId: uploadId,
        createdAt: now,
        updatedAt: now
      });
      written++;
    });
    skipped = reviewed.length - written;

    const summary = summariseScores(validRows);
    const summaryRef = admin.firestore().doc(`users/${uid}/assessments_summary/${testKey}`);
    batch.set(summaryRef, {
      testName,
      period: meta.period ?? null,
      quarter: meta.quarter ?? null,
      studentCount: summary.count,
      averageScore: summary.average,
      medianScore: summary.median,
      minScore: summary.min,
      maxScore: summary.max,
      updatedAt: now,
      createdAt: now
    }, { merge: true });

    const metricsRef = admin.firestore().doc(`users/${uid}/dashboard_stats/metrics`);
    batch.set(metricsRef, {
      totalEnrollment: summary.count,
      latestAssessment: {
        testName,
        period: meta.period ?? null,
        quarter: meta.quarter ?? null,
        studentCount: summary.count,
        averageScore: summary.average,
        maxScore: summary.max,
        minScore: summary.min,
        updatedAt: now
      }
    }, { merge: true });

    await batch.commit();
    return json(200, {
      written,
      skipped,
      collection: `users/${uid}/assessments`,
      assessmentSummary: summary,
      ...(storageWarning ? { storageWarning } : {})
    });
  } catch (e: any) {
    return json(e.status || 500, { error: e.message || "Internal error" });
  }
}
