export const DEFAULT_RAG_MIN_SIMILARITY = 0.18;

export function getMinimumRelevance(value = process.env.RAG_MIN_SIMILARITY) {
  const threshold = Number(value);
  return Number.isFinite(threshold) && threshold >= 0 && threshold <= 1
    ? threshold
    : DEFAULT_RAG_MIN_SIMILARITY;
}

export function shouldAnswer(score, threshold = getMinimumRelevance()) {
  return Number.isFinite(score) && score >= threshold;
}
