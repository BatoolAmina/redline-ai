"use client";

import { FileText } from "lucide-react";

export default function PdfViewer({ url, pages = [] }) {
  if (!url) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-[#D7C9B8] bg-white shadow-md" aria-label="Document viewer">
      <div className="flex items-center gap-2 border-b border-[#D7C9B8] bg-[#F5F1EA] px-4 py-3 font-mono text-xs text-[#4A342A]/75">
        <FileText className="h-4 w-4 text-[#7D5A44]" aria-hidden="true" />
        <span>Selectable source document</span>
        <span className="ml-auto">{pages.length} pages</span>
      </div>
      <iframe
        src={`${url}#toolbar=1&navpanes=0`}
        title="Uploaded PDF with selectable text"
        className="h-[560px] w-full bg-[#EAE4DB]"
      />
    </section>
  );
}
