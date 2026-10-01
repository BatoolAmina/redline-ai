import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { extractText, chunkText } from "@/lib/pdfParser";
import { embedChunks } from "@/lib/embeddings";
import { saveDocument } from "@/lib/vectorStore";
import { summarizeDocument } from "@/lib/llm";
import { checkRateLimit } from "@/lib/rateLimit";
import { validateCitations } from "@/lib/citations";
import { attachGuestCookie, getAccessContext } from "@/lib/auth";
import { extractWithConfiguredOcr } from "@/lib/ocr";
import { requireWorkspaceRole } from "@/lib/db";

export const runtime = "nodejs";
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MAX_TEXT_LENGTH = 1_000_000;

export async function POST(req) {
  try {
    const access = await getAccessContext(req);
    await requireWorkspaceRole(access.userId, access.workspaceId, ["owner", "editor"]);
    const rate = await checkRateLimit(req, "upload", 8, 10 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: rate.unavailable ? "Shared rate limiting is not configured on this deployment." : "Too many uploads. Please try again shortly." },
        { status: rate.unavailable ? 503 : 429, headers: rate.retryAfter ? { "Retry-After": String(rate.retryAfter) } : {} }
      );
    }
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > MAX_FILE_SIZE + 1024 * 1024) {
      return NextResponse.json({ error: "The upload request is too large." }, { status: 413 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ error: "Choose a PDF to analyze." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "This PDF is larger than 15 MB. Try a smaller file." }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.subarray(0, 5).toString() !== "%PDF-") {
      return NextResponse.json({ error: "This file does not appear to be a valid PDF." }, { status: 400 });
    }

    const extracted = await extractText(buffer);
    let pages = extracted.pages.map((page) => ({
      ...page,
      text: page.text.replace(/\0/g, " ").trim(),
    }));
    let rawText = pages.map((page) => page.text).join("\n\n").trim();

    if (rawText.length < 50) {
      const ocrResult = await extractWithConfiguredOcr(buffer);
      if (ocrResult) {
        pages = ocrResult.pages;
        rawText = ocrResult.text.trim();
      }
    }

    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json(
        { error: "This PDF has too little selectable text to analyze. Scanned PDFs may need OCR first." },
        { status: 400 }
      );
    }

    if (rawText.length > MAX_TEXT_LENGTH) {
      return NextResponse.json({ error: "This document is too large to analyze in one session." }, { status: 413 });
    }

    const chunks = chunkText(pages);
    const docId = randomUUID();
    const summaryInput = pages.map((page) => `[Page ${page.pageNumber}]\n${page.text}`).join("\n\n");
    const [embeddings, generatedSummary] = await Promise.all([
      embedChunks(chunks.map((chunk) => chunk.text)),
      summarizeDocument(summaryInput),
    ]);
    const summaryResult = {
      documentType: generatedSummary.documentType || "Document",
      summaryPoints: validateCitations(generatedSummary.summaryPoints, pages, chunks),
      keyClauses: validateCitations(generatedSummary.keyClauses, pages, chunks),
    };
    const filename = file.name.replace(/[\\/\x00-\x1f]/g, "_").slice(0, 180) || "document.pdf";
    await saveDocument(docId, { chunks, embeddings, pages, meta: { filename } }, access);

    return attachGuestCookie(NextResponse.json({
      docId,
      filename,
      pages: pages.length || extracted.pageCount,
      sourcePages: pages.map(({ pageNumber, width, height, blocks }) => ({ pageNumber, width, height, blocks })),
      expiresInMinutes: 120,
      ...summaryResult,
    }), access);
  } catch (err) {
    console.error("Upload error:", err);
    const status = err.status || (err.code === "GEMINI_NOT_CONFIGURED" || err.code === "DATABASE_NOT_CONFIGURED" || err.code === "ENCRYPTION_NOT_CONFIGURED" ? 503 : 502);
    const message = err.code === "GEMINI_NOT_CONFIGURED"
      ? "Document analysis is temporarily unavailable. The server needs a Gemini API key."
      : err.code === "DATABASE_NOT_CONFIGURED"
          ? "Document workspaces are not configured on this server."
          : err.code === "ENCRYPTION_NOT_CONFIGURED"
            ? "Document encryption is not configured on this server."
          : err.code === "WORKSPACE_FORBIDDEN"
            ? "You do not have permission to upload documents to this workspace."
          : err.code === "OCR_FAILED" || err.code === "OCR_INVALID_RESPONSE"
            ? "The configured OCR service could not process this PDF. Try a selectable-text PDF or check the OCR configuration."
      : err.code === "PDF_PARSE_FAILED"
        ? err.message
        : err.status === 429
          ? "The analysis service is busy. Please try again shortly."
          : "We couldn't analyze this document right now. Please try again.";
    return NextResponse.json({ error: message }, { status });
  }
}
