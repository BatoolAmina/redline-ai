// Persist on globalThis so the store survives Next.js dev hot-reloads.
const store = globalThis.__redlineStore ?? new Map();
globalThis.__redlineStore = store;

function removeExpiredDocuments() {
  const now = Date.now();
  for (const [id, document] of store) {
    if (document.expiresAt <= now) {
      store.delete(id);
    }
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
    expiresAt: now + 2 * 60 * 60 * 1000, // 2-hour TTL
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
  removeExpiredDocuments();
  const doc = store.get(docId);
  if (!doc || doc.expiresAt <= Date.now()) {
    return null;
  }
  return doc;
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dot / denominator;
}

export function topKChunks(docId, queryEmbedding, k = 4) {
  const doc = getDocument(docId);
  if (!doc) {
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
