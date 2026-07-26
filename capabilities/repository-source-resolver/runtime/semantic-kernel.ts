import { createHash } from "node:crypto";

function canonicalValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(canonicalValue);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, canonicalValue(child)])
    );
  }
  return value;
}

export function canonicalHash(value: unknown): string {
  const canonical = JSON.stringify(canonicalValue(value));
  return `sha256:${createHash("sha256").update(canonical).digest("hex")}`;
}

export function isFullCommit(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{40}$/i.test(value);
}

export function hasCredentialMaterial(value: unknown): boolean {
  const observedStrings: string[] = [];
  const visit = (candidate: unknown): void => {
    if (typeof candidate === "string") observedStrings.push(candidate);
    else if (Array.isArray(candidate)) candidate.forEach(visit);
    else if (candidate !== null && typeof candidate === "object") {
      Object.values(candidate as Record<string, unknown>).forEach(visit);
    }
  };
  visit(value);
  return observedStrings.some((candidate) =>
    /^(?:bearer\s+|gh[oprsu]_|github_pat_|basic\s+)/i.test(candidate)
  );
}
