# Quality strategy and release operating model

**System under test:** Task Board, a deliberately small client-side application. **Audience:** engineering leads, QA engineers, release owners, and hiring reviewers.

## Business risk and coverage

| Priority | User or engineering risk | Evidence | Gate |
| --- | --- | --- | --- |
| P0 | Task creation fails | Chromium + mobile browser smoke | Block |
| P0 | Saved tasks disappear on reload | Edit/complete/persistence E2E | Block |
| P0 | Untrusted task text becomes executable HTML | HTML injection E2E + textContent implementation | Block |
| P1 | Users cannot recover from invalid input | Whitespace validation E2E | Block |
| P1 | Keyboard edit/cancel is broken | Keyboard E2E | Block |
| P1 | Service cannot be reached | Health endpoint contract test | Block |
| P2 | Visual polish or copy issue | Manual review | Track, not automatically block |

## Test pyramid

1. **Unit/contract:** Node built-in test runner checks route allowlist, HTTP headers, health contract, and release-gate decisions.
2. **E2E:** Playwright exercises critical journeys in desktop Chromium and mobile Chromium emulation.
3. **Exploratory:** Keyboard-only navigation, zoom/text scaling, screen-reader walkthrough, storage-disabled browser, and browser-specific behavior. These are *manual checks*, not falsely claimed as automated.

## Release decision

- **GO:** All critical automated tests pass; zero unexpected failures, flaky results, or skipped tests in the critical suite.
- **NO-GO:** Missing evidence, a critical test failure, a flaky result, or skipped critical tests.
- **Exception:** Document risk, owner, mitigation, expiry, and approver in an explicit decision record; no automated override is provided.
- **Evidence:** CI artifacts contain JSON results, an HTML report, and failure screenshots/traces when available.
- **Ownership:** A release owner makes the final decision; the script supplies evidence, not authority.

## Quality metrics (definitions, not fabricated results)

| Metric | Definition | Data source |
| --- | --- | --- |
| Critical path pass rate | Passed / executed critical checks | Playwright JSON |
| Flake rate | Tests passing only after retry / executed checks | Playwright JSON |
| Escape rate | Production defects found after release / total defects in period | Issue tracker; not measured in this demo |
| Lead time to feedback | CI completion time - commit time | GitHub Actions; not measured in this demo |
| Risk coverage | High-risk scenarios with test evidence / identified high-risk scenarios | Risk register |

Do not report unmeasured improvements as results. Record baselines and dates before claiming percentage changes.

## Defect triage and escalation

- P0: Customer-critical journey blocked or security exposure. Stop release; incident owner and engineering lead coordinate mitigation.
- P1: Major functional impairment with workaround. Risk review before release.
- P2: Minor usability or cosmetic issue. Prioritize with Product.
- Every defect should have a reproducible scenario, expected/actual result, environment, evidence, severity, and accountable owner.

## Governance and continuous improvement

Weekly quality review: trend failures, quarantine decisions (with expiry), escaped defects, and test execution time. Monthly review: risk register, automation value, dependencies, and improvement experiments. Retrospectives produce accountable actions, not just discussion notes.

**Portfolio boundary:** This operating model is an original example for a sample app, not an assertion that it was implemented at UPS or another employer.
