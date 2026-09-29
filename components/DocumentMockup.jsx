"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { AlertTriangle, FileText, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";

const lines = [
  { width: "94%" },
  { width: "82%" },
  { width: "88%", highlighted: true },
  { width: "68%" },
  { width: "90%" },
  { width: "74%" },
];

export default function DocumentMockup() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const springX = useSpring(pointerX, { stiffness: 120, damping: 20, mass: 0.5 });
  const springY = useSpring(pointerY, { stiffness: 120, damping: 20, mass: 0.5 });

  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);

  function handlePointerMove(event) {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto px-2 sm:px-0">
      <motion.div
        className="relative w-full select-none perspective-1000"
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
        animate={reduceMotion ? {} : { y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
      >
        {/* Editorial Shadow Plate */}
        <div 
          aria-hidden="true" 
          className="absolute -bottom-3 -right-3 sm:-bottom-6 sm:-right-6 -z-10 h-full w-full rounded-2xl sm:rounded-3xl border border-[#D7C9B8]/50 bg-gradient-to-br from-[#D7C9B8]/30 to-[#B2967D]/20 backdrop-blur-md shadow-xl transition-all duration-300" 
        />

        {/* Main Glass Document Container */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#D7C9B8] bg-[#F5F1EA]/95 p-4 sm:p-6 lg:p-8 shadow-[0_8px_32px_rgba(74,52,42,0.12),0_24px_60px_rgba(74,52,42,0.08)] backdrop-blur-xl">
          
          {/* Document Header Bar */}
          <div className="mb-4 flex items-center justify-between border-b border-[#D7C9B8]/80 pb-3 sm:mb-6 sm:pb-4">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 pr-2">
              <div className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-lg bg-[#7D5A44]/10 border border-[#7D5A44]/20 text-[#7D5A44]">
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <span className="truncate font-mono text-[11px] sm:text-xs font-semibold tracking-wide text-[#4A342A]">
                tenancy_agreement.pdf
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <span className="inline-flex items-center gap-1 rounded-full border border-[#7D5A44]/20 bg-[#7D5A44]/10 px-2 sm:px-2.5 py-0.5 font-mono text-[9px] sm:text-[10px] font-medium uppercase text-[#7D5A44]">
                <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#B2967D]" />
                <span>Grounded</span>
              </span>
              <span className="hidden font-mono text-[11px] sm:text-xs text-[#4A342A]/50 xs:inline">
                pg. 4 of 12
              </span>
            </div>
          </div>

          {/* Text Lines Simulation */}
          <div className="space-y-2.5 sm:space-y-4">
            {lines.map((line, i) => (
              <div key={i} className={`relative ${i > 3 ? "hidden xs:block" : ""}`}>
                <motion.div
                  className="h-2 sm:h-2.5 lg:h-3 rounded-md bg-[#4A342A]/10"
                  style={{ width: line.width }}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reduceMotion ? 0 : i * 0.06, duration: 0.3 }}
                />

                {line.highlighted && (
                  <motion.div
                    className="absolute inset-0 h-2 sm:h-2.5 lg:h-3 rounded-md bg-gradient-to-r from-[#B2967D] to-[#7D5A44] shadow-[0_0_16px_rgba(178,150,125,0.5)] origin-left"
                    style={{ width: line.width }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      delay: reduceMotion ? 0 : 0.8,
                      duration: reduceMotion ? 0 : 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Floating AI Risk Intelligence Card */}
          <motion.div
            className="relative mt-4 sm:mt-6 lg:mt-8 rounded-xl sm:rounded-2xl border border-[#7D5A44]/30 bg-gradient-to-b from-[#F5F1EA] to-[#E9E1D5]/60 p-3.5 sm:p-5 shadow-lg backdrop-blur-md"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: reduceMotion ? 0 : 1.2,
              duration: reduceMotion ? 0 : 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Top Line Meta */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#7D5A44]">
                <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#7D5A44] shrink-0" />
                <span>Early Exit Clause</span>
              </div>

              <motion.span
                className="inline-flex items-center gap-1 rounded-full border border-[#7D5A44]/30 bg-[#7D5A44] px-2 sm:px-2.5 py-0.5 font-mono text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider text-[#F5F1EA] shadow-xs shrink-0"
                animate={
                  reduceMotion
                    ? {}
                    : {
                        boxShadow: [
                          "0 0 0px rgba(125,90,68,0)",
                          "0 0 10px rgba(125,90,68,0.4)",
                          "0 0 0px rgba(125,90,68,0)",
                        ],
                      }
                }
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ShieldAlert className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#D7C9B8]" />
                <span>High Risk</span>
              </motion.span>
            </div>

            {/* Impact Statement */}
            <p className="mt-2 sm:mt-2.5 font-sans text-xs sm:text-sm leading-relaxed text-[#4A342A] font-medium">
              You&apos;ll owe two months&apos; rent if you leave before month 10 — even with 60 days&apos; notice.
            </p>

            {/* Verification Footnote */}
            <div className="mt-3 sm:mt-3.5 flex items-center justify-between border-t border-[#D7C9B8]/60 pt-2 sm:pt-2.5 font-mono text-[9px] sm:text-[10px] text-[#4A342A]/60">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#7D5A44] shrink-0" />
                Verified in Section 8.2
              </span>
              <span>Ref: Para 3</span>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}