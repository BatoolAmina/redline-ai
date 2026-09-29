"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, BookOpenCheck, MessageCircle, Sparkles, ShieldCheck, FileCheck2 } from "lucide-react";

export default function TrustSection() {
  const reduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0 : 0.75,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative isolate overflow-hidden border-y border-[#D7C9B8]/40 bg-[#4A342A] py-24 text-[#F5F1EA] sm:py-32">
      {/* Editorial Radial Background Glow */}
      <div 
        aria-hidden="true" 
        className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 flex justify-center pointer-events-none"
      >
        <div className="h-[500px] w-[700px] rounded-full bg-[#B2967D]/15 blur-[130px]" />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        
        {/* Interactive Verification Pipeline Card */}
        <motion.div
          initial={{ opacity: 0, x: -28, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: reduceMotion ? 0 : 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="order-2 lg:order-1"
        >
          <div className="relative overflow-hidden rounded-3xl border border-[#D7C9B8]/30 bg-[#36251E]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            
            {/* Header Badge */}
            <div className="mb-6 flex items-center justify-between border-b border-[#D7C9B8]/15 pb-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#B2967D]/40 bg-[#B2967D]/15 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#D7C9B8]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#B2967D]" />
                <span>Auditable RAG Flow</span>
              </div>
              <span className="font-mono text-[10px] uppercase text-[#D7C9B8]/60">100% Grounded</span>
            </div>

            {/* Step 1: Question */}
            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#B2967D]/20 text-[#B2967D] border border-[#B2967D]/30">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#D7C9B8]/60">Your question</p>
                  <p className="mt-1 font-sans text-sm font-medium text-[#F5F1EA]">What happens if I end my lease early?</p>
                </div>
              </div>

              {/* Connector */}
              <div className="ml-4 border-l border-dashed border-[#B2967D]/40 py-2 pl-6">
                <ArrowDown className="h-3.5 w-3.5 text-[#B2967D]/70" />
              </div>

              {/* Step 2: Source Citation */}
              <div className="flex items-start gap-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#B2967D]/20 text-[#B2967D] border border-[#B2967D]/30">
                  <BookOpenCheck className="h-4 w-4" />
                </div>
                <div className="w-full">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#D7C9B8]/60">Retrieved from your document &bull; Section 8</p>
                  <blockquote className="mt-2 rounded-xl border-l-2 border-[#B2967D] bg-[#4A342A]/60 p-3.5 font-mono text-xs leading-relaxed text-[#F5F1EA]/90 backdrop-blur-sm">
                    If the tenant terminates this agreement before the end of the term, an early termination fee equal to <span className="rounded bg-[#B2967D]/40 px-1.5 py-0.5 text-[#F5F1EA] font-semibold">two months of rent</span> is due.
                  </blockquote>
                </div>
              </div>

              {/* Connector */}
              <div className="ml-4 border-l border-dashed border-[#B2967D]/40 py-2 pl-6">
                <ArrowDown className="h-3.5 w-3.5 text-[#B2967D]/70" />
              </div>

              {/* Step 3: Plain Answer */}
              <div className="flex items-start gap-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#B2967D]/20 text-[#B2967D] border border-[#B2967D]/30">
                  <Sparkles className="h-4 w-4 text-[#B2967D]" />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#D7C9B8]/60">Grounded answer</p>
                  <p className="mt-1 font-sans text-sm leading-relaxed text-[#F5F1EA]">The document says ending the lease early costs two months&apos; rent.</p>
                </div>
              </div>
            </div>

            {/* Document Preview Image Card */}
            <div className="relative mt-8 h-44 sm:h-52 overflow-hidden rounded-2xl border border-[#D7C9B8]/20">
              <Image
                src="/legal-reference.png"
                alt="Document Verification Preview"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#36251E] via-[#36251E]/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-[#D7C9B8]/80">
                <span className="flex items-center gap-1.5"><FileCheck2 className="h-3.5 w-3.5 text-[#B2967D]" /> Citation Tagged</span>
                <span>Page 4 of 12</span>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Narrative & Mission Column */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="order-1 lg:order-2 space-y-6"
        >
          <motion.p variants={itemVariants} className="font-mono text-xs uppercase tracking-widest text-[#D7C9B8]/70">
            The problem Redline exists for
          </motion.p>

          <motion.h2 variants={itemVariants} className="font-display text-3xl leading-[1.12] tracking-tight text-[#F5F1EA] sm:text-4xl lg:text-5xl">
            Most people sign documents they don&apos;t fully understand
          </motion.h2>

          <motion.p variants={itemVariants} className="font-sans text-base leading-relaxed text-[#F5F1EA]/80 sm:text-lg">
            Rental leases, insurance policies, and medical consent forms are written for
            lawyers, not for the people who have to live with them. That gap is exactly
            what gets exploited — a fee buried in clause 14, a coverage exclusion in
            paragraph three. Redline reads it the way a knowledgeable friend would,
            before you sign anything.
          </motion.p>

          <motion.div variants={itemVariants} className="pt-4 border-t border-[#D7C9B8]/20 flex flex-wrap items-center gap-6 font-mono text-xs text-[#D7C9B8]">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#B2967D]" />
              Clear Clause Rankings
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#B2967D]" />
              Zero Jargon
            </span>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}