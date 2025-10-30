// netlify/functions/processRoster.ts
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getAdmin, verifyBearerUid } from "./_lib/firebaseAdmin";
import * as mammoth from "mammoth";
import pdfParse from "pdf-parse";
import * as ExcelJS from 'exceljs'; 

type Buffer = NodeJS.Buffer; 
type Mode = "preview" | "commit";

function json(statusCode: number, body: any) {
  return { statusCode, headers: { "content-type": "application/json" }, body: JSON.stringify(body) };
}

const HEADER_ALIASES: Record<string, string> = {
  "student name": "name", "student": "name", "full name": "name", "nombre": "name", "alumno": "name",
  "email": "email", "mail": "email", "correo": "email",
  "period": "period", "prd": "period", "block": "period", "clase": "period",
  "quarter": "quarter", "qtr": "quarter", "term": "quarter"
};
const norm = (h: string) => h.toLowerCase().replace(/[\s_\-]+/g, " ").trim();
const mapH = (h: string, overrides?: Record<string, string>) => overrides?.[h] ?? (HEADER_ALIASES[norm(h)] ?? norm(h));
const validEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const cq = (q: any) => { const s = String(q || '').toUpperCase().replace(/\s+/g, ''); if (['Q1', 'Q2', 'Q3', 'Q4'].includes(s)) return s as any; if (['1', '2', '3', '4'].includes(s)) return ('Q' + s) as any; return null; }
const cp = (p: any) => { const n = Number(p); return (Number.isInteger(n) && n >= 1 && n <= 8) ? n : null }

async function getUpload(uid: string, uploadId: string) {
  const admin = getAdmin();
  const rec = await admin.firestore().doc(`users/${uid}/uploads/${uploadId}`).get();
  if (!rec.exists) { const e: any = new Error("uploadId not found"); e.status = 404; throw e; }
  const data = rec.data()!;
  const bucket = admin.storage().bucket();
  const [buf] = await bucket.file(data.objectPath).download();
  return { buffer: buf, meta: data };
}

/**
 * PARSES CSV or XLSX buffer using the ExcelJS library.
 */
async function parseCSVorXLSX(buf: Buffer): Promise<Record<string, any>[]> {
  const workbook = new ExcelJS.Workbook();
  const rows: Record<string, any>[] = [];

  // Use as any to bypass the Buffer/ArrayBufferLike conflict (TS2345 fix)
  await workbook.xlsx.load(buf as any); 

  const worksheet = workbook.getWorksheet(1);
  if (!worksheet) return [];

  // Fix: Use optional chaining on getRow and values to prevent "possibly 'null' or 'undefined'" errors
  const headerRow = worksheet.getRow(1);
  const headerRowValues: ExcelJS.CellValue[] = (headerRow?.values?.slice(1) || []) as ExcelJS.CellValue[];
  const headers: string[] = headerRowValues
    .map((h: ExcelJS.CellValue) => String(h || "").trim());

  // Iterate over remaining rows (starting from row 2)
  worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => { 
    if (rowNumber === 1) return; 

    const rowData: Record<string, any> = {};
    
    // Fix: Use optional chaining/non-null assertion for 'row.values'
    const rowValues: ExcelJS.CellValue[] = (row.values?.slice(1) || []) as ExcelJS.CellValue[]; 

    // Explicitly type parameters (TS7006 fix)
    (headers as string[]).forEach((header: string, index: number) => {
      const cellValue = rowValues[index];
      let cellStringValue: string;

      // Handle complex cell types (Rich Text, Formulas, etc.)
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
  const headerIdx = lines.findIndex(l => /\bname\b/i.test(l) && /\bemail\b/i.test(l));
  if (headerIdx < 0) return [];
  const header = lines[headerIdx].split(/\t+|\s{2,}/);
  const out: any[] = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const cols = lines[i].split(/\t+|\s{2,}/);
    if (cols.length < 2) continue;
    const o: any = {}; header.forEach((h, ix) => o[h] = cols[ix] ?? ""); out.push(o);
  }
  return out;
}

async function parsePDF(buf: Buffer): Promise<any[]> {
  const parsed = await pdfParse(buf);
  const lines = (parsed.text || "").split("\n").map(s => s.trim()).filter(Boolean);
  const headerIdx = lines.findIndex(l => /\bname\b/i.test(l) && /\bemail\b/i.test(l));
  if (headerIdx < 0) return [];
  const header = lines[headerIdx].split(/\s{2,}|\t+/);
  const out: any[] = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const cols = lines[i].split(/\s{2,}|\t+/);
    if (cols.length < 2) continue;
    const o: any = {}; header.forEach((h, ix) => o[h] = cols[ix] ?? ""); out.push(o);
  }
  return out;
}

// Handler signature with explicit types (TS7006 fix)
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
      const m: any = {}; Object.keys(r).forEach((k) => m[ /* map normalized */ (overrides[k] ?? k).toLowerCase().replace(/[\s_\-]+/g, " ")] = r[k]);
      return m;
    });

    const reviewed = mappedRows.map((r: any, idx: number) => {
      const issues: string[] = [];
      const name = String(r.name || "").trim();
      const email = String(r.email || "").trim();
      const period = (Number.isInteger(Number(r.period)) ? Number(r.period) : meta.period);
      const quarter = String((r.quarter || meta.quarter) || '').toUpperCase().replace(/\s+/g, '');
      if (!name) issues.push("missing_name");
      if (!/^([^\s@]+@[^\s@]+\.[^\s@]+)$/.test(email)) issues.push("invalid_email");
      const pOk = Number.isInteger(period) && period >= 1 && period <= 8;
      const qOk = ['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter);
      if (!pOk) issues.push("invalid_period");
      if (!qOk) issues.push("invalid_quarter");
      return {
        row: idx + 2,
        data: { name: name || null, email: /^([^\s@]+@[^\s@]+\.[^\s@]+)$/.test(email) ? email : null, period: pOk ? period : null, quarter: qOk ? quarter : null },
        status: issues.length ? "needs_review" : "ok",
        issues: issues.length ? issues : undefined
      }
    });

    const stats = {
      total: reviewed.length,
      ok: reviewed.filter(r => r.status === 'ok').length,
      needs_review: reviewed.filter(r => r.status === 'needs_review').length
    };

    if (mode === 'preview') {
      return json(200, { rows: reviewed, stats });
    }

    // commit
    const batch = getAdmin().firestore().batch();
    const now = getAdmin().firestore.FieldValue.serverTimestamp();
    let written = 0, skipped = 0;

    reviewed.forEach((r: any) => {
      if (r.status === 'ok' && r.data.email) {
        const ref = getAdmin().firestore().doc(`users/${uid}/roster/${r.data.email.toLowerCase()}`);
        batch.set(ref, { ...r.data, sourceUploadId: uploadId, createdAt: now, updatedAt: now }, { merge: true });
        written++;
      } else {
        skipped++;
      }
    });

    await batch.commit();
    return json(200, { written, skipped, collection: `users/${uid}/roster` });
  } catch (e: any) {
    return json(e.status || 500, { error: e.message || "Internal error" });
  }
}