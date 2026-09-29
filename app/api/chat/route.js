import { NextResponse } from "next/server";
import { embedText } from "@/lib/embeddings";
import { topKChunks } from "@/lib/vectorStore";
import { answerQuestion } from "@/lib/llm";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const rate = await checkRateLimit(req, "chat", 30, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: rate.unavailable ? "Shared rate limiting is not configured on this deployment." : "Too many questions. Please try again shortly." },
        { status: rate.unavailable ? 503 : 429, headers: rate.retryAfter ? { "Retry-After": String(rate.retryAfter) } : {} }
      );
    }

    const { docId, question } = await req.json();

    if (typeof docId !== "string" || typeof question !== "string" || !question.trim()) {
      return NextResponse.json({ error: "Choose a document and enter a question." }, { status: 400 });
    }
    if (question.length > 1000) {
      return NextResponse.json({ error: "Keep your question under 1,000 characters." }, { status: 400 });
    }

    const queryEmbedding = await embedText(question.trim());
    const relevantChunks = topKChunks(docId, queryEmbedding, 4);
    const minimumRelevance = Number(process.env.RAG_MIN_SIMILARITY || 0.18);
    const answer = relevantChunks[0]?.score >= minimumRelevance
      ? await answerQuestion(question, relevantChunks)
      : "I couldn't find enough information about that in this document.";

    const sources = relevantChunks.map(({ text, chunkIndex, score }) => ({
      text,
      chunkIndex,
      pageNumber: relevantChunks.find((chunk) => chunk.chunkIndex === chunkIndex)?.pageNumber,
      sectionHeading: relevantChunks.find((chunk) => chunk.chunkIndex === chunkIndex)?.sectionHeading,
      relevance: Math.round(score * 100),
    }));
    return NextResponse.json({ answer, sources });
  } catch (err) {
    console.error("Chat error:", err);
    const status = err.code === "DOCUMENT_NOT_FOUND" ? 404 : err.code === "GEMINI_NOT_CONFIGURED" ? 503 : err.status === 429 ? 429 : 502;
    const message = err.code === "DOCUMENT_NOT_FOUND"
      ? err.message
      : err.code === "GEMINI_NOT_CONFIGURED"
        ? "Grounded answers are temporarily unavailable. The server needs a Gemini API key."
        : err.status === 429
          ? "The answer service is busy. Please try again shortly."
          : "We couldn't answer that question right now. Please try again.";
    return NextResponse.json({ error: message }, { status });
  }
}
