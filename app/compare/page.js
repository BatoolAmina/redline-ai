"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import CompareDocuments from "@/components/CompareDocuments";
import WorkspaceNav from "@/components/WorkspaceNav";

export default function ComparePage() {
  const reduceMotion = useReducedMotion();

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
    <div className="relative isolate min-h-svh overflow-x-clip bg-[#F5F1EA] text-[#4A342A] flex flex-col justify-between">
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

      <WorkspaceNav mode="compare" />

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