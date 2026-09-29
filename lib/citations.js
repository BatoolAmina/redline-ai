function normalize(text) {
  return typeof text === "string" ? text.replace(/\s+/g, " ").trim().toLowerCase() : "";
}

export function validateCitations(items, pages, chunks) {
  if (!Array.isArray(items)) return [];

  return items.map((item) => {
    if (!item || typeof item !== "object") return null;
    const quote = normalize(item.sourceText);
    if (!quote) return null;

    const sourcePage = pages.find((page) => normalize(page.text).includes(quote));
    if (!sourcePage) return null;
    const matchingChunk = chunks.find((chunk) =>
      chunk.pageNumber === sourcePage.pageNumber && normalize(chunk.parentText).includes(quote)
    );

    return {
      ...item,
      pageNumber: sourcePage.pageNumber,
      sectionHeading: matchingChunk?.sectionHeading || `Page ${sourcePage.pageNumber}`,
    };
  }).filter(Boolean);
}