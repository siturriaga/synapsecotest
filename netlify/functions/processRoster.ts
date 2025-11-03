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
  "studentname": "name", "learner": "name",
  "first name": "firstName", "firstname": "firstName", "given name": "firstName",
  "last name": "lastName", "lastname": "lastName", "surname": "lastName",
  "preferred name": "preferredName", "nickname": "preferredName", "alias": "preferredName",
  "name variants": "nameVariants", "aka": "nameVariants", "alternate names": "nameVariants",
  "score": "score", "test score": "score", "assessment score": "score", "points": "score", "grade": "score",
  "overall score": "score", "score percent": "score", "score percentage": "score", "percentage": "score",
  "test": "testName", "exam": "testName", "assessment": "testName", "benchmark": "testName",
  "test name": "testName", "assessment name": "testName", "test title": "testName", "assessment title": "testName",
  "period": "period", "prd": "period", "block": "period", "clase": "period", "class period": "period",
  "section": "period",
  "quarter": "quarter", "qtr": "quarter", "term": "quarter", "grading period": "quarter"
};
const norm = (h: string) => h.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
const mapH = (h: string, overrides?: Record<string, string>) => {
  if (!h) return "";
  const override = overrides?.[h];
  if (override) return override;
  const normalized = norm(h);
  if (!normalized) return "";
  return HEADER_ALIASES[normalized] ?? normalized;
};
const cq = (q: any) => {
  const raw = String(q ?? '').toUpperCase().replace(/\s+/g, '');
  if (!raw) return null;
  const normalized = raw
    .replace(/^QUARTER/, 'Q')
    .replace(/^TERM/, 'Q')
    .replace(/^QTR/, 'Q');
  if (/^Q[1-4]$/.test(normalized)) return normalized as any;
  if (/^[1-4]$/.test(normalized)) return (`Q${normalized}`) as any;
  return null;
};
const cp = (p: any) => {
  if (p === null || p === undefined) return null;
  const match = String(p).match(/\d+/);
  if (!match) return null;
  const n = Number(match[0]);
  return Number.isInteger(n) && n >= 1 && n <= 8 ? n : null;
};

type ParsedRow = { rowNumber: number; values: Record<string, any> };

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

function cellValueToString(value: any): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : '';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object') {
    if (typeof value.text === 'string') return value.text.trim();
    if (Array.isArray(value.richText)) {
      return value.richText.map((part: any) => part?.text ?? '').join('').trim();
    }
    if (value.result !== undefined) return cellValueToString(value.result);
  }
  return String(value).trim();
}

type SheetRow = { rowNumber: number; values: string[] };

function buildSheetRows(worksheet: ExcelJS.Worksheet | undefined): SheetRow[] {
  if (!worksheet) return [];
  const rows: SheetRow[] = [];
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    const values = ((row.values || []) as any[]).slice(1).map(cellValueToString);
    while (values.length && !values[values.length - 1]) {
      values.pop();
    }
    if (values.some((value) => value)) {
      rows.push({ rowNumber, values });
    }
  });
  return rows;
}

function findHeaderRow(rows: SheetRow[], overrides: Record<string, string>): SheetRow | null {
  for (const row of rows) {
    const mapped = row.values.map((value) => mapH(value, overrides));
    const hasName = mapped.some((key) => ['name', 'firstName', 'lastName', 'preferredName'].includes(key));
    const hasScore = mapped.includes('score');
    const hasTest = mapped.includes('testName');
    if (hasName && (hasScore || hasTest)) {
      return row;
    }
  }
  return rows.length ? rows[0] : null;
}

function extractWorksheetRows(worksheet: ExcelJS.Worksheet | undefined, overrides: Record<string, string>): ParsedRow[] {
  const sheetRows = buildSheetRows(worksheet);
  if (!sheetRows.length) return [];
  const headerRow = findHeaderRow(sheetRows, overrides);
  if (!headerRow) return [];
  const headerIndex = sheetRows.findIndex((entry) => entry === headerRow);
  const headerValues = headerRow.values;
  const data: ParsedRow[] = [];
  for (let i = headerIndex + 1; i < sheetRows.length; i++) {
    const row = sheetRows[i];
    const record: Record<string, any> = {};
    headerValues.forEach((header, idx) => {
      if (!header) return;
      record[header] = row.values[idx] ?? '';
    });
    const hasContent = Object.values(record).some((value) => String(value ?? '').trim().length > 0);
    if (hasContent) {
      data.push({ rowNumber: row.rowNumber, values: record });
    }
  }
  return data;
}

function extractFromWorkbook(workbook: ExcelJS.Workbook, overrides: Record<string, string>): ParsedRow[] {
  for (const worksheet of workbook.worksheets) {
    const rows = extractWorksheetRows(worksheet, overrides);
    if (rows.length) return rows;
  }
  const fallback = workbook.getWorksheet(1);
  return fallback ? extractWorksheetRows(fallback, overrides) : [];
}

async function loadWorkbookRows(buf: Buffer, overrides: Record<string, string>, kind: 'xlsx' | 'csv'): Promise<ParsedRow[]> {
  const workbook = new ExcelJS.Workbook();
  try {
    if (kind === 'xlsx') {
      await workbook.xlsx.load(buf as any);
    } else {
      await workbook.csv.read(buf.toString('utf8'));
    }
  } catch (error) {
    return [];
  }
  return extractFromWorkbook(workbook, overrides);
}

async function parseTabular(buf: Buffer, overrides: Record<string, string>, formatHint?: 'xlsx' | 'csv'): Promise<ParsedRow[]> {
  const order: ('xlsx' | 'csv')[] = formatHint === 'csv'
    ? ['csv', 'xlsx']
    : formatHint === 'xlsx'
      ? ['xlsx', 'csv']
      : ['xlsx', 'csv'];
  for (const kind of order) {
    const rows = await loadWorkbookRows(buf, overrides, kind);
    if (rows.length) {
      return rows;
    }
  }
  return [];
}

async function parseDOCX(buf: Buffer, overrides: Record<string, string>): Promise<ParsedRow[]> {
  const { value } = await mammoth.extractRawText({ buffer: buf as any });
  const lines = value.split("\n").map((s) => s.trim()).filter((s) => s.length);
  const headerIdx = lines.findIndex((line) => /\bname\b/i.test(line));
  if (headerIdx < 0) return [];
  const header = lines[headerIdx].split(/\t+|\s{2,}/).map((cell) => cell.trim());
  const mappedHeaders = header.map((cell) => mapH(cell, overrides));
  if (!mappedHeaders.some((key) => ['name', 'firstName', 'lastName', 'preferredName'].includes(key))) {
    return [];
  }
  const rows: ParsedRow[] = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const cols = lines[i].split(/\t+|\s{2,}/).map((cell) => cell.trim());
    if (!cols.some((cell) => cell)) continue;
    const record: Record<string, any> = {};
    header.forEach((h, ix) => {
      if (!h) return;
      record[h] = cols[ix] ?? '';
    });
    const hasContent = Object.values(record).some((value) => String(value ?? '').trim().length > 0);
    if (hasContent) {
      rows.push({ rowNumber: i + 1, values: record });
    }
  }
  return rows;
}

async function parsePDF(buf: Buffer, overrides: Record<string, string>): Promise<ParsedRow[]> {
  const parsed = await pdfParse(buf);
  const lines = (parsed.text || '').split("\n").map((s) => s.trim()).filter((s) => s.length);
  const headerIdx = lines.findIndex((line) => /\bname\b/i.test(line));
  if (headerIdx < 0) return [];
  const header = lines[headerIdx].split(/\s{2,}|\t+/).map((cell) => cell.trim());
  const mappedHeaders = header.map((cell) => mapH(cell, overrides));
  if (!mappedHeaders.some((key) => ['name', 'firstName', 'lastName', 'preferredName'].includes(key))) {
    return [];
  }
  const rows: ParsedRow[] = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const cols = lines[i].split(/\s{2,}|\t+/).map((cell) => cell.trim());
    if (!cols.some((cell) => cell)) continue;
    const record: Record<string, any> = {};
    header.forEach((h, ix) => {
      if (!h) return;
      record[h] = cols[ix] ?? '';
    });
    const hasContent = Object.values(record).some((value) => String(value ?? '').trim().length > 0);
    if (hasContent) {
      rows.push({ rowNumber: i + 1, values: record });
    }
  }
  return rows;
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

    let parsedRows: ParsedRow[] = [];
    if (mime.includes("csv") || name.endsWith(".csv") || mime.includes("spreadsheet") || name.endsWith(".xlsx") || name.endsWith(".xls")) {
      const hint: 'xlsx' | 'csv' | undefined = mime.includes("csv") || name.endsWith(".csv") ? 'csv' : mime.includes("spreadsheet") || name.endsWith(".xlsx") ? 'xlsx' : undefined;
      parsedRows = await parseTabular(buffer, overrides, hint);
    } else if (mime.includes("word") || name.endsWith(".docx")) {
      parsedRows = await parseDOCX(buffer, overrides);
    } else if (mime.includes("pdf") || name.endsWith(".pdf")) {
      parsedRows = await parsePDF(buffer, overrides);
    } else {
      return json(415, { error: "Unsupported file type" });
    }

    if (!parsedRows.length) {
      return json(422, { error: "No mastery rows detected. Ensure the file includes a header row with student names and scores." });
    }

    const mappedRows = parsedRows.map(({ rowNumber, values }) => {
      const mapped: Record<string, any> = {};
      Object.keys(values).forEach((key) => {
        const mappedKey = mapH(key, overrides);
        if (!mappedKey) return;
        mapped[mappedKey] = values[key];
      });
      return { rowNumber, values: mapped };
    });

    const defaultPeriod = cp(meta.period);
    const defaultQuarter = cq(meta.quarter);
    const defaultTestName = String(meta.testName || '').trim();

    const reviewed = mappedRows.map(({ rowNumber, values }) => {
      const issues: string[] = [];
      const nameCandidates = buildNameParts(values);
      const displayName = nameCandidates[0] ?? null;
      if (!displayName) {
        issues.push("missing_name");
      }

      const period = cp(values.period ?? defaultPeriod ?? meta.period);
      const quarter = cq(values.quarter ?? defaultQuarter ?? meta.quarter);
      if (!period) issues.push("invalid_period");
      if (!quarter) issues.push("invalid_quarter");

      const score = parseScore(values.score);
      if (score === null) {
        issues.push("missing_score");
      }

      const testName = String(values.testName || defaultTestName || '').trim();
      if (!testName) {
        issues.push("missing_test_name");
      }

      return {
        row: rowNumber,
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

    const validRows = reviewed.filter((row) => row.status === 'ok');
    const stats = {
      total: reviewed.length,
      ok: validRows.length,
      needs_review: reviewed.length - validRows.length
    };
    const assessmentSummary = summariseScores(validRows);

    if (mode === 'preview') {
      return json(200, { rows: reviewed, stats, assessmentSummary, ...(storageWarning ? { storageWarning } : {}) });
    }

    if (validRows.length === 0) {
      return json(422, { error: "No valid mastery rows detected. Resolve flagged rows before committing." });
    }

    const batch = admin.firestore().batch();
    const now = admin.firestore.FieldValue.serverTimestamp();
    let written = 0, skipped = 0;
    const testName = validRows[0]?.data.testName || defaultTestName || 'Untitled assessment';
    const periodForSummary = validRows.find((row) => row.data.period)?.data.period ?? defaultPeriod ?? null;
    const quarterForSummary = validRows.find((row) => row.data.quarter)?.data.quarter ?? defaultQuarter ?? null;
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
        sheetRow: row.row,
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
      period: periodForSummary,
      quarter: quarterForSummary,
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
        period: periodForSummary,
        quarter: quarterForSummary,
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
