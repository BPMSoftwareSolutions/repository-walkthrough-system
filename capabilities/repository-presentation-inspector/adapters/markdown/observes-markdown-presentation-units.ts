import type { ObservedPresentationUnit } from "../../runtime/observed-presentation-unit.type.js";

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "untitled";
}

function looksLikeAsciiDiagram(value: string): boolean {
  return /[┌┐└┘├┤│─▼▲→←]/u.test(value) || /(?:^|\n)\s*(?:\+[-+]+\+|\|.+\|)/.test(value);
}

export function observesMarkdownPresentationUnits(text: string): ObservedPresentationUnit[] {
  const lines = text.split(/\r?\n/);
  const units: ObservedPresentationUnit[] = [];
  const headingOccurrences = new Map<string, number>();
  let fenceStart = -1;
  let fenceLanguage = "";

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const heading = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (heading !== null && fenceStart < 0) {
      const title = heading[2].replace(/\s+#+$/, "");
      const identity = slug(title);
      const occurrence = (headingOccurrences.get(identity) ?? 0) + 1;
      headingOccurrences.set(identity, occurrence);
      units.push({
        observedKind: "markdown-heading",
        title,
        semanticIdentity: `readme/${identity}${occurrence > 1 ? `-${occurrence}` : ""}`,
        startLine: index + 1,
        endLine: index + 1,
        contentLength: title.length,
        sourceIdentity: {
          headingText: title,
          headingLevel: heading[1].length,
          occurrence
        }
      });
    }

    const fence = /^```\s*([^\s`]*)/.exec(line);
    if (fence !== null) {
      if (fenceStart < 0) {
        fenceStart = index;
        fenceLanguage = fence[1] || "text";
      } else {
        const body = lines.slice(fenceStart + 1, index).join("\n");
        const observedKind = looksLikeAsciiDiagram(body)
          ? "markdown-ascii-diagram"
          : "markdown-code-block";
        const sequence = units.filter((unit) =>
          unit.observedKind === "markdown-code-block" || unit.observedKind === "markdown-ascii-diagram"
        ).length + 1;
        units.push({
          observedKind,
          title: observedKind === "markdown-ascii-diagram"
            ? `ASCII diagram ${sequence}`
            : `${fenceLanguage} example ${sequence}`,
          semanticIdentity: `${observedKind === "markdown-ascii-diagram" ? "diagram" : "code-example"}/${sequence}`,
          startLine: fenceStart + 1,
          endLine: index + 1,
          contentLength: body.length,
          sourceIdentity: { fenceLanguage, occurrence: sequence }
        });
        fenceStart = -1;
        fenceLanguage = "";
      }
    }
  }
  return units;
}
