"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogIn, LogOut } from "lucide-react";

export default function AuthButton({ compact = false }) {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#7D5A44] px-4 py-2 text-sm font-medium text-[#7D5A44] transition hover:bg-[#7D5A44] hover:text-[#F5F1EA]"
      >
        <LogIn className="h-4 w-4" aria-hidden="true" />
        <span className={compact ? "sr-only sm:not-sr-only" : undefined}>
          {compact ? "Sign in" : "Sign in to Redline"}
        </span>
      </Link>
    );
  }

  return (
    <div className="flex max-w-[240px] items-center gap-2">
      <div className="hidden text-right sm:block">
        <p className="max-w-[160px] truncate text-xs font-medium">{session.user.email || "Signed in"}</p>
        <p className="text-[10px] uppercase tracking-wider text-[#7D5A44]">{session.user.role || "member"}</p>
      </div>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        aria-label={`Sign out ${session.user.email || "of Redline"}`}
        title={`Sign out ${session.user.email || "of Redline"}`}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D7C9B8] px-3 py-2 text-sm font-medium text-[#4A342A] transition hover:border-[#7D5A44] hover:text-[#7D5A44]"
      >
        <span className={compact ? "sr-only" : "truncate sm:hidden"}>
          {session.user.email || "Signed in"}
        </span>
        <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
      </button>
    </div>
  );
}
