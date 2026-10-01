import { createDocumentRecord, getDocumentRecord, markDocumentDeleted } from "./db";
import { putEncryptedDocument, readEncryptedDocument } from "./secureStore";

export async function saveDocument(docId, record, { userId, workspaceId }) {
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const document = {
    ...record,
    expiresAt: expiresAt.toISOString(),
    chunks: record.chunks.map((chunk, chunkIndex) => ({
      id: `${docId}-${chunkIndex}`,
      ...chunk,
      documentId: docId,
      chunkIndex,
    })),
  };

  await createDocumentRecord({ id: docId, workspaceId, userId, filename: record.meta.filename, expiresAt });
  await putEncryptedDocument(docId, document);
}

export async function deleteDocument(userId, docId) {
  return markDocumentDeleted(userId, docId);
}

export async function getDocument(userId, docId) {
  const record = await getDocumentRecord(userId, docId);
  if (!record) return null;
  return readEncryptedDocument(docId);
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const length = Math.min(a.length, b.length);
  for (let i = 0; i < length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function topKChunks(userId, docId, queryEmbedding, k = 4) {
  const record = await getDocumentRecord(userId, docId);
  const doc = record ? await readEncryptedDocument(docId) : null;
  if (!doc) {
    const error = new Error("This document session has expired. Please upload it again.");
    error.code = "DOCUMENT_NOT_FOUND";
    throw error;
  }

  const scored = doc.chunks.map((chunk, index) => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, doc.embeddings[index]),
  }));

  scored.sort((a, b) => b.score - a.score);
  const selected = [];
  const parentIds = new Set();
  for (const { chunk, score } of scored) {
    const parentId = chunk.parentId || chunk.id;
    if (parentIds.has(parentId)) continue;
    parentIds.add(parentId);
    selected.push({ ...chunk, score });
    if (selected.length === k) break;
  }
  return selected;
}
