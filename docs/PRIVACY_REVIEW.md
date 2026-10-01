# Privacy review checklist

Status: engineering draft; obtain legal and security approval before processing sensitive contracts.

- [ ] Document categories and prohibited data are defined.
- [ ] Purpose limitation and retention periods are documented for each deployment.
- [ ] User deletion removes database metadata and encrypted payloads.
- [ ] The scheduled expiry cleanup is configured and verified to clear encrypted payloads.
- [ ] OAuth provider scopes are limited to identity and email.
- [ ] Gemini, Neon, OCR, and hosting subprocessors are reviewed and disclosed.
- [ ] Regional hosting and cross-border transfer requirements are approved.
- [ ] Access logs exclude document text, embeddings, and API keys.
- [ ] Backups, encryption-key storage, rotation, and destruction are tested.
- [ ] Data subject access and deletion workflows are tested end to end.
- [ ] Incident response, breach notification, and support escalation owners are assigned.
- [ ] Human benchmark fixtures are de-identified and licensed for use.
