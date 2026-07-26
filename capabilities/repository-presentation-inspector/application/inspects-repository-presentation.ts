import { createsRepositoryPresentationInspectorEdges } from "../runtime/creates-repository-presentation-inspector-edges.js";
import { executesResolvedRepositoryPresentationInspection } from "../runtime/executes-resolved-repository-presentation-inspection.js";
import { projectsRepositoryPresentationInspectionResult } from "../runtime/projects-repository-presentation-inspection-result.js";
import { resolvesRepositoryPresentationInspectionAuthority } from "../runtime/resolves-repository-presentation-inspection-authority.js";
import type {
  RepositoryPresentationInspectionContext,
  RepositoryPresentationInspectionResult
} from "../runtime/repository-presentation-inspection.type.js";

export async function inspectsRepositoryPresentation(
  context: RepositoryPresentationInspectionContext
): Promise<RepositoryPresentationInspectionResult> {
  const edges = createsRepositoryPresentationInspectorEdges();
  const authority = await resolvesRepositoryPresentationInspectionAuthority({ inspectionContext: context, edges });
  const execution = await executesResolvedRepositoryPresentationInspection({ authority, edges });
  return projectsRepositoryPresentationInspectionResult({ execution, edges });
}

export type {
  RepositoryPresentationInspectionContext,
  RepositoryPresentationInspectionPorts,
  RepositoryPresentationInspectionRequest,
  RepositoryPresentationInspectionResult
} from "../runtime/repository-presentation-inspection.type.js";
