import { observesMarkdownPresentationUnits } from "./observes-markdown-presentation-units.js";

export function observesMarkdownCodeBlocks(text: string) {
  return observesMarkdownPresentationUnits(text).filter((unit) => unit.observedKind === "markdown-code-block");
}
