
import type { Handler } from "@netlify/functions";
import { getAdmin, verifyBearerUid } from "./_lib/firebaseAdmin";
import * as Busboy from "busboy";
import { randomBytes } from "crypto";

function json(statusCode:number, body:any){
  return { statusCode, headers: { "content-type":"application/json" }, body: JSON.stringify(body) }
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return json(405, { error:"Use POST" });
    const period = Number(event.queryStringParameters?.period ?? "");
    const quarter = String(event.queryStringParameters?.quarter ?? "").toUpperCase();
    const uid = await verifyBearerUid(event.headers.authorization);

    if (!Number.isInteger(period) || period<1 || period>8) return json(400, { error:"period must be 1-8" });
    if (!/^Q[1-4]$/.test(quarter)) return json(400, { error:"quarter must be Q1-Q4" });

    if (!event.headers["content-type"]?.includes("multipart/form-data")) return json(400, { error:"Content-Type must be multipart/form-data" });

    const busboy = Busboy({
      headers: event.headers as any,
      limits: { files: 1, fileSize: 15 * 1024 * 1024 }
    });

    const chunks: Buffer[] = [];
    let filename = "roster";
    let mime = "application/octet-stream";

    const done = new Promise<Buffer>((resolve, reject)=>{
      busboy.on("file", (_name, file, info) => {
        filename = info.filename || "roster";
        mime = info.mimeType || "application/octet-stream";
        file.on("data", d => chunks.push(d as Buffer));
        file.on("limit", () => reject(new Error("File too large")));
      });
      busboy.on("error", reject);
      busboy.on("finish", () => resolve(Buffer.concat(chunks)));
    });

    busboy.end(Buffer.from(event.body ?? "", event.isBase64Encoded ? "base64" : "utf8"));
    const buffer = await done;
    if (!buffer.length) return json(400, { error:"No file received" });

    const admin = getAdmin();
    const bucket = admin.storage().bucket();
    const uploadId = `upl_${Date.now()}_${randomBytes(4).toString("hex")}`;
    const objectPath = `users/${uid}/uploads/${uploadId}/${filename}`;
    await bucket.file(objectPath).save(buffer, { metadata: { contentType: mime }});
    await admin.firestore().doc(`users/${uid}/uploads/${uploadId}`).set({
      filename, mimetype: mime, size: buffer.length, objectPath, period, quarter,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return json(200, { uploadId, filename, mime, size: buffer.length });
  } catch (e:any) {
    return json(e.status||500, { error: e.message||"Internal error" });
  }
}
