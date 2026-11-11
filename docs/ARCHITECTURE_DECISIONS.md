# Architecture decisions

## ADR-001: Browser-based sample application
**Decision:** Keep the task board dependency-free and use localStorage for persistence.
**Why:** Reviewers can understand the system quickly; focus remains on test architecture and governance.
**Trade-off:** No authentication, API backend, shared database, or multi-user concurrency. The /health endpoint tests server availability only, not a production API.

## ADR-002: Test at two boundaries
**Decision:** Use Node tests for server and release-policy contracts and Playwright for end-to-end browser workflows.
**Why:** A failed unit test identifies server/policy behavior; browser tests catch integration and user-interaction failures.
**Trade-off:** Mobile Chromium emulation does not prove physical-device behavior or iOS/Safari coverage.

## ADR-003: Evidence-first release gate
**Decision:** Require actual Playwright JSON output; missing, skipped, flaky, and unexpected outcomes block the demo release.
**Why:** An attractive dashboard without trustworthy evidence can hide delivery risk.
**Trade-off:** 100% is appropriate for this tiny critical suite, not a universal enterprise threshold. Larger systems should use risk-tiered thresholds and explicit exceptions.

## ADR-004: Avoid secrets and unverified AI claims
**Decision:** Keep all data synthetic and never publish employer code, credentials, customer information, or internal metrics.
**Why:** A portfolio must demonstrate engineering judgment without exposing sensitive systems.
**AI:** Human verification is required for generated test assertions, diagnoses, and suggested fixes.
