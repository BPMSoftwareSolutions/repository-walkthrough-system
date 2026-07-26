import type { ObservedPresentationUnit } from "../../runtime/observed-presentation-unit.type.js";

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "untitled";
}

function lineOf(text: string, identity: string): number {
  const index = text.indexOf(`"${identity}"`);
  return index < 0 ? 1 : text.slice(0, index).split(/\r?\n/).length;
}

function collectIdentities(value: unknown, key: "decisionId" | "projectionId", result: string[]): void {
  if (Array.isArray(value)) {
    value.forEach((child) => collectIdentities(child, key, result));
    return;
  }
  if (value === null || typeof value !== "object") return;
  const record = value as Record<string, unknown>;
  if (typeof record[key] === "string") result.push(record[key] as string);
  Object.values(record).forEach((child) => collectIdentities(child, key, result));
}

export function observesJsonPresentationUnits(
  text: string,
  artifactKind: "semantic-authority" | "json-contract" | "json-schema"
): ObservedPresentationUnit[] {
  const parsed = JSON.parse(text) as Record<string, unknown>;
  const lines = text.split(/\r?\n/);
  const title = String(parsed.title ?? parsed.semanticType ?? parsed.contractType ?? parsed.$id ?? "JSON body");
  const rootKind = artifactKind === "json-schema"
    ? "schema-root"
    : artifactKind === "json-contract"
      ? "contract-root"
      : "semantic-root";
  const rootPrefix = artifactKind === "json-schema"
    ? "schema"
    : artifactKind === "json-contract"
      ? "contract"
      : "semantic-authority";
  const units: ObservedPresentationUnit[] = [{
    observedKind: rootKind,
    title,
    semanticIdentity: `${rootPrefix}/${slug(title)}`,
    startLine: 1,
    endLine: Math.max(lines.length, 1),
    contentLength: text.length,
    sourceIdentity: {
      semanticType: parsed.semanticType ?? null,
      schemaId: parsed.$id ?? null,
      contractType: parsed.contractType ?? null
    }
  }];

  if (artifactKind === "semantic-authority") {
    const decisions: string[] = [];
    const projections: string[] = [];
    collectIdentities(parsed, "decisionId", decisions);
    collectIdentities(parsed, "projectionId", projections);
    for (const decisionId of [...new Set(decisions)]) {
      units.push({
        observedKind: "semantic-decision",
        title: decisionId,
        semanticIdentity: `semantic-authority/${slug(decisionId)}`,
        startLine: lineOf(text, decisionId),
        endLine: lineOf(text, decisionId),
        contentLength: decisionId.length,
        sourceIdentity: { decisionId }
      });
    }
    for (const projectionId of [...new Set(projections)]) {
      units.push({
        observedKind: "semantic-projection",
        title: projectionId,
        semanticIdentity: `semantic-authority/${slug(projectionId)}`,
        startLine: lineOf(text, projectionId),
        endLine: lineOf(text, projectionId),
        contentLength: projectionId.length,
        sourceIdentity: { projectionId }
      });
    }
  }
  return units;
}
