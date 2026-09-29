import { NextResponse } from "next/server";
import { deleteDocument } from "@/lib/vectorStore";

export const runtime = "nodejs";

export async function DELETE(_request, { params }) {
  const deleted = deleteDocument(params.docId);
  return deleted
    ? NextResponse.json({ deleted: true })
    : NextResponse.json({ error: "This document session has already expired." }, { status: 404 });
}