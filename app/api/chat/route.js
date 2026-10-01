import { NextResponse } from "next/server";
import { embedText } from "@/lib/embeddings";
import { topKChunks } from "@/lib/vectorStore";
import { answerQuestion } from "@/lib/llm";
import { checkGuestChatLimit, checkRateLimit } from "@/lib/rateLimit";
import { attachGuestCookie, getAccessContext } from "@/lib/auth";
import { getMinimumRelevance, shouldAnswer } from "@/lib/ragPolicy";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const access = await getAccessContext(req);
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

    if (access.isGuest) {
      const guestLimit = await checkGuestChatLimit(access.guestId, 4);
      if (guestLimit.unavailable) {
        return NextResponse.json({ error: "Guest chat is temporarily unavailable. Please sign in or try again later." }, { status: 503 });
      }
      if (!guestLimit.allowed) {
        return NextResponse.json({ error: "You have used your 4 free document questions. Sign in to keep chatting." }, { status: 429 });
      }
    }

    const queryEmbedding = await embedText(question.trim());
    const relevantChunks = await topKChunks(access.userId, docId, queryEmbedding, 4);
    const minimumRelevance = getMinimumRelevance();
    const answer = shouldAnswer(relevantChunks[0]?.score, minimumRelevance)
      ? await answerQuestion(question, relevantChunks)
      : "I couldn't find enough information about that in this document.";

    const sources = relevantChunks.map(({ text, chunkIndex, score }) => ({
      text,
      chunkIndex,
      pageNumber: relevantChunks.find((chunk) => chunk.chunkIndex === chunkIndex)?.pageNumber,
      sectionHeading: relevantChunks.find((chunk) => chunk.chunkIndex === chunkIndex)?.sectionHeading,
      relevance: Math.round(score * 100),
    }));
    return attachGuestCookie(NextResponse.json({ answer, sources }), access);
  } catch (err) {
    console.error("Chat error:", err);
    const status = err.code === "DOCUMENT_NOT_FOUND" ? 404 : err.status || (err.code === "GEMINI_NOT_CONFIGURED" || err.code === "DATABASE_NOT_CONFIGURED" ? 503 : 502);
    const message = err.code === "DOCUMENT_NOT_FOUND"
      ? err.message
      : err.code === "GEMINI_NOT_CONFIGURED"
        ? "Grounded answers are temporarily unavailable. The server needs a Gemini API key."
        : err.code === "DATABASE_NOT_CONFIGURED"
            ? "Document workspaces are not configured on this server."
        : err.status === 429
          ? "The answer service is busy. Please try again shortly."
          : "We couldn't answer that question right now. Please try again.";
    return NextResponse.json({ error: message }, { status });
  }
}
