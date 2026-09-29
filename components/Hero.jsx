"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import DocumentMockup from "./DocumentMockup";

export default function Hero() {
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 115]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const contentVariants = {
    hidden: {},
    visible: { 
      transition: { 
        staggerChildren: 0.12, 
        delayChildren: 0.12 
      } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22, filter: "blur(5px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { 
        duration: reduceMotion ? 0 : 0.72, 
        ease: [0.22, 1, 0.36, 1] 
      },
    },
  };

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative isolate min-h-[calc(100svh-4rem)] sm:min-h-[calc(100svh-5rem)] overflow-hidden bg-[#faf5f3]"
    >
      {/* Background Parallax Image with Blend Effects */}
      <motion.div
        aria-hidden="true"
        className="absolute -inset-[8%]"
        style={{ y: reduceMotion ? 0 : backgroundY, scale: reduceMotion ? 1 : backgroundScale }}
      >
        <Image
          src="/hero-image.png"
          alt="Modern contract document on wooden desk with warm lighting"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_56%] opacity-60 mix-blend-multiply"
        />
      </motion.div>
      
      {/* Dynamic Gradient Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#4A342A]/95 via-[#4A342A]/85 to-[#4A342A]/60 sm:via-[#4A342A]/75 sm:to-[#4A342A]/50"
      />
      
      {/* Floating Animated Ambient Glow Orb */}
      <motion.div
        aria-hidden="true"
        animate={
          reduceMotion
            ? {}
            : {
                scale: [1, 1.18, 1],
                opacity: [0.2, 0.38, 0.2],
                x: [0, 20, 0],
                y: [0, -15, 0],
              }
        }
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 -z-10 h-[280px] w-[280px] sm:h-[500px] sm:w-[500px] rounded-full bg-[#B2967D]/25 blur-[90px] sm:blur-[120px] pointer-events-none"
      />

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[#D7C9B8]/30" />

      {/* Main Grid Container */}
      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] sm:min-h-[calc(100svh-5rem)] max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-8 py-10 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-12">
        
        {/* Left Content Column */}
        <motion.div
          className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center justify-center lg:justify-start">
            <motion.span 
              whileHover={{ scale: 1.03 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#B2967D]/40 bg-[#B2967D]/15 px-3.5 py-1.5 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[#D7C9B8] shadow-xs backdrop-blur-md transition-colors hover:border-[#B2967D]/70"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#B2967D] shrink-0" />
              <span>For anyone who&apos;s ever clicked &quot;I agree&quot; without reading</span>
            </motion.span>
          </motion.div>

          {/* Headline with Staggered Line Animation */}
          <motion.h1
            variants={itemVariants}
            className="mt-5 font-display text-3xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.08] text-[#F5F1EA] tracking-tight"
          >
            Turn fine print into{" "}
            <span className="relative inline-block text-[#B2967D]">
              plain sense
              <motion.span
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.85, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-1 left-0 h-1 w-full origin-left bg-[#B2967D] rounded-full shadow-[0_0_12px_rgba(178,150,125,0.4)]"
              />
            </span>
            .
          </motion.h1>

          {/* Subtitle Body */}
          <motion.p
            variants={itemVariants}
            className="mt-4 sm:mt-6 max-w-xl mx-auto lg:mx-0 font-sans text-sm sm:text-lg leading-relaxed text-[#F5F1EA]/85"
          >
            Upload a contract, insurance policy, or medical form. Redline surfaces the clauses that
            matter and answers questions directly from the document itself.
          </motion.p>

          {/* CTA Button Group */}
          <motion.div
            variants={itemVariants}
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 sm:gap-5"
          >
            <motion.div
              whileHover={reduceMotion ? {} : { y: -3, scale: 1.02 }}
              whileTap={reduceMotion ? {} : { scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/chat"
                className="group relative inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-[#7D5A44] px-8 py-3.5 font-sans text-xs sm:text-sm font-semibold text-[#F5F1EA] shadow-md transition-all duration-300 hover:bg-[#684936] hover:shadow-xl hover:shadow-[#36251E]/50 overflow-hidden"
              >
                {/* Sweep Shimmer Effect */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#F5F1EA]/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                
                <span>Analyze a document</span>
                <ArrowUpRight className="h-4 w-4 text-[#D7C9B8] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 shrink-0" />
              </Link>
            </motion.div>

            <a
              href="#how-it-works"
              className="group inline-flex min-h-12 items-center justify-center px-6 font-sans text-xs sm:text-sm font-medium text-[#F5F1EA]/90 transition-colors hover:text-[#B2967D]"
            >
              <span className="relative">
                See how it works
                <span className="absolute bottom-0 left-0 h-[1.5px] w-full bg-[#B2967D]/60 transition-all duration-300 group-hover:bg-[#B2967D]" />
              </span>
            </a>
          </motion.div>

          {/* Bottom Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 border-t border-[#D7C9B8]/20 pt-5 font-mono text-[10px] sm:text-xs uppercase tracking-wider text-[#D7C9B8]/80"
          >
            <span className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-[#B2967D] shrink-0" />
              No account needed
            </span>
            <span className="hidden sm:inline text-[#D7C9B8]/40">&bull;</span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#B2967D] shrink-0" />
              Temporary in-memory analysis
            </span>
          </motion.div>
        </motion.div>

        {/* Right Document Mockup Column */}
        <motion.div
          className="flex justify-center lg:justify-end w-full"
          initial={{ opacity: 0, x: 28, rotateY: -8 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 1,
            delay: reduceMotion ? 0 : 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="w-full max-w-[320px] sm:max-w-md lg:max-w-lg transition-transform duration-300">
            <DocumentMockup />
          </div>
        </motion.div>

      </div>
    </section>
  );
}