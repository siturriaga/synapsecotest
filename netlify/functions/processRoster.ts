// netlify/functions/processRoster.ts
import type { Handler, HandlerEvent, HandlerContext, HandlerResponse } from "@netlify/functions";
import { Buffer } from "buffer";
import { Readable } from "stream";
import { getAdmin, getOptionalStorageBucket, verifyBearerUid } from "./_lib/firebaseAdmin";
import type { DocumentData } from "firebase-admin/firestore";
import * as mammoth from "mammoth";
import pdfParse from "pdf-parse";
import * as ExcelJS from 'exceljs';

type Mode = "preview" | "commit";

function json(statusCode: number, body: unknown): HandlerResponse {
  return { statusCode, headers: { "content-type": "application/json" }, body: JSON.stringify(body) };
}

const HEADER_ALIASES: Record<string, string> = {
  "student name": "name", "student": "name", "full name": "name", "nombre": "name", "alumno": "name",
  "studentname": "name", "learner": "name",
  "first name": "firstName", "firstname": "firstName", "given name": "firstName",
  "last name": "lastName", "lastname": "lastName", "surname": "lastName",
  "preferred name": "preferredName", "nickname": "preferredName", "alias": "preferredName",
  "name variants": "nameVariants", "aka": "nameVariants",
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

type ManualOverridePayload = {
  displayName?: string | null
  period?: number | string | null
  quarter?: string | null
  score?: number | string | null
  testName?: string | null
};

type ManualOverrideMap = Record<string, ManualOverridePayload>;

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
  const extras = Array.isArray(row.nameVariants)
    ? row.nameVariants
    : String(row.nameVariants || '')
        .split(/[;,]/)
        .map((s) => s.trim())
        .filter(Boolean);
  variants.push(...extras);
  const unique = [...new Set(variants.map((value) => value.replace(/\s+/g, ' ').trim()).filter(Boolean))];
  return unique;
}

function slugifyName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36);
}

function buildStudentIdentifier(row: any) {
  const baseName = String(row.displayName || '').trim() || (row.nameVariants && row.nameVariants[0]) || '';
  const slug = slugifyName(String(baseName));
  if (!slug) {
    const fallback = row.row ? `student-${row.row}` : `student-${Date.now()}`;
    return `${fallback}-${Math.random().toString(36).slice(2, 6)}`;
  }
  if (Array.isArray(row.nameVariants) && row.nameVariants.length > 1) {
    const signature = row.nameVariants
      .map((name: string) => name.toLowerCase().replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .sort()
      .join('|');
    if (signature) {
      return `${slug}-${hashString(signature)}`;
    }
  }
  return slug;
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

const SERVER_GROUP_TOOLKIT: Record<string, { label: string; practices: string[] }> = {
  foundation: {
    label: 'Emerging understanding',
    practices: [
      'Front-load vocabulary and concepts with visuals, home-language bridges, and concrete representations.',
      'Use collaborative talk moves, sentence frames, and restorative feedback to co-construct meaning.',
      'Connect tasks to students’ lived experiences so they see their assets reflected in the content.'
    ]
  },
  developing: {
    label: 'Approaching mastery',
    practices: [
      'Facilitate mixed-ability discussions where learners explain their reasoning and critique sample work.',
      'Offer choice boards, inquiry stems, or organizers that deepen conceptual understanding.',
      'Co-create success criteria and reflection routines that build assessment literacy.'
    ]
  },
  extending: {
    label: 'Ready for extension',
    practices: [
      'Invite students to design projects that apply the standard to community issues they identify.',
      'Position these learners as peer mentors and discussion leaders to elevate collective knowledge.',
      'Encourage critical questioning, multiple solution paths, and opportunities for student leadership.'
    ]
  }
};

const UNIVERSAL_PRACTICES = {
  summary:
    'Ground instruction in culturally responsive, student-centered routines that honor learner voice, leverage collaboration, and provide multiple pathways into the content.',
  bestPractices: [
    'Plan with Universal Design for Learning: vary engagement, representation, and expression opportunities.',
    'Embed critical pedagogy by connecting the standard to real-world issues students surface from their communities.',
    'Use asset-based feedback loops and restorative conversations to highlight strengths alongside next steps.',
    'Build collaborative structures (think-pair-share, jigsaw, peer critique) that amplify student agency.'
  ],
  reflectionPrompts: [
    'Whose voices were centered in the last lesson and how will you widen participation next time?',
    'What choices can students make to demonstrate mastery in ways that reflect their strengths and identities?',
    'Which community or cultural connections will make this learning meaningful for your learners?'
  ]
};

function describeScore(score: number | null) {
  if (score === null || score === undefined || Number.isNaN(score)) return 'N/A';
  const rounded = Number(score.toFixed(1));
  return Number.isInteger(rounded) ? String(Math.round(rounded)) : rounded.toFixed(1);
}

function buildGroupInsightsForServer(rows: any[], summary: { average: number | null }) {
  const scored = rows
    .filter((row) => typeof row.data.score === 'number' && row.data.score !== null)
    .sort((a, b) => (a.data.score ?? 0) - (b.data.score ?? 0));

  if (!scored.length) {
    return { groups: [], pedagogy: null };
  }

  const total = scored.length;
  const foundationEnd = Math.min(total, Math.max(1, Math.round(total / 3)));
  const developingEnd = Math.min(total, Math.max(foundationEnd + 1, Math.round((total * 2) / 3)));

  const slices: Array<{ id: keyof typeof SERVER_GROUP_TOOLKIT; start: number; end: number }> = [
    { id: 'foundation', start: 0, end: foundationEnd },
    { id: 'developing', start: foundationEnd, end: developingEnd },
    { id: 'extending', start: developingEnd, end: total }
  ];

  const groups = slices
    .filter(({ start, end }) => start < end)
    .map(({ id, start, end }) => {
      const segment = scored.slice(start, end);
      const toolkit = SERVER_GROUP_TOOLKIT[id];
      const minScore = segment[0]?.data.score ?? null;
      const maxScore = segment[segment.length - 1]?.data.score ?? null;
      return {
        id,
        label: toolkit.label,
        range: minScore !== null && maxScore !== null ? `${describeScore(minScore)}–${describeScore(maxScore)}` : 'N/A',
        studentCount: segment.length,
        recommendedPractices: toolkit.practices,
        students: segment.map((row) => ({
          name: row.data.displayName,
          score: row.data.score,
          testName: row.data.testName,
          period: row.data.period,
          quarter: row.data.quarter,
          sheetRow: row.row ?? null
        }))
      };
    });

  const foundationGroup = groups.find((group) => group.id === 'foundation');
  const extendingGroup = groups.find((group) => group.id === 'extending');
  const summaryParts: string[] = [];
  if (summary.average !== null) {
    summaryParts.push(`Class average is about ${describeScore(summary.average)}, showing shared areas for re-engagement.`);
  }
  if (foundationGroup) {
    summaryParts.push(
      `Plan targeted scaffolds for ${foundationGroup.studentCount} learners in the ${foundationGroup.label.toLowerCase()} group with community-connected examples.`
    );
  }
  if (extendingGroup) {
    summaryParts.push(
      `Empower ${extendingGroup.studentCount} ${extendingGroup.label.toLowerCase()} learners to mentor peers and co-design inquiry tasks.`
    );
  }

  const pedagogy = {
    summary: summaryParts.length ? summaryParts.join(' ') : UNIVERSAL_PRACTICES.summary,
    bestPractices: UNIVERSAL_PRACTICES.bestPractices,
    reflectionPrompts: UNIVERSAL_PRACTICES.reflectionPrompts
  };

  return { groups, pedagogy };
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
      await workbook.csv.read(Readable.from([buf.toString('utf8')]));
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
    const body: {
      uploadId: string
      mode?: string
      headerOverrides?: Record<string, string>
      manualOverrides?: ManualOverrideMap
    } = JSON.parse(event.body || "{}")

    const uploadId = body.uploadId;
    const mode: Mode = body.mode === 'commit' ? 'commit' : 'preview';
    const overrides = body.headerOverrides || {};
    const manualOverrides: ManualOverrideMap =
      body.manualOverrides && typeof body.manualOverrides === 'object' ? body.manualOverrides : {};
    const manualOverrideLookup = new Map<number, ManualOverridePayload>();
    Object.entries(manualOverrides).forEach(([key, value]) => {
      const numericKey = Number(key);
      if (Number.isFinite(numericKey)) {
        manualOverrideLookup.set(numericKey, value);
      }
    });
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
      const manual = manualOverrideLookup.get(rowNumber);
      const mergedValues: Record<string, any> = { ...values };
      if (manual && Object.prototype.hasOwnProperty.call(manual, 'testName')) {
        mergedValues.testName = manual?.testName ?? null;
      }
      if (manual && Object.prototype.hasOwnProperty.call(manual, 'period')) {
        mergedValues.period = manual?.period ?? null;
      }
      if (manual && Object.prototype.hasOwnProperty.call(manual, 'quarter')) {
        mergedValues.quarter = manual?.quarter ?? null;
      }
      if (manual && Object.prototype.hasOwnProperty.call(manual, 'score')) {
        mergedValues.score = manual?.score ?? null;
      }

      const blockingIssues: string[] = [];
      const warnings: string[] = [];
      let nameCandidates = buildNameParts(mergedValues);
      const manualName =
        manual && Object.prototype.hasOwnProperty.call(manual, 'displayName')
          ? String(manual?.displayName ?? '').trim()
          : undefined;
      if (manualName !== undefined) {
        if (manualName) {
          nameCandidates = [
            manualName,
            ...nameCandidates.filter((name) => name !== manualName)
          ];
        } else {
          nameCandidates = nameCandidates.filter(Boolean);
        }
      }

      const displayName = nameCandidates[0] ?? null;
      if (!displayName) {
        nameCandidates = [];
        blockingIssues.push("missing_name");
      }

      const period = cp(mergedValues.period ?? defaultPeriod ?? meta.period);
      const quarter = cq(mergedValues.quarter ?? defaultQuarter ?? meta.quarter);

      const score = parseScore(mergedValues.score);
      if (score === null) {
        blockingIssues.push("missing_score");
      }

      let testName = String(mergedValues.testName ?? '').trim();
      if (!testName && defaultTestName) {
        testName = defaultTestName;
      }
      if (!testName) {
        testName = 'N/A';
      }

      const issues = [...blockingIssues, ...warnings];
      const status = blockingIssues.length ? "needs_review" : "ok";

      return {
        row: rowNumber,
        data: {
          displayName: displayName,
          nameVariants: nameCandidates,
          period: period ?? null,
          quarter: quarter ?? null,
          score: score,
          testName: testName || null
        },
        status,
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

    const batch = admin.firestore().batch();
    const now = admin.firestore.FieldValue.serverTimestamp();
    let written = 0, skipped = 0;
    const testName = validRows[0]?.data.testName || defaultTestName || 'N/A';
    const periodForSummary = validRows.find((row) => row.data.period)?.data.period ?? defaultPeriod ?? null;
    const quarterForSummary = validRows.find((row) => row.data.quarter)?.data.quarter ?? defaultQuarter ?? null;
    const testKey = testName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `assessment-${Date.now()}`;

    const rowContexts = validRows.map((row: any) => ({
      row,
      studentId: buildStudentIdentifier({ ...row.data, row: row.row })
    }));

    const uniqueStudentIds = Array.from(new Set(rowContexts.map((context) => context.studentId)));
    const existingStudentDocs = uniqueStudentIds.length
      ? await admin.firestore().getAll(
          ...uniqueStudentIds.map((id) => admin.firestore().doc(`users/${uid}/students/${id}`))
        )
      : [];

    const existingStudentMap = new Map<string, DocumentData | undefined>();
    existingStudentDocs.forEach((docSnap, index) => {
      existingStudentMap.set(uniqueStudentIds[index], docSnap.exists ? docSnap.data() : undefined);
    });

    rowContexts.forEach(({ row, studentId }) => {
      const existing = existingStudentMap.get(studentId);
      if ((row.data.period === null || row.data.period === undefined) && existing) {
        if (typeof existing.period === 'number' && Number.isFinite(existing.period)) {
          row.data.period = existing.period;
        } else if (Array.isArray(existing.periodHistory)) {
          const mostRecent = existing.periodHistory
            .slice()
            .reverse()
            .find((value: any) => Number.isInteger(value));
          if (typeof mostRecent === 'number') {
            row.data.period = mostRecent;
          }
        }
      }
      if ((row.data.quarter === null || row.data.quarter === undefined) && existing) {
        if (typeof existing.quarter === 'string' && existing.quarter.trim()) {
          row.data.quarter = existing.quarter;
        } else if (Array.isArray(existing.quarterHistory)) {
          const recentQuarter = existing.quarterHistory
            .slice()
            .reverse()
            .find((value: any) => typeof value === 'string' && value.trim());
          if (typeof recentQuarter === 'string') {
            row.data.quarter = recentQuarter;
          }
        }
      }
      (row as any).studentId = studentId;
    });

    rowContexts.forEach(({ row, studentId }) => {
      const assessmentsCollection = admin.firestore().collection(`users/${uid}/assessments`);
      const ref = assessmentsCollection.doc();
      const assessmentId = ref.id;
      batch.set(ref, {
        displayName: row.data.displayName,
        nameVariants: row.data.nameVariants,
        period: row.data.period,
        quarter: row.data.quarter,
        score: row.data.score,
        testName: row.data.testName,
        sourceUploadId: uploadId,
        sheetRow: row.row,
        studentId,
        createdAt: now,
        updatedAt: now
      });

      const studentRef = admin.firestore().doc(`users/${uid}/students/${studentId}`);
      batch.set(
        studentRef,
        {
          displayName: row.data.displayName,
          nameVariants: row.data.nameVariants,
          lastScore: row.data.score ?? null,
          lastAssessment: row.data.testName ?? null,
          period: row.data.period ?? null,
          quarter: row.data.quarter ?? null,
          lastUploadId: uploadId,
          lastSheetRow: row.row ?? null,
          updatedAt: now,
          uploads: admin.firestore.FieldValue.increment(1),
          studentId,
          ...(row.data.period !== null
            ? { periodHistory: admin.firestore.FieldValue.arrayUnion(row.data.period) }
            : {}),
          ...(row.data.quarter
            ? { quarterHistory: admin.firestore.FieldValue.arrayUnion(row.data.quarter) }
            : {})
        },
        { merge: true }
      );

      const historyRef = studentRef.collection('history').doc(assessmentId);
      batch.set(historyRef, {
        score: row.data.score ?? null,
        testName: row.data.testName ?? null,
        period: row.data.period ?? null,
        quarter: row.data.quarter ?? null,
        sheetRow: row.row ?? null,
        uploadId,
        createdAt: now,
        studentId
      });

      written++;
    });
    skipped = reviewed.length - written;

    const summary = summariseScores(validRows);
    const grouping = buildGroupInsightsForServer(validRows, { average: summary.average });
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

    const workspaceRef = admin.firestore().doc(`users/${uid}/workspace_cache/rosterSnapshot`);
    const scoredRows = validRows
      .filter((row) => typeof row.data.score === 'number')
      .sort((a, b) => (b.data.score ?? -Infinity) - (a.data.score ?? -Infinity));
    const topHighlight = scoredRows.slice(0, 5).map((row) => ({
      studentId: (row as any).studentId ?? null,
      name: row.data.displayName,
      score: row.data.score,
      testName: row.data.testName,
      period: row.data.period,
      quarter: row.data.quarter,
      sheetRow: row.row ?? null
    }));
    const bottomHighlight = scoredRows
      .slice(-5)
      .reverse()
      .map((row) => ({
        studentId: (row as any).studentId ?? null,
        name: row.data.displayName,
        score: row.data.score,
        testName: row.data.testName,
        period: row.data.period,
        quarter: row.data.quarter,
        sheetRow: row.row ?? null
      }));
    batch.set(
      workspaceRef,
      {
        lastUploadId: uploadId,
        updatedAt: now,
        stats: {
          lastUploadTotalRows: reviewed.length,
          lastUploadValidRows: validRows.length,
          latestStudentCount: summary.count
        },
        latestAssessment: {
          testName,
          period: periodForSummary,
          quarter: quarterForSummary,
          studentCount: summary.count,
          averageScore: summary.average,
          maxScore: summary.max,
          minScore: summary.min
        },
        highlights: {
          topStudents: topHighlight,
          needsSupport: bottomHighlight
        },
        groupInsights: grouping.groups,
        pedagogy: grouping.pedagogy,
        recentStudents: validRows.slice(0, 25).map((row) => ({
          studentId: (row as any).studentId ?? null,
          name: row.data.displayName,
          score: row.data.score,
          testName: row.data.testName,
          period: row.data.period,
          quarter: row.data.quarter,
          sheetRow: row.row ?? null
        }))
      },
      { merge: true }
    );

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
