# Threat model

## Assets

- Uploaded contracts, extracted text, embeddings, citations, and account/workspace metadata.
- OAuth identities and workspace membership roles.
- Encryption key and database credentials.

## Trust boundaries

- Browser to Next.js routes.
- Next.js server to Gemini, Neon Postgres, and Upstash Redis.
- Workspace members to documents in the same workspace.

## Threats and controls

| Threat | Control | Residual risk |
| --- | --- | --- |
| Cross-tenant document access | Every document query joins workspace membership; document keys contain workspace ownership in metadata | Requires integration tests against a live database |
| Database or cache disclosure | Document payloads are AES-256-GCM encrypted before persistence | Metadata remains visible; key rotation is deployment-owned |
| Prompt injection in PDFs | System prompts treat document text as untrusted; citations are exact-quote validated | Model behavior still needs adversarial evaluation |
| Unauthorized deletion | Delete requires an authenticated owner/editor membership | OAuth account compromise remains possible |
| API abuse | Upstash sliding-window limits and upload bounds | Distributed abuse detection is not implemented |
| Key leakage | Secrets are server-only environment variables and never returned to clients | Deployment logs and operator access need review |

## Required pre-production tests

- Verify viewer, upload, chat, and delete requests across two workspaces.
- Verify revoked membership loses access immediately.
- Verify encryption key rotation and backup restore procedure.
- Run dependency, secret, and container scans.
