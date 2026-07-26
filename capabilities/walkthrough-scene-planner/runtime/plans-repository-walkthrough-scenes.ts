import { executesResolvedRepositoryWalkthroughScenePlanning } from "./executes-resolved-repository-walkthrough-scene-planning.js";
import { projectsRepositoryWalkthroughScenePlan } from "./projects-repository-walkthrough-scene-plan.js";
import { resolvesRepositoryWalkthroughScenePlanningAuthority } from "./resolves-repository-walkthrough-scene-planning-authority.js";
import type {
  ScenePlanningRequest,
  ScenePlanningResult,
  SemanticEdges
} from "./repository-walkthrough-scene-planning.type.js";

export async function plansRepositoryWalkthroughScenes(
  context: { request: ScenePlanningRequest; edges: SemanticEdges }
): Promise<ScenePlanningResult> {
  const authority = await resolvesRepositoryWalkthroughScenePlanningAuthority(context);
  const execution = await executesResolvedRepositoryWalkthroughScenePlanning({
    authority,
    edges: context.edges
  });
  return projectsRepositoryWalkthroughScenePlan({
    execution,
    edges: context.edges
  });
}
