# Redline — AI Document Simplifier

A full-stack Next.js app (plain JavaScript, App Router) that turns dense legal,
insurance, and medical documents into plain language — with risk-flagged clauses
and a retrieval-grounded Q&A chat. Built for Hack-A-Throne 2026 (AI & Intelligent
Systems domain).

**Design:** the visual language is built around the product's actual function —
a highlighter marking up a document — rather than a generic template. See
"Design notes" below for the full rationale.

---

## Tech Stack

- **Framework:** Next.js 16.3.6 (App Router), React 19, plain JavaScript
- **Styling:** Tailwind CSS + Framer Motion for the one signature animated moment
- **Typography:** local editorial serif, UI sans-serif, and document monospace stacks (no build-time font downloads)
- **AI:** Gemini `gemini-embedding-001` (embeddings) + `gemini-3.6-flash` (summarization & chat) via the OpenAI-compatible API
- **PDF parsing:** `pdf-parse`
- **Vector search:** page-aware, clause-oriented in-memory cosine similarity with parent-section context and a configurable low-relevance refusal threshold
- **Comparison:** word-level PDF text diff with page attribution, bounded AI impact descriptions, and Markdown report export
- **Abuse controls:** Upstash Redis sliding-window rate limits in production; process-local fallback for development only
- **Tests:** Vitest coverage for chunk metadata, page attribution, and malformed comparison assessments
- **SEO:** full metadata, Open Graph + Twitter cards, JSON-LD structured data, sitemap.xml, robots.txt

---

## Setup

```bash
npm install
Copy-Item .env.example .env.local
# set GEMINI_API_KEY and the Upstash Redis credentials for production
npm run dev
```

Open `http://localhost:3000`.

---

## Project Structure

```
app/
  layout.js         → fonts, SEO metadata, JSON-LD
  page.js            → assembles all sections
  sitemap.js          robots.js   → SEO
  api/upload/route.js → validate PDF → extract → chunk → embed → summarize
  api/chat/route.js   → embed question → retrieve → answer (RAG)
  api/compare/route.js → extract two PDFs → diff → assess changes
  api/documents/[docId]/route.js → explicitly delete an ephemeral analysis
components/
  Nav, Hero, DocumentMockup   → landing page + signature animation
  HowItWorks, FeatureShowcase, TrustSection
  LiveDemo                    → the actual working app
lib/
  pdfParser.js, embeddings.js, vectorStore.js, llm.js
  documentDiff.js, rateLimit.js
```

## Runtime Notes

- The public analyzer is available on the landing page; no account is required.
- Upload selectable-text PDFs up to 15 MB. Scanned PDFs need OCR, which is not included.
- Extracted text, chunks, and embeddings stay in process memory for up to two hours and are not written to disk. Users can explicitly delete a session. A server restart clears active sessions; deployments with multiple instances need a shared session/vector store for cross-instance chat.
- The comparison endpoint processes both PDFs in memory for that request and does not retain them. The Markdown report is generated in the browser.
- Production API requests fail closed unless both `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are configured. Local development uses a process-local limiter.
- `RAG_MIN_SIMILARITY` configures the cosine-similarity threshold for refusing weakly grounded chat questions; evaluate and calibrate this against your own domain dataset before deployment.
- Set `GEMINI_API_KEY` on the server. It is never sent to the browser.
- The analysis explains document language and is not a substitute for legal, medical, insurance, or financial advice.

## Validation

```bash
npm test
npm run lint
npm run build
```

Automated tests cover deterministic text processing only. They do not establish legal accuracy, OCR quality, model faithfulness, or enterprise security.

## Production Gaps

This project is not yet enterprise-ready. It has no configured identity provider, RBAC, persistent workspace/database, shared vector store, OCR, visual PDF viewer, or audited human-labeled legal benchmark. The current ephemeral store is single-process only. Configure a database and auth provider before storing sensitive documents or enabling teams; do not treat rate limiting and exact-quote validation as a security/compliance certification.

---

## Design Notes (for judges / your own reference)

- **Concept:** the hero's animation literally shows a highlighter sweeping across
  a document and a plain-language note appearing — the metaphor *is* the product,
  not a generic dashboard mockup.
- **Palette:** paper white, deep ink navy, warm amber "marker" accent, muted
  rust (high risk) and moss (low risk) — chosen to feel like an actual annotated
  document, not a SaaS template.
- **Type:** Fraunces for headlines (personality), Manrope for UI, IBM Plex Mono
  used functionally for document-text mockups — not just as small decorative labels.
- **Motion:** hero image parallax, staggered copy, a pointer-reactive document
  mockup, and spring-based section reveals; all are reduced-motion aware.
- **Photography:** Unsplash document-review and legal-reference photos are stored
  locally in `public/` so the hero does not depend on a third-party runtime host.

---

## Round 1 Submission — Ready-to-use Content

**Problem Statement:** Legal, insurance, and medical documents are written in
dense technical language most people can't fully parse, leading to signed
contracts and consent forms whose implications aren't understood until it's
too late.

**Proposed Solution:** An AI web app where users upload a PDF and get a
generation (RAG), never generic legal advice.
plain-language, source-checked summary, risk-ranked key clauses, an interactive
document Q&A, and version comparison. The system links extracted quotes to
pages and refuses low-relevance questions; this reduces unsupported claims but
does not eliminate model error or replace professional advice.

**Tech Stack:** Next.js 16 (JavaScript), React 19, Tailwind CSS, Framer Motion,
Gemini embeddings + chat API, pdf-parse, in-memory vector search, Upstash Redis
rate limiting, and Vitest.

**Expected Impact:** Improves legal/medical/insurance literacy at scale and
generalizes to any dense document — rental agreements, loan contracts, terms
of service, consent forms.

---

## Remaining Work Before Enterprise Use

- Add an identity provider and database-backed workspaces with tested RBAC and deletion policies.
- Move vectors/session state from process memory to a shared durable store with encryption and tenant isolation.
- Add local or explicitly configured OCR, preserving page/section provenance.
- Build a visual PDF viewer with text selection; current citations identify page and section but not bounding boxes.
- Create a human-reviewed benchmark and calibrate retrieval/refusal thresholds against it.
- Complete threat modeling, privacy review, and deployment-specific compliance controls before handling sensitive contracts.
