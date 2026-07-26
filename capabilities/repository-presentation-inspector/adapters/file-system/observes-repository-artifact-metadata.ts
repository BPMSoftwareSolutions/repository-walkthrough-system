import type { ObservedRepositoryArtifact } from "../../runtime/repository-presentation-inspection.type.js";

export function observesRepositoryArtifactMetadata(artifact: ObservedRepositoryArtifact) {
  return {
    artifactId: artifact.artifactId,
    relativePath: artifact.relativePath,
    size: artifact.size,
    readable: artifact.readable,
    symlink: artifact.symlink,
    contentHash: artifact.contentHash
  };
}
