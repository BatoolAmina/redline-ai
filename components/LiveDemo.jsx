"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { 
  Check, 
  Download, 
  FileDiff, 
  FileText, 
  Loader2, 
  UploadCloud, 
  Sparkles, 
  Send, 
  Trash2, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle
} from "lucide-react";
import PdfViewer from "@/components/PdfViewer";

const processingStages = [
  "Reading PDF pages",
  "Extracting key clauses",
  "Indexing document sections",
  "Writing a plain-language summary",
];

const importanceStyle = {
  high: "bg-[#7D5A44] text-[#F5F1EA]",
  medium: "bg-[#B2967D] text-[#4A342A]",
  low: "bg-[#D7C9B8] text-[#4A342A]",
};

export default function LiveDemo() {
  const reduceMotion = useReducedMotion();
  const { data: session } = useSession();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const fileInputRef = useRef(null);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setInterval(() => {
      setProcessingStage((stage) => Math.min(stage + 1, processingStages.length - 1));
    }, 2600);
    return () => window.clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, asking]);

  async function handleFile(file) {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Choose a PDF file to analyze.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("This PDF is larger than 15 MB. Try a smaller file.");
      return;
    }

    if (result?.docId) {
      fetch(`/api/documents/${result.docId}`, { method: "DELETE" }).catch(() => {});
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setFileName(file.name);
    setProcessingStage(0);
    setError(null);
    setLoading(true);
    setResult(null);
    setMessages([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function releaseDocument() {
    if (result?.docId) {
      await fetch(`/api/documents/${result.docId}`, { method: "DELETE" }).catch(() => {});
    }
    setResult(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setMessages([]);
    setError(null);
  }

  function downloadReport() {
    const lines = [
      "# Redline document analysis",
      "",
      `Document: ${result.filename}`,
      `Type: ${result.documentType}`,
      `Pages: ${result.pages}`,
      "",
      "## Plain-language summary",
      ...(result.summaryPoints || []).flatMap((point) => [
        `- ${point.text}`,
        `  - Source, page ${point.pageNumber}, ${point.sectionHeading}: "${point.sourceText}"`,
      ]),
      "",
      "## Key clauses",
      ...(result.keyClauses || []).flatMap((clause) => [
        `### ${clause.clause} (${clause.importance})`,
        clause.plainExplanation,
        `Source, page ${clause.pageNumber}, ${clause.sectionHeading}: "${clause.sourceText}"`,
        "",
      ]),
      "Analysis is informational and is not legal, medical, insurance, or financial advice.",
    ];
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${result.filename.replace(/\.pdf$/i, "")}-redline.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function sendQuestion(e) {
    e.preventDefault();
    if (!question.trim() || !result) return;

    const q = question.trim();
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setQuestion("");
    setAsking(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docId: result.docId, question: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get an answer");
      setMessages((prev) => [...prev, { role: "assistant", text: data.answer, sources: data.sources || [] }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", text: `Error: ${err.message}` }]);
    } finally {
      setAsking(false);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
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
    <section id="try-it" className="relative isolate mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20 lg:py-24 text-[#4A342A]">
      {/* Background Ambient Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/3 -z-10 flex justify-center overflow-hidden pointer-events-none"
      >
        <div className="h-[250px] w-[350px] sm:h-[350px] sm:w-[600px] rounded-full bg-[#B2967D]/15 blur-[90px] sm:blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-xl text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-[#B2967D]/40 bg-[#B2967D]/15 px-3 py-1 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[#7D5A44] shadow-xs backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#7D5A44]" />
          <span>Interactive Analysis</span>
        </div>
        <h2 className="font-display text-2xl tracking-tight text-[#4A342A] sm:text-4xl lg:text-5xl">
          Try it on your own document
        </h2>
        <p className="font-sans text-sm sm:text-base leading-relaxed text-[#4A342A]/75">
          Upload a PDF and ask up to four questions without an account. Sign in when you want a persistent workspace.
        </p>
      </motion.div>

      <div className="mx-auto mt-8 sm:mt-10 max-w-2xl">
        <AnimatePresence mode="wait">
          {!result && (
            <motion.div
              key="upload-zone"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <div
                onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setIsDragging(false);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                  handleFile(event.dataTransfer.files[0]);
                }}
                className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-dashed px-4 py-8 sm:px-6 sm:py-16 text-center backdrop-blur-md transition-all duration-300 ${
                  isDragging 
                    ? "border-[#7D5A44] bg-[#D7C9B8]/40 shadow-lg scale-[1.01]" 
                    : "border-[#D7C9B8] bg-[#F5F1EA]/80 hover:border-[#7D5A44] hover:bg-[#F5F1EA]"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(event) => handleFile(event.target.files[0])}
                  className="sr-only"
                  aria-label="Choose a PDF document"
                  disabled={loading}
                />
                
                {loading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mx-auto max-w-md text-left" 
                    role="status" 
                    aria-live="polite"
                  >
                    <div className="flex items-center gap-3 border-b border-[#D7C9B8]/80 pb-3 sm:pb-4">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-[#7D5A44]/10 border border-[#7D5A44]/20">
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-[#7D5A44]" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-sans text-xs sm:text-sm font-semibold text-[#4A342A] truncate">
                          {processingStages[processingStage]}
                        </p>
                        <p className="mt-0.5 truncate font-mono text-[10px] sm:text-[11px] text-[#4A342A]/60">
                          {fileName}
                        </p>
                      </div>
                    </div>

                    <ol className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3">
                      {processingStages.map((stage, index) => (
                        <motion.li 
                          key={stage}
                          animate={{ opacity: index <= processingStage ? 1 : 0.4 }}
                          className={`flex items-center gap-2.5 sm:gap-3 font-sans text-xs sm:text-sm transition-all duration-300 ${
                            index === processingStage ? "font-medium text-[#4A342A]" : "text-[#4A342A]/60"
                          }`}
                        >
                          <span className={`flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                            index < processingStage 
                              ? "border-[#7D5A44] bg-[#7D5A44] text-[#F5F1EA] shadow-xs" 
                              : index === processingStage 
                              ? "border-[#7D5A44] text-[#7D5A44] ring-2 ring-[#7D5A44]/20" 
                              : "border-[#D7C9B8]"
                          }`}>
                            {index < processingStage ? (
                              <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                            ) : (
                              <span className="font-mono text-[9px] sm:text-[10px]">0{index + 1}</span>
                            )}
                          </span>
                          <span className="truncate">{stage}</span>
                        </motion.li>
                      ))}
                    </ol>
                  </motion.div>
                ) : (
                  <div>
                    <motion.div 
                      whileHover={reduceMotion ? {} : { scale: 1.08, rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.3 }}
                      className="mx-auto flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-[#7D5A44]/10 border border-[#7D5A44]/20 text-[#7D5A44] shadow-xs"
                    >
                      <UploadCloud className="h-6 w-6 sm:h-8 sm:w-8" aria-hidden="true" />
                    </motion.div>

                    <motion.button
                      whileHover={reduceMotion ? {} : { scale: 1.03 }}
                      whileTap={reduceMotion ? {} : { scale: 0.97 }}
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 sm:mt-6 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#7D5A44] px-6 py-3 sm:px-8 sm:py-3.5 font-sans text-xs sm:text-sm font-semibold text-[#F5F1EA] shadow-md transition-all hover:bg-[#684936] hover:shadow-lg"
                    >
                      <span>Choose a PDF</span>
                    </motion.button>

                    <p className="mt-2.5 sm:mt-3 font-sans text-xs sm:text-sm text-[#4A342A]/75">or drop it here</p>
                    <p className="mt-1.5 sm:mt-2 font-mono text-[10px] sm:text-xs text-[#4A342A]/50 max-w-xs mx-auto leading-relaxed">
                      Lease, insurance policy, consent form, contract &bull; up to 15 MB
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              role="alert"
              className="mt-4 flex items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-[#C1442E]/30 bg-[#C1442E]/10 p-3.5 sm:p-4 font-sans text-xs sm:text-sm text-[#8F2E20]"
            >
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-5 sm:space-y-6"
            >
              <motion.div variants={itemVariants}>
                <PdfViewer url={previewUrl} pages={result.sourcePages || []} />
              </motion.div>
              {/* Card 1: Document Metadata & Summary */}
              <motion.div variants={itemVariants} className="rounded-2xl sm:rounded-3xl border border-[#D7C9B8] bg-[#F5F1EA]/90 p-4 sm:p-6 lg:p-8 shadow-md backdrop-blur-md">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#D7C9B8]/70 pb-3 sm:pb-4">
                  <span className="flex min-w-0 items-center gap-2 font-mono text-xs font-semibold text-[#4A342A]">
                    <div className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-lg bg-[#7D5A44]/10 text-[#7D5A44]">
                      <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                    </div>
                    <span className="truncate">{result.filename}</span>
                    {result.pages && <span className="shrink-0 text-[#4A342A]/50">&bull; {result.pages} pages</span>}
                  </span>
                  <span className="self-start sm:self-auto rounded-full border border-[#B2967D]/40 bg-[#B2967D]/20 px-2.5 py-0.5 sm:px-3 sm:py-1 font-mono text-[9px] sm:text-[10px] uppercase font-semibold text-[#7D5A44] shadow-xs">
                    {result.documentType}
                  </span>
                </div>

                <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                  <p className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-[#4A342A]/60">Plain-language Summary</p>
                  {result.summaryPoints?.length ? (
                    result.summaryPoints.map((point, index) => (
                      <div key={`${point.pageNumber}-${index}`} className="group rounded-xl sm:rounded-2xl border border-[#D7C9B8]/50 bg-[#F5F1EA] p-3.5 sm:p-4 transition-all hover:border-[#B2967D]/80">
                        <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#4A342A] font-medium">{point.text}</p>
                        <p className="mt-1.5 sm:mt-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-[#7D5A44]">
                          Page {point.pageNumber} &bull; {point.sectionHeading}
                        </p>
                        <blockquote className="mt-2 rounded-lg sm:rounded-xl border-l-2 border-[#B2967D] bg-[#D7C9B8]/20 p-2.5 sm:p-3 font-mono text-[11px] sm:text-xs leading-relaxed text-[#4A342A]/80 break-words">
                          &ldquo;{point.sourceText}&rdquo;
                        </blockquote>
                      </div>
                    ))
                  ) : (
                    <p className="font-sans text-xs sm:text-sm text-[#4A342A]/70">No summary points could be verified against an exact source quote.</p>
                  )}
                </div>

                <p className="mt-5 sm:mt-6 border-t border-[#D7C9B8]/60 pt-3 sm:pt-4 font-sans text-[11px] sm:text-xs leading-relaxed text-[#4A342A]/60">
                  Redline explains document text; it is not legal, medical, insurance, or financial advice. Consult a qualified professional for advice about your situation.
                </p>
              </motion.div>

              {/* Card 2: Key Clauses */}
              <motion.div variants={itemVariants} className="rounded-2xl sm:rounded-3xl border border-[#D7C9B8] bg-[#F5F1EA]/90 p-4 sm:p-6 lg:p-8 shadow-md backdrop-blur-md">
                <p className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-[#4A342A]/60 border-b border-[#D7C9B8]/70 pb-3 sm:pb-4">
                  Key Clauses &amp; Obligations
                </p>
                <ul className="mt-4 sm:mt-6 space-y-3.5 sm:space-y-5">
                  {result.keyClauses?.map((c, i) => (
                    <li key={i} className="group rounded-xl sm:rounded-2xl border border-[#D7C9B8]/50 bg-[#F5F1EA] p-3.5 sm:p-4 transition-all hover:border-[#7D5A44]/40">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
                        <span
                          className={`self-start shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[9px] sm:text-[10px] uppercase font-semibold shadow-xs ${
                            importanceStyle[c.importance] || "bg-[#D7C9B8] text-[#4A342A]"
                          }`}
                        >
                          {c.importance}
                        </span>
                        <div className="w-full min-w-0">
                          <p className="font-sans text-xs sm:text-sm font-semibold text-[#4A342A]">{c.clause}</p>
                          <p className="mt-1 font-sans text-xs sm:text-sm leading-relaxed text-[#4A342A]/80">{c.plainExplanation}</p>
                          {c.sourceText && (
                            <details className="mt-2.5 sm:mt-3 group/details">
                              <summary className="cursor-pointer font-mono text-[10px] sm:text-[11px] text-[#7D5A44] hover:underline">
                                Page {c.pageNumber} &bull; {c.sectionHeading} &bull; View Source Clause
                              </summary>
                              <blockquote className="mt-2 rounded-lg sm:rounded-xl border-l-2 border-[#B2967D] bg-[#D7C9B8]/20 p-2.5 sm:p-3 font-mono text-[11px] sm:text-xs leading-relaxed text-[#4A342A]/80 break-words">
                                &ldquo;{c.sourceText}&rdquo;
                              </blockquote>
                            </details>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Card 3: Interactive Q&A Chat */}
              <motion.div variants={itemVariants} className="rounded-2xl sm:rounded-3xl border border-[#D7C9B8] bg-[#F5F1EA]/90 p-4 sm:p-6 lg:p-8 shadow-md backdrop-blur-md">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#D7C9B8]/70 pb-3 sm:pb-4">
                  <p className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-[#4A342A]/60">
                    Ask questions about this document
                  </p>
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#7D5A44]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Grounded RAG Mode
                  </span>
                </div>

                <div className="mt-4 sm:mt-6 max-h-72 sm:max-h-80 space-y-3 overflow-y-auto pr-1">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center text-[#4A342A]/50">
                      <HelpCircle className="h-6 w-6 sm:h-8 sm:w-8 text-[#B2967D] mb-2" />
                      <p className="font-sans text-xs">Ask specific questions like &ldquo;What is the cancellation penalty?&rdquo;</p>
                    </div>
                  )}

                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`w-fit max-w-[92%] sm:max-w-[88%] rounded-xl sm:rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 font-sans text-xs sm:text-sm shadow-xs ${
                        m.role === "user"
                          ? "ml-auto bg-[#4A342A] text-[#F5F1EA]"
                          : "bg-[#F5F1EA] border border-[#D7C9B8] text-[#4A342A]"
                      }`}
                    >
                      <p className="leading-relaxed">{m.text}</p>
                      {m.sources?.length > 0 && (
                        <details className="mt-2.5 sm:mt-3 border-t border-current/15 pt-2">
                          <summary className="cursor-pointer font-mono text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-[#7D5A44]">
                            Verified Source Clauses ({m.sources.length})
                          </summary>
                          <div className="mt-2 space-y-2">
                            {m.sources.map((source) => (
                              <blockquote key={source.chunkIndex} className="rounded-lg border-l-2 border-[#B2967D] bg-[#D7C9B8]/20 p-2 font-mono text-[10px] sm:text-[11px] leading-relaxed break-words">
                                &ldquo;{source.text}&rdquo;
                                <span className="mt-1 block text-[9px] opacity-75">Page {source.pageNumber} &bull; {source.sectionHeading}</span>
                              </blockquote>
                            ))}
                          </div>
                        </details>
                      )}
                    </motion.div>
                  ))}

                  {asking && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 rounded-xl sm:rounded-2xl border border-[#D7C9B8] bg-[#F5F1EA] px-3.5 py-2.5 sm:px-4 sm:py-3 font-sans text-xs text-[#7D5A44]"
                    >
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Evaluating source citations...</span>
                    </motion.div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                <form onSubmit={sendQuestion} className="mt-4 sm:mt-5 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g., What happens if I end the lease early?"
                    aria-label="Ask a question about this document"
                    className="flex-1 rounded-xl sm:rounded-2xl border border-[#D7C9B8] bg-[#F5F1EA] px-3.5 py-2.5 sm:px-4 sm:py-3 font-sans text-xs sm:text-sm text-[#4A342A] placeholder:text-[#4A342A]/40 focus:border-[#7D5A44] focus:outline-none focus:ring-1 focus:ring-[#7D5A44]"
                  />
                  <motion.button
                    whileHover={reduceMotion ? {} : { scale: 1.02 }}
                    whileTap={reduceMotion ? {} : { scale: 0.98 }}
                    type="submit"
                    disabled={asking || !question.trim()}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl sm:rounded-2xl bg-[#7D5A44] px-5 py-2.5 sm:px-6 sm:py-3 font-sans text-xs sm:text-sm font-semibold text-[#F5F1EA] shadow-md transition-all hover:bg-[#684936] disabled:opacity-50"
                  >
                    <span>Ask</span>
                    <Send className="h-3.5 w-3.5" />
                  </motion.button>
                </form>
              </motion.div>

              {/* Bottom Action Bar */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 pt-2">
                <motion.button 
                  whileHover={reduceMotion ? {} : { scale: 1.02 }}
                  whileTap={reduceMotion ? {} : { scale: 0.98 }}
                  type="button" 
                  onClick={downloadReport} 
                  className="inline-flex min-h-10 sm:min-h-11 items-center justify-center gap-2 rounded-xl sm:rounded-2xl border border-[#D7C9B8] bg-[#F5F1EA] px-4 sm:px-5 font-sans text-xs font-medium text-[#4A342A] shadow-sm transition-all hover:bg-white"
                >
                  <Download className="h-4 w-4 text-[#7D5A44]" aria-hidden="true" />
                  <span>Export cited report</span>
                </motion.button>

                <Link 
                  href="/compare" 
                  className="inline-flex min-h-10 sm:min-h-11 items-center justify-center gap-2 rounded-xl sm:rounded-2xl border border-[#D7C9B8] bg-[#F5F1EA] px-4 sm:px-5 font-sans text-xs font-medium text-[#4A342A] shadow-sm transition-all hover:bg-white"
                >
                  <FileDiff className="h-4 w-4 text-[#7D5A44]" aria-hidden="true" />
                  <span>Compare versions</span>
                </Link>

                {session?.user?.role !== "viewer" && <button 
                  type="button" 
                  onClick={releaseDocument} 
                  className="inline-flex min-h-10 sm:min-h-11 items-center justify-center gap-1.5 font-sans text-xs text-[#4A342A]/70 transition-colors hover:text-[#C1442E] px-3"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete session</span>
                </button>}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}