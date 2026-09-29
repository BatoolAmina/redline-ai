"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  FileDiff,
  Loader2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  ShieldAlert,
} from "lucide-react";

const impactStyles = {
  high: "border-[#C1442E]/40 bg-[#C1442E]/10 text-[#8F2E20] ring-1 ring-[#C1442E]/20",
  medium: "border-[#B2967D]/60 bg-[#B2967D]/15 text-[#7D5A44] ring-1 ring-[#B2967D]/20",
  low: "border-[#2F6F4E]/40 bg-[#2F6F4E]/10 text-[#24563C] ring-1 ring-[#2F6F4E]/20",
  neutral: "border-[#D7C9B8] bg-[#D7C9B8]/30 text-[#4A342A]",
  unclear: "border-[#D7C9B8] bg-[#F5F1EA] text-[#4A342A]/70",
};

function createMarkdownReport(result) {
  const rows = result.changes.map((change, index) => [
    `## ${index + 1}. ${change.impact.toUpperCase()} impact`,
    "",
    change.summary,
    "",
    `**Original, page ${change.beforePage ?? "not located"}:** ${change.beforeText || "(no matching text)"}`,
    `**Revised, page ${change.afterPage ?? "not located"}:** ${change.afterText || "(no matching text)"}`,
  ].join("\n"));

  return [
    "# Redline document comparison",
    "",
    `- Original: ${result.before}`,
    `- Revised: ${result.after}`,
    `- Generated: ${new Date().toISOString()}`,
    "",
    "This report compares extracted document text. Impact descriptions are AI-generated, require human review, and are not legal advice.",
    "",
    rows.join("\n\n"),
  ].join("\n");
}

export default function CompareDocuments() {
  const reduceMotion = useReducedMotion();
  const [before, setBefore] = useState(null);
  const [after, setAfter] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function compare(event) {
    event.preventDefault();
    if (!before || !after) {
      setError("Choose both document versions to compare.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    const formData = new FormData();
    formData.append("before", before);
    formData.append("after", after);

    try {
      const response = await fetch("/api/compare", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Comparison failed.");
      setResult(data);
    } catch (compareError) {
      setError(compareError.message);
    } finally {
      setLoading(false);
    }
  }

  function downloadReport() {
    const blob = new Blob([createMarkdownReport(result)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "redline-comparison.md";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="relative isolate min-h-[85vh] bg-[#F5F1EA] text-[#4A342A] md:pt-20">
      {/* Editorial Ambient Background Glows */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden pointer-events-none"
      >
        <div className="h-[450px] w-[700px] rounded-full bg-[#B2967D]/15 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:pb-2">
        {/* Navigation Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-full border border-[#D7C9B8]/60 bg-[#F5F1EA]/80 px-4 py-2 font-sans text-xs font-medium text-[#4A342A]/80 backdrop-blur-md transition-all duration-200 hover:border-[#7D5A44] hover:text-[#4A342A] hover:shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#7D5A44]" aria-hidden="true" />
            <span>Single document analysis</span>
          </Link>
        </motion.div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.4 }}
          className="mt-6 max-w-3xl space-y-2.5"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B2967D]/40 bg-[#B2967D]/15 px-3.5 py-1 font-mono text-xs uppercase tracking-widest text-[#7D5A44] shadow-sm backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#7D5A44]" />
            <span>Version Comparison</span>
          </div>

          <h1 className="font-display text-3xl tracking-tight text-[#4A342A] sm:text-4xl lg:text-5xl">
            Find what changed. See why it matters.
          </h1>

          <p className="font-sans text-sm leading-relaxed text-[#4A342A]/75 sm:text-base">
            Compare extracted text from two PDF versions. Changes include exact wording and page references; impact descriptions are AI-generated and should be reviewed.
          </p>
        </motion.div>

        {/* File Upload Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.4, delay: 0.1 }}
          onSubmit={compare}
          className="mt-6 rounded-3xl border border-[#D7C9B8] bg-[#F5F1EA]/80 p-5 shadow-md backdrop-blur-md sm:p-6"
        >
          <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
            {/* Original File Zone */}
            <label className="group relative block cursor-pointer">
              <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-[#4A342A]/70">
                Original Version
              </span>
              <div
                className={`flex min-h-[110px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition-colors duration-200 ${
                  before
                    ? "border-[#7D5A44] bg-[#7D5A44]/5"
                    : "border-[#B2967D]/60 bg-[#F5F1EA] hover:border-[#7D5A44] hover:bg-[#D7C9B8]/20"
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7D5A44]/10 text-[#7D5A44] mb-2">
                  {before ? <FileText className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                </div>
                <span className="font-sans text-xs font-semibold text-[#4A342A] line-clamp-1">
                  {before?.name || "Upload Original PDF"}
                </span>
                <span className="mt-0.5 font-mono text-[10px] text-[#4A342A]/50">
                  {before ? `${(before.size / 1024 / 1024).toFixed(2)} MB` : "Click or drag file here"}
                </span>
                <input
                  className="sr-only"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(event) => setBefore(event.target.files?.[0] || null)}
                />
              </div>
            </label>

            {/* Diff Icon Divider */}
            <div className="hidden md:flex flex-col items-center justify-center pt-4 text-[#7D5A44]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D7C9B8] bg-[#F5F1EA] shadow-sm">
                <FileDiff className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>

            {/* Revised File Zone */}
            <label className="group relative block cursor-pointer">
              <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-[#4A342A]/70">
                Revised Version
              </span>
              <div
                className={`flex min-h-[110px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition-colors duration-200 ${
                  after
                    ? "border-[#7D5A44] bg-[#7D5A44]/5"
                    : "border-[#B2967D]/60 bg-[#F5F1EA] hover:border-[#7D5A44] hover:bg-[#D7C9B8]/20"
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7D5A44]/10 text-[#7D5A44] mb-2">
                  {after ? <FileText className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                </div>
                <span className="font-sans text-xs font-semibold text-[#4A342A] line-clamp-1">
                  {after?.name || "Upload Revised PDF"}
                </span>
                <span className="mt-0.5 font-mono text-[10px] text-[#4A342A]/50">
                  {after ? `${(after.size / 1024 / 1024).toFixed(2)} MB` : "Click or drag file here"}
                </span>
                <input
                  className="sr-only"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(event) => setAfter(event.target.files?.[0] || null)}
                />
              </div>
            </label>
          </div>

          {/* Submit Action */}
          <div className="mt-6 flex items-center justify-between border-t border-[#D7C9B8]/60 pt-4">
            <p className="font-mono text-xs text-[#4A342A]/60 hidden sm:block">
              Supports side-by-side clause extraction &amp; severity evaluation.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#7D5A44] px-6 font-sans text-sm font-semibold text-[#F5F1EA] shadow-md transition-colors duration-200 hover:bg-[#684936] disabled:opacity-60 sm:w-auto"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <FileDiff className="h-4 w-4" aria-hidden="true" />
              )}
              <span>{loading ? "Comparing documents..." : "Compare versions"}</span>
            </button>
          </div>
        </motion.form>

        {/* Error Alert Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="alert"
              className="mt-5 flex items-center gap-3 rounded-2xl border border-[#C1442E]/30 bg-[#C1442E]/10 p-3.5 font-sans text-sm text-[#8F2E20]"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section - Rendered inline without vertical motion shifts */}
        {result && (
          <div aria-live="polite" className="mt-8 border-t border-[#D7C9B8] pt-6">
            {/* Results Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl text-[#4A342A] sm:text-3xl">
                  {result.changes.length
                    ? `${result.totalChanges} text changes found`
                    : "No text changes found"}
                </h2>
                {result.assessedCount < result.totalChanges && (
                  <p className="mt-1 font-sans text-xs text-[#4A342A]/65">
                    Impact summaries generated for the first {result.assessedCount} changes.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={downloadReport}
                className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-[#D7C9B8] bg-[#F5F1EA] px-4 font-sans text-xs font-medium text-[#4A342A] shadow-sm transition-colors duration-200 hover:bg-white"
              >
                <Download className="h-4 w-4 text-[#7D5A44]" aria-hidden="true" />
                <span>Export Markdown</span>
              </button>
            </div>

            {/* Changes List */}
            <ol className="mt-6 space-y-5">
              {result.changes.map((change, index) => (
                <li
                  key={`${index}-${change.beforeText.slice(0, 20)}`}
                  className="group relative overflow-hidden rounded-3xl border border-[#D7C9B8] bg-[#F5F1EA]/90 p-5 shadow-sm backdrop-blur-md transition-colors duration-200 hover:border-[#7D5A44]/50 sm:p-6"
                >
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(14rem,0.85fr)]">
                    {/* Removed Clause */}
                    <div className="min-w-0 rounded-2xl border-l-4 border-[#C1442E] bg-[#C1442E]/5 p-3.5">
                      <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8F2E20]">
                        <span>Removed Text</span>
                        <span>Page {change.beforePage ?? "N/A"}</span>
                      </div>
                      <p className="font-mono text-xs leading-relaxed text-[#4A342A]/90 break-words">
                        {change.beforeText || "No matching text"}
                      </p>
                    </div>

                    {/* Added Clause */}
                    <div className="min-w-0 rounded-2xl border-l-4 border-[#B2967D] bg-[#B2967D]/15 p-3.5">
                      <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] font-semibold uppercase tracking-wider text-[#7D5A44]">
                        <span>Added Text</span>
                        <span>Page {change.afterPage ?? "N/A"}</span>
                      </div>
                      <p className="font-mono text-xs leading-relaxed text-[#4A342A]/90 break-words">
                        {change.afterText || "No matching text"}
                      </p>
                    </div>

                    {/* Impact & Analysis Summary */}
                    <div className="flex flex-col justify-between min-w-0 rounded-2xl border border-[#D7C9B8]/60 bg-[#D7C9B8]/20 p-3.5">
                      <div>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                            impactStyles[change.impact] || impactStyles.unclear
                          }`}
                        >
                          <ShieldAlert className="h-3 w-3" />
                          <span>{change.impact} Impact</span>
                        </span>
                        <p className="mt-2.5 font-sans text-xs leading-relaxed text-[#4A342A]/85 sm:text-sm font-medium">
                          {change.summary}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5 border-t border-[#D7C9B8]/50 pt-2 font-mono text-[10px] text-[#4A342A]/60">
                        <CheckCircle2 className="h-3 w-3 text-[#7D5A44]" />
                        <span>Audited Change #{index + 1}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            {/* Disclaimer */}
            <p className="mt-6 text-center font-mono text-[11px] text-[#4A342A]/60">
              Text extraction may miss layout, tables, or scanned content. This comparison is informational and is not legal advice.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}