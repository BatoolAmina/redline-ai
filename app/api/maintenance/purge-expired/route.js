import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { purgeExpiredDocuments } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Document cleanup is not configured." }, { status: 503 });
  }

  const expected = Buffer.from(`Bearer ${secret}`);
  const provided = Buffer.from(request.headers.get("authorization") || "");
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const deletedCount = await purgeExpiredDocuments();
    return NextResponse.json({ deletedCount });
  } catch (error) {
    console.error("Expired document cleanup failed:", error);
    return NextResponse.json({ error: "Document cleanup failed." }, { status: 503 });
  }
}