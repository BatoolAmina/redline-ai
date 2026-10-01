"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, FileDiff, ShieldCheck } from "lucide-react";
import AuthButton from "@/components/AuthButton";

export default function WorkspaceNav({ mode = "chat" }) {
  const isCompare = mode === "compare";
  const reduceMotion = useReducedMotion();
  const actionHref = isCompare ? "/chat" : "/compare";
  const actionLabel = isCompare ? "Analyze one PDF" : "Compare versions";
  const compactLabel = isCompare ? "Single PDF" : "Compare";

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-[#D7C9B8]/70 bg-[#F5F1EA]/90 shadow-sm shadow-[#4A342A]/5 backdrop-blur-xl"
    >
      <div
        className="mx-auto grid max-w-6xl items-center gap-2 px-3 py-2.5 sm:gap-4 sm:px-8 sm:py-3.5"
        style={{ gridTemplateColumns: "minmax(0, 1fr) auto auto auto" }}
      >
        <Link
          href="/"
          aria-label="Redline home"
          className="group flex min-w-0 items-center gap-1.5 sm:gap-2.5"
        >
          {!isCompare && (
            <ArrowLeft
              className="h-4 w-4 shrink-0 text-[#7D5A44] transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden="true"
            />
          )}
          <Image
            src="/logo.png"
            alt=""
            width={48}
            height={40}
            className="h-8 w-9 shrink-0 object-contain sm:h-9 sm:w-10"
          />
          <span className="hidden min-w-0 items-center gap-1.5 font-display text-lg font-bold text-[#4A342A] min-[360px]:inline-flex sm:text-xl">
            <span className="truncate">Redline</span>
            <span className="rounded-full border border-[#B2967D]/40 bg-[#B2967D]/15 px-1.5 py-0.5 font-mono text-[8px] uppercase text-[#7D5A44] sm:text-[9px]">
              AI
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 rounded-full border border-[#D7C9B8]/80 bg-white/70 px-3 py-1.5 font-mono text-[11px] text-[#4A342A]/75 xl:flex">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#7D5A44]" aria-hidden="true" />
          <span>{isCompare ? "Side-by-side document review" : "4 guest questions, then sign in"}</span>
        </div>

        <div className="justify-self-end">
          <AuthButton compact />
        </div>

        <motion.div
          whileHover={reduceMotion ? undefined : { y: -1 }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="justify-self-end"
        >
          <Link
            href={actionHref}
            aria-label={actionLabel}
            title={actionLabel}
            className="group inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-[#D7C9B8] bg-white/70 px-2.5 font-sans text-xs font-semibold text-[#7D5A44] shadow-sm transition-[background-color,border-color,color,box-shadow] duration-200 hover:border-[#7D5A44] hover:bg-white hover:text-[#4A342A] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D5A44] sm:rounded-full sm:px-4"
          >
            {isCompare ? (
              <ArrowLeft className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden="true" />
            ) : (
              <FileDiff className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span className="hidden min-[360px]:inline sm:hidden">{compactLabel}</span>
            <span className="hidden sm:inline">{actionLabel}</span>
          </Link>
        </motion.div>
      </div>
    </motion.header>
  );
}