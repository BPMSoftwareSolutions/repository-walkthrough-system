import type { RepositoryPresentationInspectionResult } from "../../runtime/repository-presentation-inspection.type.js";

export function enforcesInspectionProof(result: RepositoryPresentationInspectionResult): boolean {
  if (result.inventory === null) return false;
  const observedPaths = new Set(result.inventory.assets.map((asset) => asset.location.repositoryRelativePath));
  const unsupportedFindings = result.inventory.findings.filter((finding) => finding.kind === "unsupported-artifact");
  return result.receipt.repositoryRevision === result.inventory.repository.revision
    && result.receipt.inspectionAuthorityHash === result.inventory.inspection.authorityHash
    && result.receipt.inventoryHash === result.inventory.inventoryHash
    && result.inventory.assets.every((asset) =>
      observedPaths.has(asset.location.repositoryRelativePath)
      && asset.location.semanticAnchor.length > 0
      && asset.source.contentHash.startsWith("sha256:")
    )
    && unsupportedFindings.length === result.inventory.summary.unsupportedArtifactCount
    && result.receipt.assertions.every((assertion) => assertion.passed);
}
