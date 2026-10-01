"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FileText, Sparkles, CheckCircle2, AlertCircle, ShieldCheck, Scroll, FileSpreadsheet, Stethoscope, Landmark } from "lucide-react";

const documentTypes = [
  { 
    title: "Lease agreements", 
    detail: "Rent, notice, repairs", 
    icon: Scroll, 
    iconBg: "bg-[#7D5A44]/10",
    accentColor: "#7D5A44" 
  },
  { 
    title: "Insurance policies", 
    detail: "Coverage, exclusions", 
    icon: ShieldCheck, 
    iconBg: "bg-[#B2967D]/15",
    accentColor: "#B2967D" 
  },
  { 
    title: "Medical forms", 
    detail: "Consent, conditions", 
    icon: Stethoscope, 
    iconBg: "bg-[#7D5A44]/10",
    accentColor: "#7D5A44" 
  },
  { 
    title: "Loan documents", 
    detail: "Rates, repayment", 
    icon: Landmark, 
    iconBg: "bg-[#B2967D]/15",
    accentColor: "#B2967D" 
  },
  { 
    title: "Terms & conditions", 
    detail: "Renewals, cancellation", 
    icon: FileSpreadsheet, 
    iconBg: "bg-[#7D5A44]/10",
    accentColor: "#7D5A44" 
  },
];

export default function SupportedDocuments() {
  const reduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.94, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0 : 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative isolate overflow-hidden border-y border-[#D7C9B8]/70 bg-gradient-to-b from-[#E9E1D5]/40 via-[#F5F1EA]/60 to-[#E9E1D5]/40 py-24 sm:py-32">
      {/* Editorial Radial Ambient Glow */}
      <motion.div 
        aria-hidden="true" 
        animate={
          reduceMotion
            ? {}
            : {
                scale: [1, 1.15, 1],
                opacity: [0.12, 0.25, 0.12],
              }
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 flex justify-center pointer-events-none"
      >
        <div className="h-[400px] w-[600px] rounded-full bg-[#B2967D]/20 blur-[130px]" />
      </motion.div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B2967D]/40 bg-[#B2967D]/15 px-3.5 py-1 font-mono text-xs uppercase tracking-widest text-[#7D5A44] shadow-xs backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#7D5A44]" />
            <span>Made for real-life paperwork</span>
          </div>

          <h2 className="font-display text-3xl tracking-tight text-[#4A342A] sm:text-4xl lg:text-5xl">
            The documents that shape your decisions
          </h2>

          <p className="font-sans text-base leading-relaxed text-[#4A342A]/75 sm:text-lg">
            Redline dissects complex terminology across everyday legal agreements to highlight critical obligations before you sign.
          </p>
        </motion.div>

        {/* Animated Centered Document Type Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5"
        >
          {documentTypes.map((item) => {
            const IconComponent = item.icon || FileText;

            return (
              <motion.div
                key={item.title}
                variants={itemVariants}
                whileHover={reduceMotion ? {} : { y: -6, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group relative flex flex-col items-center justify-between text-center rounded-3xl border border-[#D7C9B8] bg-[#F5F1EA]/80 p-6 shadow-xs backdrop-blur-sm transition-all duration-300 hover:border-[#7D5A44] hover:bg-[#F5F1EA] hover:shadow-lg"
              >
                {/* Glowing Background Hover Orb */}
                <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-[#7D5A44]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="flex flex-col items-center">
                  {/* Centered Animated Icon */}
                  <motion.div
                    whileHover={reduceMotion ? {} : { rotate: [0, -6, 6, 0] }}
                    transition={{ duration: 0.4 }}
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconBg} border border-[#D7C9B8]/60 text-[#7D5A44] shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:border-[#7D5A44]/40 group-hover:shadow-md`}
                  >
                    <IconComponent className="h-6 w-6 transition-transform duration-300 group-hover:scale-105" />
                  </motion.div>

                  {/* Centered Title */}
                  <h3 className="font-display text-lg text-[#4A342A] transition-colors duration-200 group-hover:text-[#7D5A44]">
                    {item.title}
                  </h3>

                  {/* Centered Detail Tag */}
                  <p className="mt-2 font-mono text-xs text-[#4A342A]/65 leading-relaxed">
                    {item.detail}
                  </p>
                </div>

                {/* Centered Status Indicator Bar */}
                <div className="mt-6 flex items-center justify-center gap-1.5 w-full border-t border-[#D7C9B8]/50 pt-3.5 font-mono text-[10px] uppercase tracking-wider text-[#7D5A44]/80">
                  <CheckCircle2 className="h-3 w-3 text-[#7D5A44]" />
                  <span>Fully Supported</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Centered Capability & Limit Disclaimer Note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mx-auto mt-12 flex items-center justify-center gap-2.5 rounded-2xl border border-[#D7C9B8]/70 bg-[#F5F1EA]/80 px-5 py-3.5 font-mono text-xs text-[#4A342A]/75 shadow-xs backdrop-blur-md max-w-xl text-center"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-[#7D5A44]" />
          <span>Selectable-text PDFs work directly. Scanned PDFs require an OCR service configured by the deployment.</span>
        </motion.div>

      </div>
    </section>
  );
}