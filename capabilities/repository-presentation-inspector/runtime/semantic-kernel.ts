import { createHash } from "node:crypto";

export function canonicalValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalValue);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right, "en"))
        .map(([key, child]) => [key, canonicalValue(child)])
    );
  }
  return value;
}

export function canonicalHash(value: unknown): string {
  return `sha256:${createHash("sha256").update(JSON.stringify(canonicalValue(value))).digest("hex")}`;
}

function getPath(context: unknown, path: string): unknown {
  const normalized = path.replace(/^\$\./, "");
  return normalized.split(".").reduce<unknown>((value, key) => {
    if (value === null || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[key];
  }, context);
}

function matchesOperator(actual: unknown, expected: Record<string, unknown>, context: unknown): boolean {
  if ("present" in expected) return expected.present === (actual !== null && actual !== undefined && actual !== "");
  if ("in" in expected) return Array.isArray(expected.in) && expected.in.includes(actual);
  if ("inCaseInsensitive" in expected) {
    return typeof actual === "string"
      && Array.isArray(expected.inCaseInsensitive)
      && expected.inCaseInsensitive.some((candidate) =>
        typeof candidate === "string" && candidate.toLowerCase() === actual.toLowerCase()
      );
  }
  if ("matches" in expected) return typeof actual === "string" && new RegExp(String(expected.matches)).test(actual);
  if ("matchesCaseInsensitive" in expected) {
    return typeof actual === "string" && new RegExp(String(expected.matchesCaseInsensitive), "i").test(actual);
  }
  if ("greaterThan" in expected) return typeof actual === "number" && actual > Number(expected.greaterThan);
  if ("greaterThanPath" in expected) {
    const comparison = getPath(context, String(expected.greaterThanPath));
    return typeof actual === "number" && typeof comparison === "number" && actual > comparison;
  }
  return false;
}

function matchesCondition(actual: unknown, expected: unknown, context: unknown): boolean {
  if (expected !== null && typeof expected === "object" && !Array.isArray(expected)) {
    return matchesOperator(actual, expected as Record<string, unknown>, context);
  }
  return actual === expected;
}

export interface SemanticDecision {
  decisionId: string;
  rules: Array<{ when: Record<string, unknown>; then: string }>;
}

export function resolvesDecision(
  decisions: SemanticDecision[],
  decisionId: string,
  context: unknown
): string | null {
  const decision = decisions.find((candidate) => candidate.decisionId === decisionId);
  if (decision === undefined) throw new Error(`Unknown semantic decision: ${decisionId}`);
  for (const rule of decision.rules) {
    if (rule.when["*"] === true) return rule.then;
    const matched = Object.entries(rule.when).every(([path, expected]) =>
      matchesCondition(getPath(context, path), expected, context)
    );
    if (matched) return rule.then;
  }
  return null;
}
