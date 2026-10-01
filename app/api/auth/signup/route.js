import { NextResponse } from "next/server";
import { createPasswordUser } from "@/lib/db";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const rate = await checkRateLimit(request, "signup", 5, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: rate.unavailable ? "Account creation is temporarily unavailable." : "Too many sign-up attempts. Please try again shortly." },
        { status: rate.unavailable ? 503 : 429, headers: rate.retryAfter ? { "Retry-After": String(rate.retryAfter) } : {} }
      );
    }
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 16 * 1024) {
      return NextResponse.json({ error: "The sign-up request is too large." }, { status: 413 });
    }

    const { email, password, name } = await request.json();
    if (typeof email !== "string" || !email.trim().includes("@") || email.trim().length > 254) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: "Use a password between 8 and 128 characters." }, { status: 400 });
    }
    const user = await createPasswordUser({ email: email.trim().toLowerCase(), password, name: typeof name === "string" ? name.trim() : "" });
    return NextResponse.json({ created: true, email: user.email }, { status: 201 });
  } catch (error) {
    if (error.code === "USER_EXISTS") {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }
    console.error("Signup error:", error);
    return NextResponse.json({ error: "We couldn't create your account right now." }, { status: error.status || 500 });
  }
}
