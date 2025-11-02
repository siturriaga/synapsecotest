// netlify/functions/uploadRoster.ts
import type { Handler, HandlerEvent } from "@netlify/functions";
import Busboy from "busboy"; // Corrected import style
import { getAdmin, getStorageBucket, verifyBearerUid } from "./_lib/firebaseAdmin";
import { Buffer } from "buffer"; // Ensure Buffer is available
import { v4 as uuidv4 } from "uuid";

// This file handles the multipart form data upload
// The actual file processing happens in processRoster.ts

function json(statusCode: number, body: any) {
  return { statusCode, headers: { "content-type": "application/json" }, body: JSON.stringify(body) };
}

export const handler: Handler = async (event: HandlerEvent) => {
  try {
    if (event.httpMethod !== "POST") return json(405, { error: "Use POST" });
    if (!event.body || !event.isBase64Encoded) return json(400, { error: "Missing multipart body" });

    const uid = await verifyBearerUid(event.headers.authorization);
    if (!uid) return json(401, { error: "Unauthorized" });

    const admin = getAdmin();
    const [period, quarter] = [event.queryStringParameters?.period, event.queryStringParameters?.quarter];

    // Check if period/quarter are valid before proceeding
    if (!period || !quarter) return json(400, { error: "Missing period or quarter in query params" });

    // Ensure the busboy object is initialized correctly
    const busboy = Busboy({ headers: event.headers }); // Fix: Call Busboy as a function/constructor
    
    const filePromise = new Promise<{ filename: string, mimetype: string, size: number, buffer: Buffer }>((resolve, reject) => {
      let chunks: Buffer[] = [];
      let filename = "";
      let mimetype = "";
      let size = 0;

      busboy.on("file", (_name: string, file: NodeJS.ReadableStream, info: { filename: string, encoding: string, mimeType: string }) => {
        // Explicitly type parameters (TS7006 fix)
        filename = info.filename;
        mimetype = info.mimeType;

        file.on("data", (d: Buffer) => { // Explicitly type 'd' as Buffer
          chunks.push(d);
          size += d.length;
        });

        file.on("end", () => {
          resolve({ filename, mimetype, size, buffer: Buffer.concat(chunks) });
        });
      });

      busboy.on("error", reject);
      busboy.on("finish", () => {
        // If no file was found, but process finished, reject
        if (!filename) reject(new Error("No file uploaded."));
      });
      
      // Write the event body (buffer) to busboy to start parsing
      busboy.end(Buffer.from(event.body, "base64"));
    });

    const { filename, mimetype, buffer } = await filePromise;
    const objectPath = `rosters/${uid}/${uuidv4()}-${filename}`;
    const uploadId = uuidv4();

    // 1. Upload to Firebase Storage
    const bucket = getStorageBucket();
    await bucket.file(objectPath).save(buffer, { metadata: { contentType: mimetype } });

    // 2. Write metadata to Firestore
    await admin.firestore().doc(`users/${uid}/uploads/${uploadId}`).set({
      filename,
      mimetype,
      objectPath,
      period: Number(period),
      quarter: quarter.toUpperCase(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      size: buffer.length
    });

    return json(200, { uploadId, filename, size: buffer.length });

  } catch (e: any) {
    // Log error for debugging
    console.error("Upload error:", e); 
    return json(e.status || 500, { error: e.message || "Internal server error during upload." });
  }
};