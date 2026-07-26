import type {
  ProjectionContext,
  RepositorySourceResolutionResult
} from "./repository-source-resolution.type.js";

export async function projectRepositorySourceResolutionResult(
  context: ProjectionContext
): Promise<RepositorySourceResolutionResult> {
  return context.edges.projects(
    "project-repository-source-resolution-result",
    context.execution
  ) as Promise<RepositorySourceResolutionResult>;
}
