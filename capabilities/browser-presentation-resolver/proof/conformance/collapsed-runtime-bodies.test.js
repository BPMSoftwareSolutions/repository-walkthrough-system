import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const capabilityBodies = [
  "runtime/resolves-browser-presentation-authority.ts",
  "runtime/executes-browser-presentation-resolution.ts",
  "runtime/projects-resolved-browser-presentation.ts"
];

const forbidden = [
  /\bif\s*\(/,
  /\bswitch\s*\(/,
  /\bfor\s*\(/,
  /\bwhile\s*\(/,
  /\?\s*[^:]+:/,
  /playwright/i,
  /puppeteer/i,
  /querySelector/i,
  /xpath/i
];

test("scenario responsibility bodies remain collapsed and browser-engine neutral", async () => {
  const sources = await Promise.all(
    capabilityBodies.map((path) => readFile(new URL(`../../${path}`, import.meta.url), "utf8"))
  );

  for (const source of sources) {
    for (const pattern of forbidden) {
      assert.equal(pattern.test(source), false, `forbidden body pattern: ${pattern}`);
    }
  }
});
