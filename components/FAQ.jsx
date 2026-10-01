"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus, Minus, HelpCircle, Sparkles } from "lucide-react";

const faqs = [
  {
    question: "Is my document stored on your servers?",
    answer: "Extracted text and embeddings are encrypted and stored in Postgres so you can ask questions. Document access expires after two hours. Deployments must run the scheduled cleanup to remove expired encrypted data; you can delete a session sooner."
  },
  {
    question: "How does Redline analyze legal terminology accurately?",
    answer: "Redline utilizes grounded retrieval-augmented generation (RAG). Instead of making generic legal guesses, it extracts exact text passages from your document, evaluates risk conditions, and provides explanations strictly tied to your file's source clauses."
  },
  {
    question: "Can I upload scanned PDFs or image-based contracts?",
    answer: "Selectable-text PDFs work directly. Scanned or image-only PDFs require an OCR service configured by the deployment."
  },
  {
    question: "Does Redline offer legal advice?",
    answer: "Redline is an educational tool designed to help you read, understand, and flag key terms in contracts faster. It is not a licensed legal service or a substitute for professional legal counsel."
  },
  {
    question: "What document types work best with Redline?",
    answer: "Redline performs exceptionally well on residential leases, employment contracts, software licenses, NDAs, insurance policies, and terms of service agreements."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const reduceMotion = useReducedMotion();

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0 : 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section id="faq" className="relative isolate border-t border-[#D7C9B8]/70 bg-gradient-to-b from-[#F5F1EA] via-[#F5F1EA]/80 to-[#F5F1EA] py-16 sm:py-24 lg:py-32">
      {/* Subtle Ambient Radial Glow */}
      <div 
        aria-hidden="true" 
        className="absolute inset-x-0 top-1/4 -z-10 flex justify-center overflow-hidden pointer-events-none"
      >
        <div className="h-[250px] w-[350px] sm:h-[400px] sm:w-[600px] rounded-full bg-[#B2967D]/10 blur-[80px] sm:blur-[100px]" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-3 sm:space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B2967D]/40 bg-[#B2967D]/15 px-3.5 py-1.5 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[#7D5A44] shadow-xs backdrop-blur-md">
            <HelpCircle className="h-3.5 w-3.5 text-[#7D5A44] shrink-0" />
            <span>Got Questions?</span>
          </div>

          <h2 className="font-display text-2xl tracking-tight text-[#4A342A] sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>

          <p className="mx-auto max-w-xl font-sans text-sm leading-relaxed text-[#4A342A]/75 sm:text-base lg:text-lg">
            Everything you need to know about document privacy, risk detection, and grounded analysis.
          </p>
        </motion.div>

        {/* Animated Accordion List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-10 sm:mt-14 space-y-3 sm:space-y-4"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-[#7D5A44] bg-[#F5F1EA] shadow-md ring-1 ring-[#7D5A44]/20"
                    : "border-[#D7C9B8] bg-[#F5F1EA]/90 hover:border-[#B2967D] hover:bg-[#F5F1EA]"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  className="flex w-full items-center justify-between gap-3 p-4 sm:p-6 lg:p-7 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D5A44]"
                >
                  <span className="font-display text-base text-[#4A342A] sm:text-lg lg:text-xl transition-colors duration-200 group-hover:text-[#7D5A44]">
                    {faq.question}
                  </span>

                  <div
                    className={`flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      isOpen
                        ? "border-[#7D5A44] bg-[#7D5A44] text-[#F5F1EA] rotate-180"
                        : "border-[#D7C9B8] bg-[#D7C9B8]/20 text-[#4A342A]/70 group-hover:border-[#B2967D] group-hover:text-[#4A342A]"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    ) : (
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[#D7C9B8]/50 px-4 pb-5 pt-3.5 sm:px-6 sm:pb-6 sm:pt-4 lg:px-7 lg:pb-7 font-sans text-xs sm:text-sm lg:text-[15px] leading-relaxed text-[#4A342A]/80">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Trust Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <p className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 font-mono text-[11px] sm:text-xs text-[#4A342A]/60 px-2">
            <Sparkles className="h-3.5 w-3.5 text-[#B2967D] shrink-0" />
            <span>Have a specific legal document question? Try our interactive analyzer live.</span>
          </p>
        </motion.div>

      </div>
    </section>
  );
}