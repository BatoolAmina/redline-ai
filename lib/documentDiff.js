import { diffWordsWithSpace } from "diff";

function normalize(text) {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

function findPage(pages, quote) {
  const normalizedQuote = normalize(quote);
  if (!normalizedQuote) return null;
  const page = pages.find((item) => normalize(item.text).includes(normalizedQuote));
  return page?.pageNumber ?? null;
}

export function compareDocuments(beforePages, afterPages) {
  const beforeText = beforePages.map((page) => page.text).join("\n");
  const afterText = afterPages.map((page) => page.text).join("\n");
  const changes = [];
  let current = { beforeText: "", afterText: "" };

  const flush = () => {
    const removed = current.beforeText.trim();
    const added = current.afterText.trim();
    if (removed || added) {
      changes.push({
        beforeText: removed,
        afterText: added,
        beforePage: findPage(beforePages, removed),
        afterPage: findPage(afterPages, added),
      });
    }
    current = { beforeText: "", afterText: "" };
  };

  for (const part of diffWordsWithSpace(beforeText, afterText)) {
    if (part.added) current.afterText += part.value;
    else if (part.removed) current.beforeText += part.value;
    else flush();
  }
  flush();

  return changes
    .filter((change) => change.beforeText.length + change.afterText.length > 2)
    .slice(0, 30);
}

export function attachChangeAssessments(changes, assessments) {
  return changes.map((change, index) => {
    const assessment = assessments[index] || {};
    const allowedImpacts = new Set(["high", "medium", "low", "neutral"]);
    return {
      ...change,
      impact: allowedImpacts.has(assessment.impact) ? assessment.impact : "unclear",
      summary: typeof assessment.summary === "string"
        ? assessment.summary.slice(0, 500)
        : "The practical effect of this wording change is unclear from the excerpts alone.",
    };
  });
}