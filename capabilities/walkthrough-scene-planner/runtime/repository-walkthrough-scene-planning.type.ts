export type StoryBeatPurpose =
  | "introduce-capability"
  | "explain-architecture"
  | "explain-semantic-contract"
  | "show-collapsed-execution-body"
  | "show-execution-proof";

export interface WalkthroughStoryBeat {
  storyBeatId: string;
  sequence: number;
  required: boolean;
  purpose: StoryBeatPurpose;
  requiredConcepts: string[];
  continuityGroup: string;
}

export interface WalkthroughStory {
  contractType: "walkthrough-story.v1";
  storyId: string;
  repositoryId: string;
  storyHash: string;
  beats: WalkthroughStoryBeat[];
}

export interface PresentationAsset {
  contractType: "presentation-asset.v1";
  assetId: string;
  artifactId: string;
  kind: string;
  title: string;
  location: {
    repositoryRelativePath: string;
    semanticAnchor: string;
  };
  source: {
    artifactKind: string;
    startLine: number;
    endLine: number;
    contentHash: string;
  };
  presentation: {
    presentability: string;
    significance: string;
    readiness: string;
    supportedSurfaces: string[];
  };
  relationships: {
    parentAssetId: string | null;
    childAssetIds: string[];
    relatedAssetIds: string[];
  };
  findings: unknown[];
}

export interface RepositoryPresentationInventory {
  inventoryType: "repository-presentation-inventory.v1";
  inventoryId: string;
  repository: {
    repositoryId: string;
    provider: "local-workspace";
    revision: string;
    sourceReceiptHash: string;
  };
  inspection: Record<string, unknown>;
  summary: Record<string, number>;
  assets: PresentationAsset[];
  findings: unknown[];
  disposition: string;
  inventoryHash: string;
}

export interface ScenePlanningPolicy {
  policyId: "complete-required-story-coverage.v1";
  missingPresentationAsset: "reject";
  unsupportedStoryBeat: "reject";
  incompleteCoverage: "reject";
}

export interface ScenePlanningRequest {
  contractType: "scene-planning-request.v1";
  requestId: string;
  story: WalkthroughStory;
  presentationInventory: RepositoryPresentationInventory;
  planningPolicy: ScenePlanningPolicy;
}

export type SceneTransitionDisposition =
  | "establish-new-source"
  | "retain-source-change-focus"
  | "preserve-context";

export interface WalkthroughScene {
  sceneId: string;
  storyBeatId: string;
  sequence: number;
  purpose:
    | "introduce-capability"
    | "present-architecture"
    | "explain-semantic-authority"
    | "show-execution-body"
    | "show-proof";
  visualSource: { assetId: string };
  visualSubject: {
    kind:
      | "document-section"
      | "diagram"
      | "semantic-contract"
      | "source-fragment"
      | "gherkin-scenario"
      | "execution-receipt";
    semanticAnchor: string;
  };
  presentationIntent: "establish" | "trace" | "focus" | "demonstrate" | "verify";
  entrance: { disposition: SceneTransitionDisposition };
  exit: { disposition: SceneTransitionDisposition };
  continuityGroup: string;
}

export interface ScenePlanningFinding {
  findingId: string;
  failureCode:
    | "INVALID_SCENE_PLANNING_REQUEST"
    | "STORY_BEAT_HAS_NO_PRESENTATION_ASSET"
    | "PRESENTATION_ASSET_NOT_ADMITTED"
    | "REQUIRED_STORY_BEAT_NOT_COVERED"
    | "SCENE_CONTAINS_BROWSER_MECHANICS"
    | "AMBIGUOUS_SCENE_SEQUENCE"
    | "UNSUPPORTED_STORY_BEAT";
  disposition: "blocking";
  storyBeatId: string | null;
}

export interface WalkthroughScenePlan {
  contractType: "walkthrough-scene-plan.v1";
  planId: string;
  storyId: string;
  repositoryId: string;
  scenes: WalkthroughScene[];
  coverage: {
    requiredStoryBeatCount: number;
    coveredStoryBeatCount: number;
    uncoveredStoryBeatIds: string[];
  };
  disposition: "SCENE_PLAN_RESOLVED" | "SCENE_PLAN_REJECTED";
  planHash: string;
}

export interface ScenePlanningReceipt {
  receiptType: "repository-walkthrough-scene-planning-receipt.v1";
  runId: string;
  requestId: string;
  planId: string;
  storyHash: string;
  presentationInventoryHash: string;
  authorityHash: string;
  scenePlanHash: string;
  requiredStoryBeatCount: number;
  coveredStoryBeatCount: number;
  sceneCount: number;
  boundaryContaminationFindings: string[];
  findings: ScenePlanningFinding[];
  assertions: Array<{ assertionId: string; passed: true }>;
  disposition: "SCENE_PLAN_PROVEN" | "SCENE_PLAN_REJECTION_PROVEN";
}

export interface ScenePlanningResult {
  contractType: "repository-walkthrough-scene-planning-result.v1";
  disposition: "SCENE_PLAN_RESOLVED" | "SCENE_PLAN_REJECTED";
  plan: WalkthroughScenePlan;
  receipt: ScenePlanningReceipt;
  findings: ScenePlanningFinding[];
}

export interface ResolvedScenePlanningAuthority {
  authorityType: "resolved-repository-walkthrough-scene-planning.v1";
  planningId: string;
  request: ScenePlanningRequest;
  authorityHash: string;
  operations: Array<{
    sequence: number;
    operation: string;
    authorityId: string;
  }>;
  failurePolicyId: "repository-walkthrough-scene-planning-failure-policy";
  proofContractId: "repository-walkthrough-scene-planning-proof.v1";
}

export interface ExecutedScenePlanning {
  authority: ResolvedScenePlanningAuthority;
  scenePlan: WalkthroughScenePlan;
  receipt: ScenePlanningReceipt;
  findings: ScenePlanningFinding[];
}

export interface SemanticEdges {
  invokes(edgeId: string, context: unknown): Promise<unknown>;
  projects(edgeId: string, context: unknown): Promise<unknown>;
}
