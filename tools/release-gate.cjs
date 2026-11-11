/* Evaluate objective release thresholds from Playwright JSON reporter output. */
const fs = require("node:fs");

function evaluate(report) {
  let passed = 0, failed = 0, flaky = 0, skipped = 0;
  function walk(suites) {
    for (const suite of suites || []) {
      for (const spec of suite.specs || []) {
        for (const test of spec.tests || []) {
          if (test.status === "expected") passed++;
          else if (test.status === "flaky") flaky++;
          else if (test.status === "skipped") skipped++;
          else failed++;
        }
      }
      walk(suite.suites);
    }
  }
  walk(report.suites);
  const total = passed + failed + flaky + skipped;
  const eligible = passed + failed + flaky;
  const passRate = eligible ? passed / eligible : 0;
  const reasons = [];
  if (total === 0) reasons.push("No test results found");
  if (failed > 0) reasons.push("Unexpected test outcomes: " + failed);
  if (flaky > 0) reasons.push("Flaky tests: " + flaky);
  if (skipped > 0) reasons.push("Skipped tests: " + skipped);
  if (passRate < 1) reasons.push("Pass rate below 100% for this small critical suite");
  return { decision: reasons.length ? "NO-GO" : "GO", total, passed, failed, flaky, skipped, passRate, reasons };
}

if (require.main === module) {
  const file = process.argv[2] || "artifacts/playwright-results.json";
  if (!fs.existsSync(file)) {
    console.error("NO-GO: missing test evidence at " + file);
    process.exitCode = 1;
  } else {
    const decision = evaluate(JSON.parse(fs.readFileSync(file, "utf8")));
    console.log(JSON.stringify(decision, null, 2));
    process.exitCode = decision.decision === "GO" ? 0 : 1;
  }
}
module.exports = { evaluate };
