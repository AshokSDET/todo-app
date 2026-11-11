const test = require("node:test");
const assert = require("node:assert/strict");
const { evaluate } = require("../../tools/release-gate.cjs");

function report(statuses) {
  return { suites: [{ specs: [{ tests: statuses.map(status => ({ status })) }] }] };
}
test("all expected outcomes allow a GO decision", () => {
  assert.equal(evaluate(report(["expected", "expected"])).decision, "GO");
});
test("unexpected failure blocks release", () => {
  assert.equal(evaluate(report(["expected", "unexpected"])).decision, "NO-GO");
});
test("flaky tests block release even if retry succeeds", () => {
  assert.equal(evaluate(report(["expected", "flaky"])).decision, "NO-GO");
});
test("skipped tests block release", () => {
  assert.equal(evaluate(report(["expected", "skipped"])).decision, "NO-GO");
});
test("empty evidence cannot authorize release", () => {
  assert.equal(evaluate(report([])).decision, "NO-GO");
});
