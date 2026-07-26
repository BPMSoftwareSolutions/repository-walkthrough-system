import { resolvesReadmePresentationInspectionAuthority } from "../runtime/resolves-readme-presentation-inspection-authority.js";
import { executesResolvedReadmePresentationInspection } from "../runtime/executes-resolved-readme-presentation-inspection.js";
import { projectsReadmePresentationInspectionResult } from "../runtime/projects-readme-presentation-inspection-result.js";

export async function inventoryPresentableRepositoryMaterial(context: unknown): Promise<unknown> {
  const authority = await resolvesReadmePresentationInspectionAuthority(context);
  const execution = await executesResolvedReadmePresentationInspection(authority);
  return projectsReadmePresentationInspectionResult(execution);
}
