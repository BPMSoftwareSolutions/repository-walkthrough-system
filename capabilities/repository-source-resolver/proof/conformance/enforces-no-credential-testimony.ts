import { hasCredentialMaterial } from "../../runtime/semantic-kernel.js";

export function enforcesNoCredentialTestimony(result: unknown): boolean {
  return !hasCredentialMaterial(result);
}
