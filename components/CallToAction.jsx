"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Lock, FileSearch } from "lucide-react";

export default function CallToAction() {
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
    <section className="relative isolate overflow-hidden bg-[#4A342A] py-28 text-[#F5F1EA] sm:py-36">
      {/* Editorial Ambient Background Layers */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#7D5A44]/45 via-[#4A342A] to-[#36251E]" 
      />
      
      {/* Animated Subtle Ambient Glow Orbs */}
      <motion.div
        aria-hidden="true"
        animate={
          reduceMotion
            ? {}
            : {
                scale: [1, 1.15, 1],
                opacity: [0.25, 0.4, 0.25],
              }
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#B2967D]/20 blur-[120px]"
      />

      {/* Decorative Warm Accent Border Lines */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D7C9B8]/30 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D7C9B8]/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Eyebrow Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#B2967D]/40 bg-[#B2967D]/15 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-[#D7C9B8] shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#B2967D]" />
              <span>Ready to clear the fine print?</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h2
            variants={itemVariants}
            className="mt-7 font-display text-4xl tracking-tight text-[#F5F1EA] sm:text-5xl lg:text-6xl lg:leading-[1.1]"
          >
            Understand before you sign.
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="mt-6 font-sans text-base leading-relaxed text-[#F5F1EA]/80 sm:text-lg lg:text-xl max-w-2xl mx-auto"
          >
            Upload any contract, lease, or agreement to flag hidden risks and get instant plain-language answers grounded strictly in source clauses.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
          >
            <motion.div
              whileHover={reduceMotion ? {} : { scale: 1.025, y: -2 }}
              whileTap={reduceMotion ? {} : { scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/chat"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-[#7D5A44] px-8 py-4 font-sans text-sm font-semibold text-[#F5F1EA] shadow-xl transition-all duration-300 hover:bg-[#684936] hover:shadow-2xl hover:shadow-[#36251E]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B2967D] w-full sm:w-auto overflow-hidden"
              >
                {/* Subtle Hover Shimmer Effect */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#F5F1EA]/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                
                <span>Analyze Your Document</span>
                <ArrowRight className="h-4 w-4 text-[#D7C9B8] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={reduceMotion ? {} : { scale: 1.025, y: -2 }}
              whileTap={reduceMotion ? {} : { scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-[#D7C9B8]/30 bg-[#F5F1EA]/5 px-8 py-4 font-sans text-sm font-medium text-[#F5F1EA] backdrop-blur-md transition-all duration-300 hover:border-[#D7C9B8]/60 hover:bg-[#F5F1EA]/10 w-full sm:w-auto"
              >
                See How It Works
              </Link>
            </motion.div>
          </motion.div>

          {/* Security & Verification Guarantees */}
          <motion.div
            variants={itemVariants}
            className="mt-12 pt-8 border-t border-[#D7C9B8]/15 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-xs text-[#D7C9B8]/80"
          >
            <span className="flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-[#B2967D]" />
              No account required
            </span>
            <span className="hidden sm:inline text-[#D7C9B8]/30">&bull;</span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#B2967D]" />
              Encrypted document storage
            </span>
            <span className="hidden sm:inline text-[#D7C9B8]/30">&bull;</span>
            <span className="flex items-center gap-2">
              <FileSearch className="h-3.5 w-3.5 text-[#B2967D]" />
              Auditable grounded answers
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}