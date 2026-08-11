import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the ranking widget hub homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>RankKit｜地域ランキング・収益ウィジェット<\/title>/i);
  assert.match(html, /RANK<span>KIT<\/span>/);
  assert.match(html, /地域ランキングを、/);
  assert.match(html, /ウィジェット作成/);
  assert.match(html, /LIVE PREVIEW/);
  assert.match(html, /埋め込みコードをコピー/);
  assert.match(html, /ジャンル対応/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("repository metadata and copy are aligned with RankKit", async () => {
  const [css, page, layout, packageJson, readme] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);

  assert.match(packageJson, /"name": "ranking-widget-hub"/);
  assert.match(packageJson, /"build": "node build\/run-vinext\.mjs build"/);
  assert.match(layout, /title:\s*"RankKit｜地域ランキング・収益ウィジェット"/);
  assert.match(page, /RANK<span>KIT<\/span>/);
  assert.match(page, /埋め込みコードをコピー/);
  assert.match(page, /地域型サイトのランキング・比較・収益計測基盤/);
  assert.match(css, /\.hero/);
  assert.match(css, /\.widget\.dark/);
  assert.match(readme, /# ranking-widget-hub/);
  assert.match(readme, /地域サイト向けのランキング表示ウィジェット/);
  assert.doesNotMatch(readme, /vinext-starter|loading skeleton/i);
});
