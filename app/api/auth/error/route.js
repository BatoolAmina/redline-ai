import { NextResponse } from "next/server";

export function GET(request) {
  return NextResponse.redirect(new URL("/chat", request.url));
}
