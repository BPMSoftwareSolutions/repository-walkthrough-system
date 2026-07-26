import type {
  ExecutedScenePlanning,
  ScenePlanningResult,
  SemanticEdges
} from "./repository-walkthrough-scene-planning.type.js";

export async function projectsRepositoryWalkthroughScenePlan(
  context: { execution: ExecutedScenePlanning; edges: SemanticEdges }
): Promise<ScenePlanningResult> {
  return context.edges.projects(
    "project-repository-walkthrough-scene-planning-result",
    context.execution
  ) as Promise<ScenePlanningResult>;
}
