"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles, Menu, X, ArrowUpRight, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const navLinks = [
    { name: "How it works", href: "#how-it-works" },
    { name: "Capabilities", href: "#features" },
    { name: "FAQ", href: "#faq" },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.3,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: reduceMotion ? 0 : 0.4,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: -10, filter: "blur(4px)" },
    open: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  return (
    <motion.header 
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 border-b border-[#D7C9B8]/70 bg-[#F5F1EA]/80 backdrop-blur-md transition-all duration-300"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Brand Lockup: Logo + Full "Redline AI" text with magnetic hover effect */}
        <Link href="/" className="group inline-flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <Image 
              src="/logo.png" 
              alt="Redline AI" 
              width={140} 
              height={100} 
              className="h-10 w-11 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-2deg]" 
            />
            <span className="absolute -inset-1 -z-10 rounded-full bg-[#B2967D]/20 blur-md opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
          
          <div className="flex items-center gap-1.5 font-display text-xl font-bold tracking-tight text-[#4A342A]">
            <span className="relative">
              Redline
              <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-[#B2967D] transition-all duration-300 group-hover:w-full" />
            </span>
            <span className="rounded-full border border-[#B2967D]/40 bg-[#B2967D]/15 px-2 py-0.5 font-mono text-[10px] uppercase font-semibold text-[#7D5A44] shadow-xs">
              AI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 font-sans text-sm text-[#4A342A]/80 md:flex">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="relative py-1 transition-colors hover:text-[#4A342A] group"
            >
              <span>{link.name}</span>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#7D5A44] transition-all duration-300 ease-out group-hover:w-full" />
            </a>
          ))}
          
          <motion.div 
            whileHover={reduceMotion ? {} : { scale: 1.04, y: -1 }} 
            whileTap={reduceMotion ? {} : { scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Link
              href="/chat"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#7D5A44] px-5 py-2 font-sans text-sm font-medium text-[#F5F1EA] shadow-sm transition-all duration-300 hover:bg-[#684936] hover:shadow-md"
            >
              {/* Shimmer sweep effect on button */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#F5F1EA]/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              
              <Sparkles className="h-3.5 w-3.5 text-[#D7C9B8] transition-transform duration-300 group-hover:rotate-12" />
              <span>Analyze a document</span>
            </Link>
          </motion.div>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <motion.button
          whileTap={reduceMotion ? {} : { scale: 0.9 }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="relative rounded-xl border border-[#D7C9B8]/60 bg-[#F5F1EA] p-2 text-[#4A342A] shadow-xs transition-colors hover:bg-[#D7C9B8]/30 md:hidden"
          aria-label="Toggle navigation menu"
        >
          <AnimatePresence mode="wait">
            {mobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden border-b border-[#D7C9B8] bg-[#F5F1EA]/95 backdrop-blur-xl px-6 pb-6 pt-3 md:hidden"
          >
            <div className="flex flex-col gap-4 font-sans text-sm text-[#4A342A]">
              {navLinks.map((link) => (
                <motion.a 
                  key={link.name}
                  variants={itemVariants}
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 border-b border-[#D7C9B8]/40 transition-colors hover:text-[#7D5A44]"
                >
                  <span>{link.name}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B2967D]" />
                </motion.a>
              ))}

              <motion.div variants={itemVariants} className="pt-2">
                <Link
                  href="/chat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7D5A44] py-3.5 text-center font-sans text-sm font-semibold text-[#F5F1EA] shadow-md transition-all duration-200 active:scale-98"
                >
                  <Sparkles className="h-4 w-4 text-[#D7C9B8]" />
                  <span>Analyze a document</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}