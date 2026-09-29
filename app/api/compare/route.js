import { NextResponse } from "next/server";
import { extractText } from "@/lib/pdfParser";
import { compareDocuments, attachChangeAssessments } from "@/lib/documentDiff";
import { assessDocumentChanges } from "@/lib/llm";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MAX_TEXT_LENGTH = 1_000_000;

async function readPdf(file) {
  if (!file || typeof file.arrayBuffer !== "function") {
    throw Object.assign(new Error("Choose both PDF versions."), { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    throw Object.assign(new Error("Each PDF must be smaller than 15 MB."), { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.subarray(0, 5).toString() !== "%PDF-") {
    throw Object.assign(new Error("Both files must be valid PDFs."), { status: 400 });
  }

  const extracted = await extractText(buffer);
  const pages = extracted.pages.map((page) => ({
    ...page,
    text: page.text.replace(/\0/g, " ").trim(),
  }));
  const textLength = pages.reduce((total, page) => total + page.text.length, 0);
  if (textLength < 50) {
    throw Object.assign(new Error("One PDF has too little selectable text. Scanned PDFs need OCR before comparison."), { status: 400 });
  }
  if (textLength > MAX_TEXT_LENGTH) {
    throw Object.assign(new Error("Each document must contain less than one million extracted characters."), { status: 413 });
  }
  return { filename: file.name.replace(/[\\/\x00-\x1f]/g, "_").slice(0, 180), pages };
}

export async function POST(req) {
  try {
    const rate = await checkRateLimit(req, "compare", 4, 10 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: rate.unavailable ? "Shared rate limiting is not configured on this deployment." : "Too many comparisons. Please try again shortly." },
        { status: rate.unavailable ? 503 : 429, headers: rate.retryAfter ? { "Retry-After": String(rate.retryAfter) } : {} }
      );
    }

    const formData = await req.formData();
    const [before, after] = await Promise.all([
      readPdf(formData.get("before")),
      readPdf(formData.get("after")),
    ]);
    const changes = compareDocuments(before.pages, after.pages);
    if (!changes.length) {
      return NextResponse.json({ before: before.filename, after: after.filename, changes: [] });
    }

    const assessmentInput = changes.slice(0, 20).map(({ beforeText, afterText, beforePage, afterPage }) => ({
      beforeText: beforeText.slice(0, 1200),
      beforePage,
      afterText: afterText.slice(0, 1200),
      afterPage,
    }));
    const result = await assessDocumentChanges(assessmentInput);
    const assessed = attachChangeAssessments(changes, result.changes || []);

    return NextResponse.json({
      before: before.filename,
      after: after.filename,
      changes: assessed,
      assessedCount: assessmentInput.length,
      totalChanges: changes.length,
    });
  } catch (error) {
    console.error("Compare error:", error);
    const status = error.status || (error.code === "GEMINI_NOT_CONFIGURED" ? 503 : error.status === 429 ? 429 : 502);
    const message = error.status ? error.message
      : error.code === "GEMINI_NOT_CONFIGURED" ? "Impact analysis needs a server Gemini API key."
        : error.status === 429 ? "The analysis service is busy. Please try again shortly."
          : "We couldn't compare these documents right now. Please try again.";
    return NextResponse.json({ error: message }, { status });
  }
}