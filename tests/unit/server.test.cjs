const test = require("node:test");
const assert = require("node:assert/strict");
const { routes, server } = require("../../tools/server.cjs");

test("server exposes only allowlisted application routes", () => {
  assert.equal(routes.has("/script.js"), true);
  assert.equal(routes.has("/../package.json"), false);
});

test("health endpoint returns valid JSON and unknown paths return 404", async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const address = server.address();
    const base = "http://127.0.0.1:" + address.port;
    const health = await fetch(base + "/health");
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { status: "ok" });
    const missing = await fetch(base + "/package.json");
    assert.equal(missing.status, 404);
    const app = await fetch(base + "/");
    assert.equal(app.status, 200);
    assert.match(app.headers.get("content-security-policy"), /default-src 'none'/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
