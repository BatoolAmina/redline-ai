"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, ShieldAlert, MessageSquareText, FileText, CheckCircle2 } from "lucide-react";
import Reveal from "./Reveal";

const features = [
  {
    tag: "Plain-language summary",
    title: "Read the whole document in four sentences",
    body: "No legalese, no jargon. Just what the document actually says, in the words you'd use to explain it to a friend.",
    icon: FileText,
    mock: (
      <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#D7C9B8] bg-[#F5F1EA]/90 p-5 sm:p-7 shadow-[0_8px_30px_rgba(74,52,42,0.06)] backdrop-blur-md transition-all duration-500 hover:border-[#7D5A44]/50 hover:shadow-[0_12px_40px_rgba(74,52,42,0.12)]">
        <div className="flex items-center justify-between border-b border-[#D7C9B8]/70 pb-3 sm:pb-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#7D5A44]/10 text-[#7D5A44]">
              <FileText className="h-3.5 w-3.5" />
            </span>
            <p className="font-mono text-[10px] sm:text-[11px] uppercase font-semibold tracking-wider text-[#4A342A]/70">Summary</p>
          </div>
          <span className="flex items-center gap-1 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-[#7D5A44]">
            <CheckCircle2 className="h-3 w-3" />
            Verified
          </span>
        </div>
        <p className="mt-3.5 sm:mt-4 font-sans text-xs sm:text-sm leading-relaxed font-medium text-[#4A342A]">
          This is a 12-month apartment lease. Rent is fixed for the term, but subletting
          needs written approval, and leaving early costs two months&apos; rent.
        </p>
      </div>
    ),
  },
  {
    tag: "Risk-flagged clauses",
    title: "See what actually matters, ranked",
    body: "Every clause is scanned for what affects your money, rights, or obligations — and flagged by how much it matters.",
    icon: ShieldAlert,
    mock: (
      <div className="group relative space-y-2.5 sm:space-y-3 rounded-2xl sm:rounded-3xl border border-[#D7C9B8] bg-[#F5F1EA]/90 p-5 sm:p-7 shadow-[0_8px_30px_rgba(74,52,42,0.06)] backdrop-blur-md transition-all duration-500 hover:border-[#7D5A44]/50 hover:shadow-[0_12px_40px_rgba(74,52,42,0.12)]">
        <div className="flex items-center justify-between border-b border-[#D7C9B8]/70 pb-3 sm:pb-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#7D5A44]/10 text-[#7D5A44]">
              <ShieldAlert className="h-3.5 w-3.5" />
            </span>
            <p className="font-mono text-[10px] sm:text-[11px] uppercase font-semibold tracking-wider text-[#4A342A]/70">
              Risk Assessment
            </p>
          </div>
          <span className="font-mono text-[9px] sm:text-[10px] text-[#4A342A]/50">3 Flags Found</span>
        </div>
        {[
          { label: "Early termination fee", level: "high", color: "bg-[#7D5A44]" },
          { label: "Rent increase notice", level: "medium", color: "bg-[#B2967D]" },
          { label: "Right to sublet", level: "low", color: "bg-[#D7C9B8]" },
        ].map((row, idx) => (
          <motion.div 
            key={row.label} 
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-[#D7C9B8]/60 bg-[#F5F1EA] p-2.5 sm:p-3 shadow-2xs transition-all hover:border-[#B2967D]"
          >
            <span className={`h-2 sm:h-2.5 w-2 sm:w-2.5 rounded-full shrink-0 ${row.color}`} />
            <span className="font-sans text-xs sm:text-sm font-semibold text-[#4A342A] truncate">{row.label}</span>
            <span className="ml-auto shrink-0 rounded-full bg-[#4A342A]/10 px-2 sm:px-2.5 py-0.5 font-mono text-[9px] sm:text-[10px] uppercase font-bold text-[#4A342A]/80">
              {row.level}
            </span>
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    tag: "Grounded Q&A",
    title: "Ask it the question you actually have",
    body: "Answers are pulled from your document's own text using retrieval search — never a generic legal-advice guess.",
    icon: MessageSquareText,
    mock: (
      <div className="group relative rounded-2xl sm:rounded-3xl border border-[#D7C9B8] bg-[#F5F1EA]/90 p-5 sm:p-7 shadow-[0_8px_30px_rgba(74,52,42,0.06)] backdrop-blur-md transition-all duration-500 hover:border-[#7D5A44]/50 hover:shadow-[0_12px_40px_rgba(74,52,42,0.12)]">
        <div className="ml-auto mb-3 w-fit max-w-[90%] sm:max-w-[85%] rounded-2xl bg-[#4A342A] px-3.5 py-2.5 sm:px-4 sm:py-3 font-sans text-xs sm:text-sm text-[#F5F1EA] shadow-md">
          What if I need to leave after 6 months?
        </div>
        <div className="w-fit max-w-[90%] sm:max-w-[85%] rounded-2xl border border-[#B2967D]/60 bg-[#B2967D]/25 px-3.5 py-2.5 sm:px-4 sm:py-3 font-sans text-xs sm:text-sm leading-relaxed text-[#4A342A] font-medium shadow-2xs">
          You&apos;d owe an early termination fee equal to two months&apos; rent, per Section 8.
        </div>
      </div>
    ),
  },
];

export default function FeatureShowcase() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="features" className="relative isolate mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28 text-[#4A342A]">
      {/* Background Ambient Glow */}
      <div 
        aria-hidden="true" 
        className="absolute inset-x-0 top-1/2 -z-10 flex justify-center overflow-hidden pointer-events-none"
      >
        <div className="h-[300px] w-[500px] sm:h-[450px] sm:w-[800px] rounded-full bg-[#B2967D]/15 blur-[100px] sm:blur-[140px]" />
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center sm:text-left space-y-2 sm:space-y-3"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-[#B2967D]/40 bg-[#B2967D]/15 px-3.5 py-1 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[#7D5A44] shadow-xs backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#7D5A44]" />
          <span>Capabilities</span>
        </div>
        <h2 className="font-display text-2xl tracking-tight text-[#4A342A] sm:text-4xl lg:text-5xl">
          Built to answer, not just summarize
        </h2>
      </motion.div>

      {/* Feature Grid List */}
      <div className="mt-12 sm:mt-16 lg:mt-20 space-y-12 sm:space-y-16 lg:space-y-20">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <Reveal
              key={f.tag}
              className={`grid grid-cols-1 items-center gap-6 sm:gap-10 lg:grid-cols-2 lg:gap-16 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
              delay={i * 0.08}
            >
              <div className="space-y-2.5 sm:space-y-3 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 font-mono text-[11px] sm:text-xs uppercase font-semibold tracking-wider text-[#7D5A44]">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-[#B2967D]" />
                  <span>{f.tag}</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl lg:text-3xl text-[#4A342A] leading-tight">
                  {f.title}
                </h3>
                <p className="mx-auto sm:mx-0 max-w-md font-sans text-xs sm:text-sm lg:text-[15px] leading-relaxed text-[#4A342A]/75">
                  {f.body}
                </p>
              </div>

              <motion.div 
                whileHover={reduceMotion ? {} : { y: -4, scale: 1.01 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full"
              >
                {f.mock}
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}