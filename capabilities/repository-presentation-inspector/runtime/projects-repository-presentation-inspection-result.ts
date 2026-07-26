import type {
  ProjectionContext,
  RepositoryPresentationInspectionResult
} from "./repository-presentation-inspection.type.js";

export async function projectsRepositoryPresentationInspectionResult(
  context: ProjectionContext
): Promise<RepositoryPresentationInspectionResult> {
  return context.edges.projects(
    "project-repository-presentation-inspection-result",
    context.execution
  ) as Promise<RepositoryPresentationInspectionResult>;
}
