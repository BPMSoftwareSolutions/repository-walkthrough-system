import { observesMarkdownPresentationUnits } from "./observes-markdown-presentation-units.js";

export function observesMarkdownDiagrams(text: string) {
  return observesMarkdownPresentationUnits(text).filter((unit) => unit.observedKind === "markdown-ascii-diagram");
}
