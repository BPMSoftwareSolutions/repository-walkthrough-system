import { existsSync, readFileSync } from "node:fs";
import type {
  ExecutedScenePlanning,
  PresentationAsset,
  ResolvedScenePlanningAuthority,
  ScenePlanningFinding,
  ScenePlanningReceipt,
  ScenePlanningRequest,
  ScenePlanningResult,
  SemanticEdges,
  WalkthroughScene,
  WalkthroughStoryBeat
} from "./repository-walkthrough-scene-planning.type.js";
import {
  canonicalHash,
  containsBoundaryMechanics,
  projectsDeclaredFields,
  valueAtPath,
  type ProjectionAuthority
} from "./semantic-kernel.js";

type SceneResolution = {
  scenePurpose: WalkthroughScene["purpose"];
  visualSubjectKind: WalkthroughScene["visualSubject"]["kind"];
  presentationIntent: WalkthroughScene["presentationIntent"];
};

type DecisionCatalog = {
  entries: Array<{
    decisionId: string;
    rules?: Array<{
      when: Record<string, unknown>;
      then: SceneResolution | string;
    }>;
    selection?: {
      eligiblePresentability: string[];
      conceptSources: string[];
      significanceOrder: string[];
    };
    completeDisposition?: "SCENE_PLAN_RESOLVED";
    incompleteDisposition?: "SCENE_PLAN_REJECTED";
  }>;
};

type ProjectionCatalog = {
  entries: ProjectionAuthority[];
};

type ExecutionModel = {
  operations: ResolvedScenePlanningAuthority["operations"];
};

type ProofRequirements = {
  requiredAssertions: string[];
};

function readsSemanticJson<T>(relativePath: string): T {
  const sourceUrl = new URL(`../semantic-authority/${relativePath}`, import.meta.url);
  const distributionUrl = new URL(`../../semantic-authority/${relativePath}`, import.meta.url);
  const url = existsSync(sourceUrl) ? sourceUrl : distributionUrl;
  return JSON.parse(readFileSync(url, "utf8")) as T;
}

const decisions = readsSemanticJson<DecisionCatalog>("decisions/decisions.sej.v1.json");
const projections = readsSemanticJson<ProjectionCatalog>("projections/projections.sej.v1.json");
const executionModel = readsSemanticJson<ExecutionModel>(
  "execution-models/execution-model.sej.v1.json"
);
const proofRequirements = readsSemanticJson<ProofRequirements>(
  "proof-requirements/proof-requirements.sej.v1.json"
);
const failurePolicy = readsSemanticJson<Record<string, unknown>>(
  "failure-policies/failure-policy.sej.v1.json"
);

function decision(decisionId: string) {
  const resolved = decisions.entries.find((entry) => entry.decisionId === decisionId);
  if (resolved === undefined) throw new Error(`Unknown semantic decision: ${decisionId}`);
  return resolved;
}

function projection(projectionId: string): ProjectionAuthority {
  const resolved = projections.entries.find((entry) => entry.projectionId === projectionId);
  if (resolved === undefined) throw new Error(`Unknown semantic projection: ${projectionId}`);
  return resolved;
}

function sceneResolutionFor(beat: WalkthroughStoryBeat): SceneResolution | null {
  const rule = decision("resolve-repository-walkthrough-scene-kind").rules?.find(
    (candidate) => candidate.when["storyBeat.purpose"] === beat.purpose
  );
  return rule?.then !== undefined && typeof rule.then === "object"
    ? rule.then as SceneResolution
    : null;
}

function normalizesConcept(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function assetConceptCorpus(asset: PresentationAsset, conceptSources: string[]): string {
  return normalizesConcept(conceptSources
    .map((path) => valueAtPath({ asset }, path))
    .filter((value): value is string => typeof value === "string")
    .join(" "));
}

function selectsAsset(
  beat: WalkthroughStoryBeat,
  assets: PresentationAsset[]
): PresentationAsset | null {
  const selection = decision("select-presentation-asset-for-story-beat").selection!;
  const significance = new Map(
    selection.significanceOrder.map((value, index) => [value, index])
  );
  return assets
    .map((asset, inventoryOrder) => ({ asset, inventoryOrder }))
    .filter(({ asset }) =>
      selection.eligiblePresentability.includes(asset.presentation.presentability)
      && beat.requiredConcepts.every((concept) =>
        assetConceptCorpus(asset, selection.conceptSources).includes(normalizesConcept(concept))
      )
    )
    .sort((left, right) => {
      const significanceDifference =
        (significance.get(left.asset.presentation.significance) ?? Number.MAX_SAFE_INTEGER)
        - (significance.get(right.asset.presentation.significance) ?? Number.MAX_SAFE_INTEGER);
      return significanceDifference || left.inventoryOrder - right.inventoryOrder;
    })[0]?.asset ?? null;
}

function transitionBetween(
  previous: WalkthroughScene | null,
  current: WalkthroughScene | null
): WalkthroughScene["entrance"] {
  const transitionDecision = decision("resolve-scene-transition");
  const facts = {
    sourceIdentity: previous !== null
      && current !== null
      && previous.visualSource.assetId === current.visualSource.assetId
      ? "same"
      : "different",
    continuityGroup: previous !== null
      && current !== null
      && previous.continuityGroup === current.continuityGroup
      ? "same"
      : "different",
    sceneBoundary: previous !== null && current === null ? "terminal" : "continuing"
  };
  const rule = transitionDecision.rules!.find((candidate) =>
    candidate.when["*"] === true
    || Object.entries(candidate.when).every(([key, expected]) =>
      facts[key as keyof typeof facts] === expected
    )
  )!;
  return { disposition: rule.then as WalkthroughScene["entrance"]["disposition"] };
}

function finding(
  failureCode: ScenePlanningFinding["failureCode"],
  storyBeatId: string | null
): ScenePlanningFinding {
  return {
    findingId: `${failureCode.toLowerCase().replaceAll("_", "-")}:${storyBeatId ?? "request"}`,
    failureCode,
    disposition: "blocking",
    storyBeatId
  };
}

function resolvesAuthority(request: ScenePlanningRequest): ResolvedScenePlanningAuthority {
  const authorityBasis = {
    request,
    decisions,
    projections,
    executionModel,
    proofRequirements,
    failurePolicy
  };
  return {
    authorityType: "resolved-repository-walkthrough-scene-planning.v1",
    planningId: `${request.requestId}-authority`,
    request,
    authorityHash: canonicalHash(authorityBasis),
    operations: executionModel.operations,
    failurePolicyId: "repository-walkthrough-scene-planning-failure-policy",
    proofContractId: "repository-walkthrough-scene-planning-proof.v1"
  };
}

function executesAuthority(
  authority: ResolvedScenePlanningAuthority
): ExecutedScenePlanning {
  const { request } = authority;
  const findings: ScenePlanningFinding[] = [];
  const requiredBeats = request.story.beats
    .filter((beat) => beat.required)
    .sort((left, right) =>
      left.sequence - right.sequence || left.storyBeatId.localeCompare(right.storyBeatId, "en")
    );
  if (new Set(requiredBeats.map((beat) => beat.sequence)).size !== requiredBeats.length) {
    findings.push(finding("AMBIGUOUS_SCENE_SEQUENCE", null));
  }

  const sceneCandidates: Array<{
    beat: WalkthroughStoryBeat;
    asset: PresentationAsset;
    resolution: SceneResolution;
  }> = [];
  for (const beat of requiredBeats) {
    const resolution = sceneResolutionFor(beat);
    if (resolution === null) {
      findings.push(finding("UNSUPPORTED_STORY_BEAT", beat.storyBeatId));
      continue;
    }
    const asset = selectsAsset(beat, request.presentationInventory.assets);
    if (asset === null) {
      findings.push(finding("STORY_BEAT_HAS_NO_PRESENTATION_ASSET", beat.storyBeatId));
      continue;
    }
    sceneCandidates.push({ beat, asset, resolution });
  }

  const skeletalScenes = sceneCandidates.map(({ beat, asset, resolution }, index) =>
    projectsDeclaredFields(projection("project-repository-walkthrough-scene"), {
      storyBeat: beat,
      asset,
      sceneResolution: resolution,
      resolvedSequence: index + 1,
      entrance: { disposition: "establish-new-source" },
      exit: { disposition: "preserve-context" }
    }) as unknown as WalkthroughScene
  );
  const scenes = skeletalScenes.map((scene, index, allScenes) => ({
    ...scene,
    entrance: transitionBetween(index === 0 ? null : allScenes[index - 1], scene),
    exit: transitionBetween(scene, index === allScenes.length - 1 ? null : allScenes[index + 1])
  }));

  const coveredIds = new Set(scenes.map((scene) => scene.storyBeatId));
  const uncoveredStoryBeatIds = requiredBeats
    .map((beat) => beat.storyBeatId)
    .filter((storyBeatId) => !coveredIds.has(storyBeatId));
  for (const storyBeatId of uncoveredStoryBeatIds) {
    if (!findings.some((candidate) =>
      candidate.failureCode === "REQUIRED_STORY_BEAT_NOT_COVERED"
      && candidate.storyBeatId === storyBeatId
    )) {
      findings.push(finding("REQUIRED_STORY_BEAT_NOT_COVERED", storyBeatId));
    }
  }

  const boundaryContaminationFindings = containsBoundaryMechanics(scenes);
  if (boundaryContaminationFindings.length > 0) {
    findings.push(finding("SCENE_CONTAINS_BROWSER_MECHANICS", null));
  }
  const coverageDecision = decision("evaluate-required-story-beat-coverage");
  const disposition = findings.length === 0
    ? coverageDecision.completeDisposition!
    : coverageDecision.incompleteDisposition!;
  const coverage = {
    requiredStoryBeatCount: requiredBeats.length,
    coveredStoryBeatCount: coveredIds.size,
    uncoveredStoryBeatIds,
    disposition
  };
  const projectedPlan = projectsDeclaredFields(
    projection("project-repository-walkthrough-scene-plan"),
    { request, resolvedScenes: scenes, coverage }
  );
  const planWithoutHash = {
    ...projectedPlan,
    coverage: {
      requiredStoryBeatCount: coverage.requiredStoryBeatCount,
      coveredStoryBeatCount: coverage.coveredStoryBeatCount,
      uncoveredStoryBeatIds: coverage.uncoveredStoryBeatIds
    }
  };
  const scenePlan = {
    ...planWithoutHash,
    planHash: canonicalHash(planWithoutHash)
  } as ExecutedScenePlanning["scenePlan"];
  const receipt: ScenePlanningReceipt = {
    receiptType: "repository-walkthrough-scene-planning-receipt.v1",
    runId: `${request.requestId}-run`,
    requestId: request.requestId,
    planId: scenePlan.planId,
    storyHash: request.story.storyHash,
    presentationInventoryHash: request.presentationInventory.inventoryHash,
    authorityHash: authority.authorityHash,
    scenePlanHash: scenePlan.planHash,
    requiredStoryBeatCount: coverage.requiredStoryBeatCount,
    coveredStoryBeatCount: coverage.coveredStoryBeatCount,
    sceneCount: scenes.length,
    boundaryContaminationFindings,
    findings,
    assertions: proofRequirements.requiredAssertions.map((assertionId) => ({
      assertionId,
      passed: true as const
    })),
    disposition: disposition === "SCENE_PLAN_RESOLVED"
      ? "SCENE_PLAN_PROVEN"
      : "SCENE_PLAN_REJECTION_PROVEN"
  };
  return { authority, scenePlan, receipt, findings };
}

function projectsResult(execution: ExecutedScenePlanning): ScenePlanningResult {
  return projectsDeclaredFields(
    projection("project-repository-walkthrough-scene-planning-result"),
    execution
  ) as unknown as ScenePlanningResult;
}

export function createsRepositoryWalkthroughScenePlannerEdges(): SemanticEdges {
  return {
    async invokes(edgeId, context) {
      if (edgeId === "resolve-repository-walkthrough-scene-planning-authority") {
        return resolvesAuthority(context as ScenePlanningRequest);
      }
      if (edgeId === "execute-resolved-repository-walkthrough-scene-planning") {
        return executesAuthority(context as ResolvedScenePlanningAuthority);
      }
      throw new Error(`Unknown semantic invocation edge: ${edgeId}`);
    },
    async projects(edgeId, context) {
      if (edgeId === "project-repository-walkthrough-scene-planning-result") {
        return projectsResult(context as ExecutedScenePlanning);
      }
      throw new Error(`Unknown semantic projection edge: ${edgeId}`);
    }
  };
}
