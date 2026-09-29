import pdfParse from "pdf-parse";

export async function extractText(buffer) {
  const pages = [];

  try {
    const data = await pdfParse(buffer, {
      pagerender: async (pageData) => {
        const content = await pageData.getTextContent({ normalizeWhitespace: true });
        let lastY;
        let text = "";

        for (const item of content.items) {
          if (typeof item.str !== "string") continue;
          const y = item.transform?.[5];
          if (lastY !== undefined && y !== lastY) text += "\n";
          text += item.str;
          lastY = y;
        }

        pages.push({ pageNumber: pages.length + 1, text: text.trim() });
        return text;
      },
    });
    return { text: pages.map((page) => page.text).join("\n\n"), pages, pageCount: data.numpages || pages.length };
  } catch {
    const error = new Error("This PDF could not be opened. Try exporting or downloading it again.");
    error.code = "PDF_PARSE_FAILED";
    throw error;
  }
}

function isSectionHeading(line) {
  const trimmed = line.trim();
  return /^(?:(?:section|article|part|schedule|appendix)\s+)?\d+(?:\.\d+)*(?:\([a-z0-9]+\))*[.)]?\s+\S/i.test(trimmed)
    || /^(?:section|article|part|schedule|appendix)\s+[\w.-]+/i.test(trimmed);
}

function splitAtBoundary(text, start, limit) {
  if (limit >= text.length) return text.length;
  const boundary = Math.max(
    text.lastIndexOf(". ", limit),
    text.lastIndexOf("; ", limit),
    text.lastIndexOf(" ", limit)
  );
  return boundary > start + 200 ? boundary + 1 : limit;
}

export function chunkText(sourcePages, chunkSize = 1200, overlap = 200) {
  const pages = Array.isArray(sourcePages) ? sourcePages : [{ pageNumber: 1, text: sourcePages }];
  const chunks = [];

  for (const page of pages) {
    const sections = [];
    let sectionHeading = `Page ${page.pageNumber}`;
    let sectionLines = [];

    const flushSection = () => {
      const text = sectionLines.join(" ").replace(/\s+/g, " ").trim();
      if (text) sections.push({ sectionHeading, text });
      sectionLines = [];
    };

    for (const line of (page.text || "").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (isSectionHeading(trimmed)) {
        flushSection();
        sectionHeading = trimmed.slice(0, 180);
      }
      sectionLines.push(trimmed);
    }
    flushSection();

    for (const section of sections) {
      let start = 0;
      while (start < section.text.length) {
        const end = splitAtBoundary(section.text, start, Math.min(start + chunkSize, section.text.length));
        chunks.push({
          text: section.text.slice(start, end).trim(),
          pageNumber: page.pageNumber,
          sectionHeading: section.sectionHeading,
          parentText: section.text,
          parentId: `${page.pageNumber}:${section.sectionHeading}`,
          chunkIndex: chunks.length,
        });
        if (end >= section.text.length) break;
        start = Math.max(start + 1, end - overlap);
      }
    }
  }

  return chunks;
}
