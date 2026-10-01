# Redline AI

Redline helps people make sense of dense documents. Upload a contract, insurance
policy, consent form, or other PDF to get a plain-language summary, important
clauses, and answers grounded in the document itself.

It is designed to help someone read a document more carefully, not to replace a
lawyer, doctor, insurer, or financial adviser.

## What it does

- Summarizes the parts of a document that affect money, rights, obligations, or risk.
- Keeps each explanation tied to a quoted passage, page, and section when available.
- Lets you ask questions about the uploaded document and refuses questions it cannot ground in the text.
- Compares two PDF versions and describes the practical effect of changes.
- Shows the original PDF alongside the analysis so the source remains easy to inspect.
- Keeps documents inside authenticated workspaces and encrypts stored document data.

---

## Built with

- **App:** Next.js App Router, React, and plain JavaScript
- **Interface:** Tailwind CSS, Framer Motion, and Lucide icons
- **Models:** Gemini embeddings and Gemini chat through the OpenAI-compatible API
- **Documents:** `pdf-parse`, optional configured OCR, and page-level text positions
- **Storage:** Neon/Postgres for workspace records and encrypted document payloads
- **Auth and limits:** NextAuth with Google OAuth and Upstash Redis rate limiting
- **Tests:** Vitest

---

## Run it locally

```bash
npm install
Copy-Item .env.example .env.local
# Fill in the values in .env.local; see "Required services" below.
npm run dev
```

Open `http://localhost:3000`.

### Required services

The landing page can render without these services, but document analysis needs:

1. A Gemini API key in `GEMINI_API_KEY`.
2. A Postgres database in `DATABASE_URL`. Run [`db/001_initial.sql`](db/001_initial.sql) once before using uploads.
3. A long random `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and Google OAuth credentials.
4. `DOCUMENT_ENCRYPTION_KEY`, stored in a secret manager in production.

Upstash Redis is required for production rate limiting. Configure `CRON_SECRET`
and schedule an authenticated POST to `/api/maintenance/purge-expired` at least
hourly so expired encrypted document payloads are physically removed. Set
`OCR_ENDPOINT` only when using an approved OCR service for scanned documents.
The service should accept a PDF and return the page format described in
`.env.example`.

---

## Where to look

```
├── app/
│   ├── api/
│   │   ├── upload/route.js     # Parses, indexes, and summarizes PDFs
│   │   ├── chat/route.js       # Answers questions from indexed document sections
│   │   ├── compare/route.js    # Compares two PDF versions
│   │   ├── auth/[...nextauth]/  # Google sign-in
│   │   └── documents/[docId]/  # Authenticated deletion
│   ├── globals.css             # Base styles & typography variables
│   ├── layout.js               # Metadata, JSON-LD, fonts, root provider wrapper
│   └── page.js                 # Landing page & embedded app container
├── components/
│   ├── Hero.jsx                # Landing page hero with parallax & background animations
│   ├── DocumentMockup.jsx      # Interactive 3D tilt document illustration
│   ├── FeatureShowcase.jsx     # Visual breakdown of app capabilities
│   ├── FAQ.jsx                 # Interactive animated accordion
│   └── Footer.jsx              # Footer with credit attribution & quick links
└── lib/
    ├── pdfParser.js            # Text extraction, pages, and text positions
    ├── embeddings.js           # Gemini embeddings
    ├── vectorStore.js          # Workspace-scoped encrypted retrieval
    ├── llm.js                  # Summary, comparison, and question prompts
    ├── ocr.js                  # Configured OCR provider adapter
    └── rateLimit.js            # Upstash Redis and local development limiter
```

## Data and privacy

- Visitors can upload a document and ask up to four questions without an account. The document is placed in an isolated guest workspace; signing in moves the user into their persistent workspace.
- PDFs are limited to 15 MB. Extracted text, chunks, and embeddings are encrypted with AES-256-GCM before they are stored in Postgres.
- Document access expires after two hours. Users can delete them sooner; deletion clears the encrypted payload. A scheduled cleanup job must clear payloads after expiry.
- Comparison files are processed in memory for that request and are not retained.
- Secrets stay on the server and are never returned to the browser.
- Read [`docs/THREAT_MODEL.md`](docs/THREAT_MODEL.md), [`docs/PRIVACY_REVIEW.md`](docs/PRIVACY_REVIEW.md), and [`docs/DEPLOYMENT_CONTROLS.md`](docs/DEPLOYMENT_CONTROLS.md) before handling sensitive documents.

## Check your changes

```bash
npm test
npm run lint
npm run build
```

Automated tests cover deterministic text processing only. They do not establish legal accuracy, OCR quality, model faithfulness, or enterprise security.

The retrieval benchmark is in [`benchmarks/retrieval.json`](benchmarks/retrieval.json). It intentionally starts with de-identified placeholders and must be labeled by human reviewers before its threshold can be used as evidence.

## Before production

This is an application foundation, not a compliance certification. Before using
real contracts or medical records, complete the deployment privacy review, check
the model and OCR subprocessors, test key rotation and backup deletion, configure
OAuth redirect URLs, and have qualified reviewers label the benchmark set.