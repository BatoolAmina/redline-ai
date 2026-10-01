# Deployment controls

The following environment variables are required for a production deployment:

- `DATABASE_URL`: Neon/Postgres connection string.
- `NEXTAUTH_URL` and `NEXTAUTH_SECRET`: session configuration.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: OAuth identity provider.
- `GEMINI_API_KEY`: server-side model access.
- `DOCUMENT_ENCRYPTION_KEY`: high-entropy key retained in a secret manager; rotate through a planned re-encryption migration.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`: distributed rate limiting.
- `CRON_SECRET`: bearer token for the expired-document cleanup endpoint.
- `OCR_ENDPOINT`: optional explicitly configured OCR service for scanned PDFs.

Run `db/001_initial.sql` through a reviewed migration process. Do not accept production traffic until OAuth redirect URIs, database TLS, secret rotation, backup deletion, rate limits, logging redaction, and regional processing requirements have been reviewed for the deployment.

Schedule an authenticated `POST /api/maintenance/purge-expired` at least hourly
with `Authorization: Bearer <CRON_SECRET>`. Verify it returns a `deletedCount`
and that expired rows no longer contain an encrypted payload. Without this
schedule, expired documents are inaccessible but their encrypted payloads may
remain stored in Postgres.
