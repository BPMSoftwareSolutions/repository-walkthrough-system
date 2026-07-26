import { observesGherkinPresentationUnits } from "./observes-gherkin-presentation-units.js";

export function observesGherkinScenarios(text: string) {
  return observesGherkinPresentationUnits(text).filter((unit) => unit.observedKind === "gherkin-scenario");
}
