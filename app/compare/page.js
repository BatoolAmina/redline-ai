"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Sparkles, FileText } from "lucide-react";
import CompareDocuments from "@/components/CompareDocuments";

export default function ComparePage() {
  const reduceMotion = useReducedMotion();

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const mainVariants = {
    hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0 : 0.6,
        delay: 0.1,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.5,
        delay: 0.25,
      },
    },
  };

  return (
    <div className="relative isolate min-h-[100vh] bg-[#F5F1EA] text-[#4A342A] flex flex-col justify-between overflow-hidden">
      {/* Editorial Ambient Background Radial Glow */}
      <motion.div
        aria-hidden="true"
        animate={
          reduceMotion
            ? {}
            : {
                scale: [1, 1.15, 1],
                opacity: [0.15, 0.25, 0.15],
              }
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden pointer-events-none"
      >
        <div className="h-[250px] w-[350px] sm:h-[400px] sm:w-[700px] rounded-full bg-[#B2967D]/20 blur-[90px] sm:blur-[130px]" />
      </motion.div>

      {/* Animated Header */}
      <motion.header
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="sticky top-0 z-50 border-b border-[#D7C9B8]/70 bg-[#F5F1EA]/80 backdrop-blur-md transition-all duration-300"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-8 sm:py-4">
          
          {/* Brand Lockup */}
          <Link href="/" className="group flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <div className="relative">
                <Image 
                  src="/logo.png" 
                  alt="Redline AI" 
                  width={55} 
                  height={40} 
                  className="h-8 w-10 sm:h-10 sm:w-12 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-2deg]" 
                />
                <span className="absolute -inset-1 -z-10 rounded-full bg-[#B2967D]/20 blur-md opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 font-display text-base sm:text-lg font-bold tracking-tight text-[#4A342A] truncate">
              <span className="relative">
                Redline
                <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-[#B2967D] transition-all duration-300 group-hover:w-full" />
              </span>
              <span className="rounded-full border border-[#B2967D]/40 bg-[#B2967D]/15 px-1.5 py-0.5 font-mono text-[8px] sm:text-[9px] uppercase font-semibold text-[#7D5A44] shadow-xs">
                AI
              </span>
            </div>
          </Link>

          {/* Privacy Indicator Badge */}
          <motion.div 
            whileHover={reduceMotion ? {} : { scale: 1.03 }}
            className="hidden items-center gap-2 rounded-full border border-[#D7C9B8]/80 bg-[#F5F1EA]/90 px-3.5 py-1 font-mono text-xs text-[#4A342A]/75 shadow-xs backdrop-blur-md lg:flex transition-colors hover:border-[#7D5A44]/50"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#7D5A44]" aria-hidden="true" />
            <span>Side-by-side diff analysis</span>
          </motion.div>

          {/* Back to Chat Link */}
          <motion.div 
            whileHover={reduceMotion ? {} : { scale: 1.04 }} 
            whileTap={reduceMotion ? {} : { scale: 0.97 }}
            className="shrink-0"
          >
            <Link 
              href="/chat" 
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D7C9B8] bg-[#F5F1EA] px-3 py-1.5 sm:px-4 sm:py-2 font-sans text-xs font-medium text-[#7D5A44] shadow-xs transition-all duration-300 hover:border-[#7D5A44] hover:bg-white hover:text-[#4A342A] hover:shadow-md"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
              <span className="hidden xs:inline sm:inline">Analyze one PDF</span>
              <span className="xs:hidden sm:hidden">Single PDF</span>
            </Link>
          </motion.div>

        </div>
      </motion.header>

      {/* Main Content Area */}
      <motion.main 
        variants={mainVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 w-full"
      >
        <CompareDocuments />
      </motion.main>

      {/* Single-Line Animated Footer */}
      <motion.footer 
        variants={footerVariants}
        initial="hidden"
        animate="visible"
        className="border-t border-[#D7C9B8]/80 bg-[#F5F1EA] px-4 py-3 sm:px-6 text-center font-sans text-xs leading-none text-[#4A342A]/65"
      >
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono text-[10px] sm:text-[11px] whitespace-nowrap py-2">
          <span className="inline-flex items-center gap-1.5 text-[#7D5A44] font-medium">
            <Sparkles className="h-3.5 w-3.5 text-[#B2967D] shrink-0" />
            Redline AI Document Intelligence
          </span>
          <span className="text-[#D7C9B8] hidden sm:inline">&bull;</span>
          <p className="text-[#4A342A]/60 truncate">
            Redline explains document text and is not a substitute for legal, medical, insurance, or financial advice.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}