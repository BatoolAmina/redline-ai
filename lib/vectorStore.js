// Persist on globalThis so the store survives Next.js dev hot-reloads.
const store = globalThis.__redlineStore ?? new Map();
globalThis.__redlineStore = store;

function removeExpiredDocuments() {
  const now = Date.now();
  for (const [id, document] of store) {
    if (document.expiresAt <= now) store.delete(id);
  }
}

if (!globalThis.__redlineStoreCleanup) {
  globalThis.__redlineStoreCleanup = setInterval(removeExpiredDocuments, 60_000);
  globalThis.__redlineStoreCleanup.unref?.();
}

export function saveDocument(docId, record) {
  removeExpiredDocuments();
  const now = Date.now();

  store.set(docId, {
    ...record,
    expiresAt: now + 2 * 60 * 60 * 1000,
    chunks: record.chunks.map((chunk, chunkIndex) => ({
      id: `${docId}-${chunkIndex}`,
      ...chunk,
      documentId: docId,
      chunkIndex,
    })),
  });
}

export function deleteDocument(docId) {
  return store.delete(docId);
}

export function getDocument(docId) {
  return store.get(docId);
}

function cosineSimilarity(a, b) {
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function topKChunks(docId, queryEmbedding, k = 4) {
  removeExpiredDocuments();
  const doc = store.get(docId);
  if (!doc || doc.expiresAt <= Date.now()) {
    const error = new Error("This document session has expired. Please upload it again.");
    error.code = "DOCUMENT_NOT_FOUND";
    throw error;
  }

  const scored = doc.chunks.map((chunk, i) => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, doc.embeddings[i]),
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
