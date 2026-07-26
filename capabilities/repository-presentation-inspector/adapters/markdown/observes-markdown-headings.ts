import { observesMarkdownPresentationUnits } from "./observes-markdown-presentation-units.js";

export function observesMarkdownHeadings(text: string) {
  return observesMarkdownPresentationUnits(text).filter((unit) => unit.observedKind === "markdown-heading");
}
