export type ArtifactKind =
  | "readme-document"
  | "markdown-document"
  | "gherkin-feature"
  | "semantic-authority"
  | "json-contract"
  | "json-schema"
  | "source-file"
  | "unsupported-artifact";

export type PresentationKind =
  | "document-section"
  | "architecture-diagram"
  | "code-example"
  | "feature-definition"
  | "scenario-definition"
  | "semantic-decision"
  | "semantic-projection"
  | "semantic-policy"
  | "contract-definition"
  | "schema-definition"
  | "public-operation"
  | "execution-body";

export type InspectionDisposition =
  | "PRESENTATION_INVENTORY_PRODUCED"
  | "PRESENTATION_INVENTORY_PRODUCED_WITH_FINDINGS"
  | "NO_PRESENTABLE_MATERIAL"
  | "REJECTED_UNRESOLVED_REPOSITORY_SOURCE"
  | "REJECTED_UNSUPPORTED_INSPECTION_PROFILE"
  | "BLOCKED_REPOSITORY_UNREADABLE"
  | "BLOCKED_INSPECTION_SCOPE_VIOLATION"
  | "FAILED_UNCLASSIFIED";

export interface ResolvedLocalRepositorySource {
  contractType: "resolved-local-repository-source.v1";
  repositoryId: string;
  provider: "local-workspace";
  revision: string;
  authorizedRoot: string;
  sourceReceiptHash: string;
}

export interface RepositoryPresentationInspectionRequest {
  contractType: "repository-presentation-inspection-request.v1";
  requestId: string;
  source: ResolvedLocalRepositorySource;
  profileId: "repository-overview.v1";
  inventoryContractVersion: "repository-presentation-inventory.v1";
  inspectionTimestamp: string;
}

export interface ObservedRepositoryArtifact {
  contractType: "observed-repository-artifact.v1";
  artifactId: string;
  relativePath: string;
  fileName: string;
  extension: string;
  size: number;
  contentHash: string | null;
  readable: boolean;
  symlink: boolean;
}

export interface ArtifactInventoryObservation {
  status: "observed" | "unreadable" | "scope-violation";
  artifacts: ObservedRepositoryArtifact[];
}

export interface ArtifactContentObservation {
  status: "observed" | "unreadable" | "scope-violation";
  relativePath: string;
  text: string | null;
  contentHash: string | null;
}

export interface RepositoryPresentationInspectionPorts {
  listsRepositoryArtifacts(authorizedRoot: string, ignoredSegments: string[]): Promise<ArtifactInventoryObservation>;
  readsRepositoryArtifact(authorizedRoot: string, relativePath: string): Promise<ArtifactContentObservation>;
}

export interface RepositoryPresentationInspectionContext {
  request: RepositoryPresentationInspectionRequest;
  ports?: RepositoryPresentationInspectionPorts;
}

export interface Finding {
  findingId: string;
  kind: string;
  disposition: "finding" | "blocking";
  artifactPath: string | null;
}

export interface PresentationAsset {
  contractType: "presentation-asset.v1";
  assetId: string;
  artifactId: string;
  kind: PresentationKind;
  title: string;
  location: {
    repositoryRelativePath: string;
    semanticAnchor: string;
  };
  source: {
    artifactKind: ArtifactKind;
    startLine: number;
    endLine: number;
    contentHash: string;
  };
  presentation: {
    presentability: "recommended" | "available" | "supporting" | "excluded" | "unsupported" | "blocked";
    significance: "foundational" | "primary" | "supporting" | "supplemental" | "incidental";
    readiness: "ready" | "ready-with-findings" | "requires-renderer" | "requires-expansion" | "requires-transformation" | "blocked";
    supportedSurfaces: Array<"repository-browser" | "markdown-renderer" | "source-viewer">;
  };
  relationships: {
    parentAssetId: string | null;
    childAssetIds: string[];
    relatedAssetIds: string[];
  };
  findings: Finding[];
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
  inspection: {
    profileId: "repository-overview.v1";
    authorityHash: string;
    startedAt: string;
    completedAt: string;
  };
  summary: {
    observedArtifactCount: number;
    supportedArtifactCount: number;
    presentationAssetCount: number;
    recommendedAssetCount: number;
    unsupportedArtifactCount: number;
    blockedAssetCount: number;
  };
  assets: PresentationAsset[];
  findings: Finding[];
  disposition: Exclude<InspectionDisposition, `REJECTED_${string}` | "FAILED_UNCLASSIFIED">;
  inventoryHash: string;
}

export interface InspectionReceipt {
  receiptType: "repository-presentation-inspection-receipt.v1";
  runId: string;
  repositoryId: string;
  repositoryRevision: string;
  inspectionProfileId: "repository-overview.v1";
  inspectionAuthorityHash: string;
  observedArtifactCount: number;
  presentationAssetCount: number;
  unsupportedArtifactCount: number;
  inventoryHash: string;
  findings: Finding[];
  assertions: Array<{ assertionId: string; passed: true }>;
  disposition: InspectionDisposition;
}

export interface RepositoryPresentationInspectionResult {
  contractType: "repository-presentation-inspection-result.v1";
  disposition: InspectionDisposition;
  inventory: RepositoryPresentationInventory | null;
  receipt: InspectionReceipt;
  findings: Finding[];
}

export interface SemanticEdges {
  invokes(edgeId: string, context: unknown): Promise<unknown>;
  projects(edgeId: string, context: unknown): Promise<unknown>;
}

export interface AuthorityContext {
  inspectionContext: RepositoryPresentationInspectionContext;
  edges: SemanticEdges;
}

export interface ExecutionContext {
  authority: unknown;
  edges: SemanticEdges;
}

export interface ProjectionContext {
  execution: unknown;
  edges: SemanticEdges;
}
