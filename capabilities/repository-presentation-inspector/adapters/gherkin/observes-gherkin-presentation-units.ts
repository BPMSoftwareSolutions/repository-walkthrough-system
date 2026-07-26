import type { ObservedPresentationUnit } from "../../runtime/observed-presentation-unit.type.js";

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "untitled";
}

export function observesGherkinPresentationUnits(text: string): ObservedPresentationUnit[] {
  const lines = text.split(/\r?\n/);
  const units: ObservedPresentationUnit[] = [];
  for (let index = 0; index < lines.length; index += 1) {
    const feature = /^\s*Feature:\s*(.+?)\s*$/.exec(lines[index]);
    const scenario = /^\s*Scenario(?: Outline)?:\s*(.+?)\s*$/.exec(lines[index]);
    const match = feature ?? scenario;
    if (match === null) continue;
    const title = match[1];
    const observedKind = feature === null ? "gherkin-scenario" : "gherkin-feature";
    units.push({
      observedKind,
      title,
      semanticIdentity: `${feature === null ? "scenario" : "feature"}/${slug(title)}`,
      startLine: index + 1,
      endLine: index + 1,
      contentLength: lines[index].length,
      sourceIdentity: { keyword: feature === null ? "Scenario" : "Feature", title }
    });
  }
  return units;
}
