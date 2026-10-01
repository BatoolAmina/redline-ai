import { NextResponse } from "next/server";
import { deleteDocument } from "@/lib/vectorStore";
import { getAccessContext } from "@/lib/auth";

export const runtime = "nodejs";

export async function DELETE(_request, { params }) {
  try {
    const { docId } = await params;
    const access = await getAccessContext(_request);
    const deleted = await deleteDocument(access.userId, docId);
    return deleted
      ? NextResponse.json({ deleted: true })
      : NextResponse.json({ error: "This document session has already expired." }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { error: error.code === "AUTH_REQUIRED" ? "Sign in before deleting a document." : "Unable to delete this document." },
      { status: error.status || 500 }
    );
  }
}