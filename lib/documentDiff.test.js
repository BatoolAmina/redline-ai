import { describe, expect, it } from "vitest";
import { attachChangeAssessments, compareDocuments } from "./documentDiff";
import { validateCitations } from "./citations";
import { chunkText } from "./pdfParser";

describe("page-aware document processing", () => {
  it("retains page and section metadata in clause chunks", () => {
    const chunks = chunkText([
      { pageNumber: 3, text: "3.2 Payment Terms\nThe fee is due within thirty days after receipt." },
    ]);

    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toMatchObject({
      pageNumber: 3,
      sectionHeading: "3.2 Payment Terms",
      parentId: "3:3.2 Payment Terms",
    });
    expect(chunks[0].text).toContain("fee is due within thirty days");
  });

  it("isolates changed wording and maps it back to source pages", () => {
    const changes = compareDocuments(
      [{ pageNumber: 2, text: "4.1 Notice\nEither party must give sixty days notice." }],
      [{ pageNumber: 5, text: "4.1 Notice\nEither party must give thirty days notice." }]
    );

    expect(changes).toHaveLength(1);
    expect(changes[0].beforeText).toContain("sixty");
    expect(changes[0].afterText).toContain("thirty");
    expect(changes[0].beforePage).toBe(2);
    expect(changes[0].afterPage).toBe(5);
  });

  it("marks missing or malformed impact assessments as unclear", () => {
    const changes = attachChangeAssessments(
      [{ beforeText: "old", afterText: "new" }, { beforeText: "x", afterText: "y" }],
      [{ impact: "critical", summary: "Unsupported value" }]
    );

    expect(changes[0].impact).toBe("unclear");
    expect(changes[1].impact).toBe("unclear");
    expect(changes[1].summary).toContain("unclear");
  });

  it("drops unsupported quotes and derives page and section from source text", () => {
    const pages = [{ pageNumber: 4, text: "5.2 Late Fees\nA late fee of $25 applies after ten days." }];
    const chunks = chunkText(pages);
    const citations = validateCitations([
      { text: "A fee may apply.", sourceText: "A late fee of $25 applies after ten days.", pageNumber: 99 },
      { text: "Unsupported.", sourceText: "The document permits cancellation at any time." },
    ], pages, chunks);

    expect(citations).toHaveLength(1);
    expect(citations[0]).toMatchObject({ pageNumber: 4, sectionHeading: "5.2 Late Fees" });
  });
});