"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";

export default function AuthForm({ mode = "login" }) {
  const isSignup = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignup) {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Sign up failed.");
      }
      const result = await signIn("credentials", { email, password, redirect: false, callbackUrl: "/chat" });
      if (result?.error) throw new Error("Email or password is incorrect.");
      router.push("/chat");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0 : 0.65,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const formVariants = {
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
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.4, ease: "easeOut" },
    },
  };

  const inputClasses =
    "w-full rounded-2xl border border-[#D7C9B8] bg-white/80 px-4 py-2.5 sm:py-3 font-sans text-xs sm:text-sm text-[#4A342A] shadow-2xs outline-none focus:outline-none focus:ring-0 focus:border-[#7D5A44] focus:bg-white transition-all duration-200";

  return (
    <main className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-[#faf5f3] px-4 sm:px-6 py-12 text-[#4A342A]">
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
        className="absolute top-1/2 left-1/2 -z-10 h-[350px] w-[350px] sm:h-[500px] sm:w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B2967D]/30 blur-[100px] sm:blur-[130px] pointer-events-none"
      />

      <motion.section
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md rounded-3xl border border-[#D7C9B8]/80 bg-[#F5F1EA]/90 p-6 sm:p-10 shadow-xl shadow-[#4A342A]/5 backdrop-blur-xl"
      >
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center justify-center rounded-2xl border border-[#B2967D]/40 bg-[#B2967D]/15 p-3 text-[#7D5A44] shadow-xs"
          >
            <ShieldCheck className="h-7 w-7 text-[#7D5A44]" aria-hidden="true" />
          </motion.div>
          
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#4A342A] pt-2">
            {isSignup ? "Create your Redline account" : "Welcome back"}
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#4A342A]/75">
            Keep your documents in a private workspace.
          </p>
        </div>

        <motion.div variants={formVariants} initial="hidden" animate="visible" className="mt-8 space-y-4">
          <motion.button
            variants={itemVariants}
            whileHover={reduceMotion ? {} : { scale: 1.015, y: -1 }}
            whileTap={reduceMotion ? {} : { scale: 0.985 }}
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/chat" })}
            className="group relative flex w-full items-center justify-center gap-3 rounded-2xl border border-[#D7C9B8] bg-white px-5 py-3 font-sans text-xs sm:text-sm font-medium text-[#4A342A] shadow-2xs transition-all duration-300 hover:border-[#7D5A44] hover:shadow-md"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </motion.button>

          <motion.div variants={itemVariants} className="flex items-center gap-3 py-1 font-mono text-xs uppercase tracking-wider text-[#4A342A]/40">
            <span className="h-px flex-1 bg-[#D7C9B8]/70" />
            <span>or</span>
            <span className="h-px flex-1 bg-[#D7C9B8]/70" />
          </motion.div>

          <form onSubmit={submit} className="space-y-4">
            {isSignup && (
              <motion.label variants={itemVariants} className="block space-y-1.5 font-sans text-xs sm:text-sm font-medium text-[#4A342A]">
                <span>Name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={inputClasses}
                  autoComplete="name"
                  placeholder="Jane Doe"
                  maxLength={100}
                />
              </motion.label>
            )}

            <motion.label variants={itemVariants} className="block space-y-1.5 font-sans text-xs sm:text-sm font-medium text-[#4A342A]">
              <span>Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClasses}
                autoComplete="email"
                placeholder="name@example.com"
                maxLength={254}
              />
            </motion.label>

            <motion.label variants={itemVariants} className="block space-y-1.5 font-sans text-xs sm:text-sm font-medium text-[#4A342A]">
              <span>Password</span>
              <input
                required
                minLength={8}
                maxLength={128}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClasses}
                autoComplete={isSignup ? "new-password" : "current-password"}
                placeholder="••••••••"
              />
            </motion.label>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-[#C1442E]/30 bg-[#C1442E]/10 px-3.5 py-2.5 font-sans text-xs text-[#8F2E20]"
                role="alert"
              >
                {error}
              </motion.p>
            )}

            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                whileHover={reduceMotion ? {} : { scale: 1.015, y: -1 }}
                whileTap={reduceMotion ? {} : { scale: 0.985 }}
                type="submit"
                disabled={loading}
                className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7D5A44] px-5 py-3 sm:py-3.5 font-sans text-xs sm:text-sm font-semibold text-[#F5F1EA] shadow-md transition-all duration-300 hover:bg-[#684936] hover:shadow-lg disabled:opacity-60 overflow-hidden"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#F5F1EA]/15 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                <span>{loading ? "Please wait..." : isSignup ? "Create account" : "Sign in with email"}</span>
                {!loading && <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>

        <div className="mt-8 space-y-3 pt-4 border-t border-[#D7C9B8]/60 text-center font-sans text-xs sm:text-sm text-[#4A342A]/75">
          <p>
            {isSignup ? "Already have an account? " : "Need an account? "}
            <Link
              href={isSignup ? "/login" : "/signup"}
              className="font-semibold text-[#7D5A44] underline decoration-[#B2967D]/60 underline-offset-4 transition-colors hover:text-[#4A342A]"
            >
              {isSignup ? "Sign in" : "Sign up"}
            </Link>
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-1 font-medium text-[#7D5A44] transition-colors hover:text-[#4A342A]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return home</span>
          </Link>
        </div>
      </motion.section>
    </main>
  );
}