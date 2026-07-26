import type {
  ResolvedScenePlanningAuthority,
  ScenePlanningRequest,
  SemanticEdges
} from "./repository-walkthrough-scene-planning.type.js";

export async function resolvesRepositoryWalkthroughScenePlanningAuthority(
  context: { request: ScenePlanningRequest; edges: SemanticEdges }
): Promise<ResolvedScenePlanningAuthority> {
  return context.edges.invokes(
    "resolve-repository-walkthrough-scene-planning-authority",
    context.request
  ) as Promise<ResolvedScenePlanningAuthority>;
}
