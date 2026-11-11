# Quality Engineering Leadership Lab

**A runnable engineering portfolio demonstrating how a Senior SDET / Quality Engineering Lead approaches product risk, automation architecture, release governance, and engineering trade-offs.**

This is an **original sample system**, not a claim about proprietary employer software or a production deployment.

## What this project proves

| Engineering dimension | Evidence in repository |
| --- | --- |
| User-centered delivery | Accessible task board with add, edit, complete, delete, validation, and browser persistence |
| Automation design | Playwright TypeScript tests across desktop and mobile Chromium projects |
| Test strategy | [Risk-based quality strategy](docs/QUALITY_STRATEGY.md) and test pyramid |
| API and security boundaries | Node HTTP health-contract test, allowlisted routes, CSP, injection test |
| CI/CD | [GitHub Actions quality gates](.github/workflows/quality-gates.yml), test artifacts and retries |
| Release ownership | Evidence-based GO/NO-GO script and [release review template](docs/RELEASE_REVIEW_TEMPLATE.md) |
| Architecture leadership | [Documented trade-offs and decisions](docs/ARCHITECTURE_DECISIONS.md) |

## Architecture

```text
Browser (desktop / mobile Chromium)
          |
          v
Task Board UI (HTML/CSS/JS) ----> localStorage
          |
          v
Node HTTP static server ----> GET /health

Unit/contract checks --------\
                              > GitHub Actions -> JSON/HTML evidence -> GO / NO-GO
Playwright UI/E2E checks ----/
```

## Run locally

Requirements: **Node.js 22+**.

```bash
npm install
npx playwright install chromium
npm start
```

Open http://127.0.0.1:4173.

In another terminal:

```bash
npm test                  # Node unit/contract checks
npm run test:e2e:smoke    # Critical smoke scenario on both projects
npm run test:e2e          # Desktop and mobile-emulation browser checks
npm run quality:gate      # Evidence-based release decision
```

`npm run quality:gate` requires the JSON results from a preceding Playwright run. It intentionally fails when results are absent, flaky, skipped, or failed. **Do not interpret a GO as approval for a real production release.**

## Engineering judgment, not just test counts

- **Risk first:** Focus P0/P1 coverage on persistence, injection safety, validation, and user journeys.
- **Test evidence:** Keep reports and traces from failed CI runs.
- **Failure triage:** Treat flaky outcomes as risks to investigate rather than hiding them with retries.
- **Release decision:** Separate automated evidence from accountable human sign-off.
- **Accessibility:** Use semantic controls and keyboard interactions; manual screen-reader checks remain a gap.
- **Data protection:** No user accounts, employer code, real customer data, or secrets.

## Known limitations and roadmap

- This is a small **client-only task board**, not a microservices or production insurance/logistics platform.
- The only HTTP API contract is `GET /health`; business API automation will be demonstrated in a separate sample service.
- Mobile testing uses **Chromium emulation**, not physical iOS/Android devices.
- No verified test results or performance metrics are claimed until the CI workflow runs successfully.
- Next iterations: contract-testing service, accessibility scan, cross-browser expansion, and trend reporting.

## Reviewer walkthrough (10 minutes)

1. Review [risk coverage](docs/QUALITY_STRATEGY.md).
2. Inspect [browser tests](tests/e2e/task-board.spec.ts) and [unit checks](tests/unit).
3. Inspect [CI workflow](.github/workflows/quality-gates.yml) and [release gate](tools/release-gate.cjs).
4. Read [architecture decisions](docs/ARCHITECTURE_DECISIONS.md).
5. Open a PR and inspect the automated evidence; decide whether to release using the [template](docs/RELEASE_REVIEW_TEMPLATE.md).

**Maintainer:** [AshokSDET]
