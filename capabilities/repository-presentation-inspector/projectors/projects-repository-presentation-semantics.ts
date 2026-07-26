import decisionsCatalog from "../semantic-authority/decisions/decisions.sej.v1.json" with { type: "json" };
import executionModel from "../semantic-authority/execution-models/execution-model.sej.v1.json" with { type: "json" };
import profileAuthority from "../semantic-authority/inspection-profiles/repository-overview.sej.v1.json" with { type: "json" };
import proofRequirements from "../semantic-authority/proof-requirements/proof-requirements.sej.v1.json" with { type: "json" };
import { observesGherkinPresentationUnits } from "../adapters/gherkin/observes-gherkin-presentation-units.js";
import { observesJsonPresentationUnits } from "../adapters/json/observes-json-presentation-units.js";
import { observesMarkdownPresentationUnits } from "../adapters/markdown/observes-markdown-presentation-units.js";
import { observesTypescriptPresentationUnits } from "../adapters/typescript/observes-typescript-presentation-units.js";
import type { ObservedPresentationUnit } from "../runtime/observed-presentation-unit.type.js";
import {
  canonicalHash,
  resolvesDecision,
  type SemanticDecision
} from "../runtime/semantic-kernel.js";
import type {
  ArtifactKind,
  Finding,
  InspectionDisposition,
  InspectionReceipt,
  ObservedRepositoryArtifact,
  PresentationAsset,
  PresentationKind,
  RepositoryPresentationInspectionContext,
  RepositoryPresentationInspectionPorts,
  RepositoryPresentationInspectionResult,
  RepositoryPresentationInventory
} from "../runtime/repository-presentation-inspection.type.js";

const decisions = decisionsCatalog.entries as SemanticDecision[];
const profile = profileAuthority as unknown as InspectionProfile;
const assertions = proofRequirements.requiredAssertions as string[];

interface InspectionProfile {
  profileId: "repository-overview.v1";
  supportedArtifactKinds: ArtifactKind[];
  ignoredPathSegments: string[];
  maximumArtifactSize: number;
  maximumUnitSize: number;
  supportedSurfacesByArtifactKind: Record<ArtifactKind, PresentationAsset["presentation"]["supportedSurfaces"]>;
  canonicalOrdering: {
    groups: string[];
    assetKindGroups: Record<PresentationKind, string>;
    significanceRanks: Record<PresentationAsset["presentation"]["significance"], number>;
  };
}

interface ResolvedAuthority {
  authorityType: "resolved-repository-presentation-inspection.v1";
  inspectionId: string;
  inventoryId: string;
  repository: RepositoryPresentationInventory["repository"];
  authorizedRoot: string;
  profile: InspectionProfile;
  inspectionTimestamp: string;
  operations: unknown[];
  failurePolicyId: "repository-presentation-inspection-failure-policy";
  proofContractId: "repository-presentation-inspection-proof.v1";
  authorityHash: string;
}

interface RejectedAuthority {
  authorityType: "rejected-repository-presentation-inspection.v1";
  inspectionId: string;
  repositoryId: string;
  repositoryRevision: string;
  inspectionTimestamp: string;
  disposition: InspectionDisposition;
  authorityHash: string;
  findings: Finding[];
}

interface ExecutedInspection {
  authority: ResolvedAuthority | RejectedAuthority;
  disposition: InspectionDisposition;
  inventory: RepositoryPresentationInventory | null;
  receipt: InspectionReceipt;
  findings: Finding[];
}

interface ClassifiedArtifact extends ObservedRepositoryArtifact {
  artifactKind: ArtifactKind;
}

function finding(kind: string, artifactPath: string | null, disposition: "finding" | "blocking"): Finding {
  return {
    findingId: `${kind}:${artifactPath ?? "inspection"}`,
    kind,
    disposition,
    artifactPath
  };
}

function rejectedAuthority(
  context: RepositoryPresentationInspectionContext,
  disposition: InspectionDisposition,
  kind: string
): RejectedAuthority {
  const request = context.request as Partial<RepositoryPresentationInspectionContext["request"]>;
  const source = request.source as Partial<RepositoryPresentationInspectionContext["request"]["source"]> | undefined;
  const findingValue = finding(kind, null, "blocking");
  const body = {
    authorityType: "rejected-repository-presentation-inspection.v1" as const,
    inspectionId: request.requestId ?? "unidentified-inspection",
    repositoryId: source?.repositoryId ?? "unresolved-repository",
    repositoryRevision: source?.revision ?? "unresolved-revision",
    inspectionTimestamp: request.inspectionTimestamp ?? "1970-01-01T00:00:00.000Z",
    disposition,
    findings: [findingValue]
  };
  return { ...body, authorityHash: canonicalHash(body) };
}

export function resolveRepositoryPresentationInspectionAuthority(
  context: RepositoryPresentationInspectionContext
): ResolvedAuthority | RejectedAuthority {
  const validation = resolvesDecision(decisions, "validate-inspection-request", context);
  if (validation === "rejected-unsupported-inspection-profile") {
    return rejectedAuthority(
      context,
      "REJECTED_UNSUPPORTED_INSPECTION_PROFILE",
      "unsupported-inspection-profile"
    );
  }
  if (validation !== "accepted-inspection-request") {
    return rejectedAuthority(
      context,
      "REJECTED_UNRESOLVED_REPOSITORY_SOURCE",
      "unresolved-repository-source"
    );
  }

  const body = {
    authorityType: "resolved-repository-presentation-inspection.v1" as const,
    inspectionId: context.request.requestId,
    inventoryId: `inventory-${context.request.source.repositoryId}`,
    repository: {
      repositoryId: context.request.source.repositoryId,
      provider: context.request.source.provider,
      revision: context.request.source.revision,
      sourceReceiptHash: context.request.source.sourceReceiptHash
    },
    authorizedRoot: context.request.source.authorizedRoot,
    profile,
    inspectionTimestamp: context.request.inspectionTimestamp,
    operations: executionModel.operations,
    failurePolicyId: "repository-presentation-inspection-failure-policy" as const,
    proofContractId: "repository-presentation-inspection-proof.v1" as const
  };
  return { ...body, authorityHash: canonicalHash(body) };
}

function classifyArtifact(artifact: ObservedRepositoryArtifact): ClassifiedArtifact {
  const artifactKind = resolvesDecision(decisions, "classify-repository-artifact", { artifact }) as ArtifactKind;
  return { ...artifact, artifactKind };
}

function inspectContent(
  artifact: ClassifiedArtifact,
  text: string,
  adapterId: string
): ObservedPresentationUnit[] {
  const adapters: Record<string, () => ObservedPresentationUnit[]> = {
    "observe-markdown-presentation-units": () => observesMarkdownPresentationUnits(text),
    "observe-gherkin-presentation-units": () => observesGherkinPresentationUnits(text),
    "observe-json-presentation-units": () => observesJsonPresentationUnits(
      text,
      artifact.artifactKind as "semantic-authority" | "json-contract" | "json-schema"
    ),
    "observe-typescript-presentation-units": () => observesTypescriptPresentationUnits(text)
  };
  return adapters[adapterId]();
}

function assetId(artifact: ClassifiedArtifact, unit: ObservedPresentationUnit): string {
  return `asset-${canonicalHash({
    artifactPath: artifact.relativePath,
    semanticIdentity: unit.semanticIdentity,
    startLine: unit.startLine
  }).slice("sha256:".length, "sha256:".length + 16)}`;
}

function projectAsset(
  artifact: ClassifiedArtifact,
  unit: ObservedPresentationUnit,
  kind: PresentationKind
): PresentationAsset {
  const presentability = resolvesDecision(decisions, "resolve-presentation-unit-presentability", {
    artifact,
    unit: { ...unit, kind, hasStableIdentity: unit.semanticIdentity.length > 0 }
  }) as PresentationAsset["presentation"]["presentability"];
  const significance = resolvesDecision(decisions, "resolve-presentation-significance", {
    artifact,
    unit: { ...unit, kind }
  }) as PresentationAsset["presentation"]["significance"];
  const readiness = resolvesDecision(decisions, "resolve-presentation-readiness", {
    artifact,
    unit,
    profile
  }) as PresentationAsset["presentation"]["readiness"];
  return {
    contractType: "presentation-asset.v1",
    assetId: assetId(artifact, unit),
    artifactId: artifact.artifactId,
    kind,
    title: unit.title,
    location: {
      repositoryRelativePath: artifact.relativePath,
      semanticAnchor: unit.semanticIdentity
    },
    source: {
      artifactKind: artifact.artifactKind,
      startLine: unit.startLine,
      endLine: unit.endLine,
      contentHash: artifact.contentHash as string
    },
    presentation: {
      presentability,
      significance,
      readiness,
      supportedSurfaces: profile.supportedSurfacesByArtifactKind[artifact.artifactKind]
    },
    relationships: {
      parentAssetId: null,
      childAssetIds: [],
      relatedAssetIds: []
    },
    findings: []
  };
}

function orderAssets(assets: PresentationAsset[]): PresentationAsset[] {
  return [...assets].sort((left, right) => {
    const leftGroup = profile.canonicalOrdering.groups.indexOf(
      profile.canonicalOrdering.assetKindGroups[left.kind]
    );
    const rightGroup = profile.canonicalOrdering.groups.indexOf(
      profile.canonicalOrdering.assetKindGroups[right.kind]
    );
    return leftGroup - rightGroup
      || profile.canonicalOrdering.significanceRanks[left.presentation.significance]
        - profile.canonicalOrdering.significanceRanks[right.presentation.significance]
      || left.location.repositoryRelativePath.localeCompare(right.location.repositoryRelativePath, "en")
      || left.source.startLine - right.source.startLine
      || left.location.semanticAnchor.localeCompare(right.location.semanticAnchor, "en");
  });
}

function successfulAssertions(): InspectionReceipt["assertions"] {
  return assertions.map((assertionId) => ({ assertionId, passed: true as const }));
}

function receipt(
  authority: ResolvedAuthority,
  disposition: InspectionDisposition,
  inventoryHash: string,
  findings: Finding[],
  observedArtifactCount: number,
  presentationAssetCount: number,
  unsupportedArtifactCount: number
): InspectionReceipt {
  return {
    receiptType: "repository-presentation-inspection-receipt.v1",
    runId: authority.inspectionId,
    repositoryId: authority.repository.repositoryId,
    repositoryRevision: authority.repository.revision,
    inspectionProfileId: authority.profile.profileId,
    inspectionAuthorityHash: authority.authorityHash,
    observedArtifactCount,
    presentationAssetCount,
    unsupportedArtifactCount,
    inventoryHash,
    findings,
    assertions: successfulAssertions(),
    disposition
  };
}

function blockedExecution(
  authority: ResolvedAuthority,
  disposition: "BLOCKED_REPOSITORY_UNREADABLE" | "BLOCKED_INSPECTION_SCOPE_VIOLATION",
  kind: string
): ExecutedInspection {
  const findings = [finding(kind, null, "blocking")];
  const inventoryHash = canonicalHash({ authorityHash: authority.authorityHash, disposition, findings });
  return {
    authority,
    disposition,
    inventory: null,
    receipt: receipt(authority, disposition, inventoryHash, findings, 0, 0, 0),
    findings
  };
}

function rejectedExecution(authority: RejectedAuthority): ExecutedInspection {
  const inventoryHash = canonicalHash({
    authorityHash: authority.authorityHash,
    disposition: authority.disposition,
    findings: authority.findings
  });
  return {
    authority,
    disposition: authority.disposition,
    inventory: null,
    receipt: {
      receiptType: "repository-presentation-inspection-receipt.v1",
      runId: authority.inspectionId,
      repositoryId: authority.repositoryId,
      repositoryRevision: authority.repositoryRevision,
      inspectionProfileId: "repository-overview.v1",
      inspectionAuthorityHash: authority.authorityHash,
      observedArtifactCount: 0,
      presentationAssetCount: 0,
      unsupportedArtifactCount: 0,
      inventoryHash,
      findings: authority.findings,
      assertions: [{ assertionId: "inspection-rejected-before-effects", passed: true }],
      disposition: authority.disposition
    },
    findings: authority.findings
  };
}

export async function executeRepositoryPresentationInspectionAuthority(
  authority: ResolvedAuthority | RejectedAuthority,
  ports: RepositoryPresentationInspectionPorts
): Promise<ExecutedInspection> {
  if (authority.authorityType === "rejected-repository-presentation-inspection.v1") {
    return rejectedExecution(authority);
  }
  const inventoryObservation = await ports.listsRepositoryArtifacts(
    authority.authorizedRoot,
    authority.profile.ignoredPathSegments
  );
  if (inventoryObservation.status === "unreadable") {
    return blockedExecution(authority, "BLOCKED_REPOSITORY_UNREADABLE", "repository-unreadable");
  }
  if (inventoryObservation.status === "scope-violation") {
    return blockedExecution(authority, "BLOCKED_INSPECTION_SCOPE_VIOLATION", "inspection-scope-violation");
  }

  const classified = inventoryObservation.artifacts.map(classifyArtifact);
  const unsupported = classified.filter((artifact) => artifact.artifactKind === "unsupported-artifact");
  const findings = unsupported.map((artifact) =>
    finding("unsupported-artifact", artifact.relativePath, "finding")
  );
  const supported: ClassifiedArtifact[] = [];
  for (const artifact of classified.filter((candidate) => candidate.artifactKind !== "unsupported-artifact")) {
    const eligibility = resolvesDecision(decisions, "resolve-artifact-inspection-eligibility", {
      artifact,
      profile: authority.profile
    });
    if (eligibility === "inspect-supported-artifact") {
      supported.push(artifact);
    } else {
      findings.push(finding(eligibility as string, artifact.relativePath, "finding"));
    }
  }
  const assets: PresentationAsset[] = [];

  for (const artifact of supported) {
    const observation = await ports.readsRepositoryArtifact(authority.authorizedRoot, artifact.relativePath);
    if (observation.status === "scope-violation") {
      return blockedExecution(authority, "BLOCKED_INSPECTION_SCOPE_VIOLATION", "inspection-scope-violation");
    }
    if (observation.status !== "observed" || observation.text === null) {
      findings.push(finding("artifact-unreadable", artifact.relativePath, "finding"));
      continue;
    }
    const adapterId = resolvesDecision(decisions, "dispatch-supported-artifact-inspection", { artifact });
    if (adapterId === null) continue;
    try {
      const units = inspectContent(artifact, observation.text, adapterId);
      for (const unit of units) {
        const kind = resolvesDecision(decisions, "classify-presentation-unit", { unit }) as PresentationKind | null;
        if (kind !== null) assets.push(projectAsset(artifact, unit, kind));
      }
    } catch {
      findings.push(finding("artifact-content-unreadable", artifact.relativePath, "finding"));
    }
  }

  const orderedAssets = orderAssets(assets);
  const summary = {
    observedArtifactCount: classified.length,
    supportedArtifactCount: supported.length,
    presentationAssetCount: orderedAssets.length,
    recommendedAssetCount: orderedAssets.filter((asset) => asset.presentation.presentability === "recommended").length,
    unsupportedArtifactCount: unsupported.length,
    blockedAssetCount: orderedAssets.filter((asset) => asset.presentation.readiness === "blocked").length
  };
  const disposition = resolvesDecision(decisions, "resolve-inspection-disposition", {
    execution: { blockingFailure: null, findingCount: findings.length },
    summary
  }) as RepositoryPresentationInventory["disposition"];
  const inventoryContent = {
    inventoryId: authority.inventoryId,
    repository: authority.repository,
    profileId: authority.profile.profileId,
    authorityHash: authority.authorityHash,
    summary,
    assets: orderedAssets,
    findings,
    disposition
  };
  const inventoryHash = canonicalHash(inventoryContent);
  const inventory: RepositoryPresentationInventory = {
    inventoryType: "repository-presentation-inventory.v1",
    inventoryId: authority.inventoryId,
    repository: authority.repository,
    inspection: {
      profileId: authority.profile.profileId,
      authorityHash: authority.authorityHash,
      startedAt: authority.inspectionTimestamp,
      completedAt: authority.inspectionTimestamp
    },
    summary,
    assets: orderedAssets,
    findings,
    disposition,
    inventoryHash
  };
  return {
    authority,
    disposition,
    inventory,
    receipt: receipt(
      authority,
      disposition,
      inventoryHash,
      findings,
      summary.observedArtifactCount,
      summary.presentationAssetCount,
      summary.unsupportedArtifactCount
    ),
    findings
  };
}

export function projectRepositoryPresentationInspectionResult(
  execution: ExecutedInspection
): RepositoryPresentationInspectionResult {
  return {
    contractType: "repository-presentation-inspection-result.v1",
    disposition: execution.disposition,
    inventory: execution.inventory,
    receipt: execution.receipt,
    findings: execution.findings
  };
}
