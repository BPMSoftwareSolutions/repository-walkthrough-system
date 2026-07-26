import { observesGherkinPresentationUnits } from "./observes-gherkin-presentation-units.js";

export function observesGherkinFeature(text: string) {
  return observesGherkinPresentationUnits(text).filter((unit) => unit.observedKind === "gherkin-feature");
}
