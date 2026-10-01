"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ShieldCheck, Sparkles, Heart } from "lucide-react";

export default function Footer() {
  const reduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
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
    <footer className="relative isolate overflow-hidden border-t border-[#D7C9B8]/80 bg-[#F5F1EA] pt-14 sm:pt-16 lg:pt-20 pb-8 sm:pb-5 text-[#4A342A]">
      {/* Editorial Ambient Background Glow */}
      <motion.div
        aria-hidden="true"
        animate={
          reduceMotion
            ? {}
            : {
                scale: [1, 1.15, 1],
                opacity: [0.12, 0.22, 0.12],
              }
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/2 -z-10 h-[300px] w-[90vw] max-w-[700px] -translate-x-1/2 rounded-full bg-[#B2967D]/25 blur-[100px] pointer-events-none"
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Top Grid Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 pb-10 sm:pb-7"
        >
          {/* Brand & Purpose Statement */}
          <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col justify-between space-y-5">
            <div className="space-y-3.5">
              <Link href="/" className="group inline-flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Redline AI"
                  width={55}
                  height={40}
                  className="h-10 w-12 object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="flex items-center gap-1.5 font-display text-2xl font-bold tracking-tight text-[#4A342A]">
                  <span>Redline</span>
                  <span className="rounded-full border border-[#B2967D]/40 bg-[#B2967D]/15 px-2 py-0.5 font-mono text-[9px] uppercase font-semibold text-[#7D5A44]">
                    AI
                  </span>
                </div>
              </Link>

              <p className="max-w-sm font-sans text-xs sm:text-sm leading-relaxed text-[#4A342A]/80">
                Transforming complex contracts, leases, and fine print into plain, grounded language before you sign.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {/* Feature Badges */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#4A342A]/75">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D7C9B8] bg-[#F5F1EA] px-3 py-1 shadow-2xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#7D5A44]" />
                  <span>Encrypted Document Storage</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D7C9B8] bg-[#F5F1EA] px-3 py-1 shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-[#B2967D]" />
                  <span>Grounded RAG</span>
                </div>
              </div>

              {/* Sole Creator Credit Badge */}
              <div>
                <motion.div 
                  whileHover={reduceMotion ? {} : { scale: 1.01 }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#B2967D]/40 bg-[#B2967D]/10 px-3.5 py-1.5 font-mono text-xs text-[#4A342A]/80 shadow-2xs transition-colors hover:border-[#7D5A44]/60"
                >
                  <span>Designed &amp; Developed by</span>
                  <span className="font-semibold text-[#7D5A44] inline-flex items-center gap-1">
                    Batool Amina
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-8 sm:grid-cols-3 pt-2 lg:pt-0">
            <motion.div variants={itemVariants}>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#7D5A44]">
                Product
              </p>
              <ul className="mt-4 space-y-2.5 font-sans text-xs sm:text-sm text-[#4A342A]/80">
                {[
                  { href: "#features", label: "Capabilities" },
                  { href: "#how-it-works", label: "How It Works" },
                  { href: "/chat", label: "Document Analyzer" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 transition-colors hover:text-[#7D5A44]"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute bottom-0 left-0 h-px w-0 bg-[#7D5A44] transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#7D5A44]">
                Resources
              </p>
              <ul className="mt-4 space-y-2.5 font-sans text-xs sm:text-sm text-[#4A342A]/80">
                <li>
                  <Link href="#faq" className="group inline-flex items-center gap-1 transition-colors hover:text-[#7D5A44]">
                    <span className="relative">
                      FAQ
                      <span className="absolute bottom-0 left-0 h-px w-0 bg-[#7D5A44] transition-all duration-300 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/compare" className="group inline-flex items-center gap-1 transition-colors hover:text-[#7D5A44]">
                    <span className="relative">
                      Compare documents
                      <span className="absolute bottom-0 left-0 h-px w-0 bg-[#7D5A44] transition-all duration-300 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="col-span-2 sm:col-span-1">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#7D5A44]">
                Event
              </p>
              <motion.div
                whileHover={reduceMotion ? {} : { y: -2 }}
                className="group relative mt-4 overflow-hidden rounded-2xl border border-[#D7C9B8] bg-[#F5F1EA] p-4 shadow-2xs transition-all hover:border-[#7D5A44]"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-mono text-xs font-bold text-[#4A342A] group-hover:text-[#7D5A44] transition-colors">
                    Hack-A-Throne 2026
                  </p>
                  <span className="h-2 w-2 rounded-full bg-[#B2967D]" />
                </div>
                <p className="font-sans text-xs text-[#4A342A]/70 leading-relaxed">
                  AI &amp; Intelligent Systems Track
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#D7C9B8]/80 pt-6 font-mono text-xs text-[#4A342A]/60"
        >
          <p>&copy; {new Date().getFullYear()} Redline AI Document Intelligence. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1 text-[#4A342A]/70">
              Made with <Heart className="h-3 w-3 fill-[#7D5A44] text-[#7D5A44]" /> for clear fine print
            </span>
            <a
              href="#top"
              className="group inline-flex items-center gap-1 uppercase tracking-wider text-[#7D5A44] hover:text-[#4A342A] transition-colors"
            >
              <span>Back to top</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}