import { observesTypescriptPresentationUnits } from "./observes-typescript-presentation-units.js";

export function observesSourceBodyRange(text: string) {
  return observesTypescriptPresentationUnits(text).filter(
    (unit) => unit.observedKind === "typescript-collapsed-body"
  );
}
