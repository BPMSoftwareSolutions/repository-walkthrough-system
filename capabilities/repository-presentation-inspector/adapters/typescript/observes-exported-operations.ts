import { observesTypescriptPresentationUnits } from "./observes-typescript-presentation-units.js";

export function observesExportedOperations(text: string) {
  return observesTypescriptPresentationUnits(text).filter(
    (unit) => unit.observedKind === "typescript-exported-operation"
  );
}
