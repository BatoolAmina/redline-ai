import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { getDocumentBlob, saveDocumentBlob } from "./db";

function encryptionKey() {
  const configured = process.env.DOCUMENT_ENCRYPTION_KEY;
  if (!configured && process.env.NODE_ENV === "production") {
    const error = new Error("Document encryption is not configured.");
    error.code = "ENCRYPTION_NOT_CONFIGURED";
    error.status = 503;
    throw error;
  }
  return createHash("sha256").update(configured || process.env.NEXTAUTH_SECRET || "local-development-only").digest();
}

export function encryptDocument(value) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return JSON.stringify({ iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), ciphertext: ciphertext.toString("base64") });
}

export function decryptDocument(payload) {
  const { iv, tag, ciphertext } = JSON.parse(payload);
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(iv, "base64"));
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(ciphertext, "base64")), decipher.final()]).toString("utf8"));
}

export async function putEncryptedDocument(documentId, value) {
  await saveDocumentBlob(documentId, encryptDocument(value));
}

export async function readEncryptedDocument(documentId) {
  const payload = await getDocumentBlob(documentId);
  return payload ? decryptDocument(payload) : null;
}
