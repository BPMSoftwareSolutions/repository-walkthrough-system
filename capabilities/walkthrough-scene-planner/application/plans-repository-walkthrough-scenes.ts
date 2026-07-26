import { createsRepositoryWalkthroughScenePlannerEdges } from "../runtime/creates-repository-walkthrough-scene-planner-edges.js";
import { plansRepositoryWalkthroughScenes as plansWithResolvedAuthority } from "../runtime/plans-repository-walkthrough-scenes.js";
import type {
  ScenePlanningRequest,
  ScenePlanningResult
} from "../runtime/repository-walkthrough-scene-planning.type.js";

export async function plansRepositoryWalkthroughScenes(
  request: ScenePlanningRequest
): Promise<ScenePlanningResult> {
  const edges = createsRepositoryWalkthroughScenePlannerEdges();
  return plansWithResolvedAuthority({ request, edges });
}

export type {
  ScenePlanningRequest,
  ScenePlanningResult,
  WalkthroughScene,
  WalkthroughScenePlan
} from "../runtime/repository-walkthrough-scene-planning.type.js";
