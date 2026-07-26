import type { ObservedPresentationUnit } from "../../runtime/observed-presentation-unit.type.js";

function slug(value: string): string {
  return value.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export function observesTypescriptPresentationUnits(text: string): ObservedPresentationUnit[] {
  const units: ObservedPresentationUnit[] = [];
  const operationPattern = /export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/g;
  for (const match of text.matchAll(operationPattern)) {
    const title = match[1];
    const startLine = text.slice(0, match.index).split(/\r?\n/).length;
    units.push({
      observedKind: "typescript-exported-operation",
      title,
      semanticIdentity: `source-operation/${slug(title)}`,
      startLine,
      endLine: startLine,
      contentLength: match[0].length,
      sourceIdentity: { exportedOperation: title }
    });
    const tail = text.slice(match.index);
    if (/edges\.(?:invokes|projects)\s*\(/.test(tail)) {
      units.push({
        observedKind: "typescript-collapsed-body",
        title: `${title} execution body`,
        semanticIdentity: `execution-body/${slug(title)}`,
        startLine,
        endLine: text.split(/\r?\n/).length,
        contentLength: tail.length,
        sourceIdentity: { exportedOperation: title, collapsed: true }
      });
    }
  }
  return units;
}
