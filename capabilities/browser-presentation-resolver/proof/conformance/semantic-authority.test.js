import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

async function readsJson(relativePath) {
  const text = await readFile(new URL(`../../${relativePath}`, import.meta.url), "utf8");
  return JSON.parse(text);
}

test("execution model declares resolution, projection, validation, and proof", async () => {
  const model = await readsJson(
    "semantic-authority/execution-models/resolve-browser-presentation.execution-model.sej.v1.json"
  );
  const steps = model.steps;
  assert.equal(steps.length, 7);
  assert.equal(steps.some((step) => step.iterate === "resolve-browser-presentation-scenes"), true);
  assert.equal(steps.some((step) => step.project === "project-resolved-browser-presentation"), true);
  assert.equal(steps.some((step) => step.validate === "resolved-browser-presentation.schema.v1.json"), true);
});

test("operation projection contains no executor-specific locator", async () => {
  const projection = await readsJson(
    "semantic-authority/projections/project-browser-presentation-operations.sej.v1.json"
  );
  const serialized = JSON.stringify(projection).toLowerCase();
  assert.equal(serialized.includes("selector"), false);
  assert.equal(serialized.includes("xpath"), false);
  assert.equal(serialized.includes("playwright"), false);
});
