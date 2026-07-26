import type {
  ExecutedScenePlanning,
  ResolvedScenePlanningAuthority,
  SemanticEdges
} from "./repository-walkthrough-scene-planning.type.js";

export async function executesResolvedRepositoryWalkthroughScenePlanning(
  context: { authority: ResolvedScenePlanningAuthority; edges: SemanticEdges }
): Promise<ExecutedScenePlanning> {
  return context.edges.invokes(
    "execute-resolved-repository-walkthrough-scene-planning",
    context.authority
  ) as Promise<ExecutedScenePlanning>;
}
