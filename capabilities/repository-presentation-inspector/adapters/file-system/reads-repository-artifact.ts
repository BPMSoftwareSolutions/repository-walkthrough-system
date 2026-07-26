import { createHash } from "node:crypto";
import { readFile, realpath } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";
import type { ArtifactContentObservation } from "../../runtime/repository-presentation-inspection.type.js";

function isWithin(root: string, candidate: string): boolean {
  const relation = relative(root, candidate);
  return relation === "" || (!relation.startsWith(`..${sep}`) && relation !== "..");
}

export async function readsRepositoryArtifact(
  authorizedRoot: string,
  relativePath: string
): Promise<ArtifactContentObservation> {
  try {
    const root = await realpath(resolve(authorizedRoot));
    const candidate = resolve(root, relativePath);
    if (!isWithin(root, candidate)) {
      return { status: "scope-violation", relativePath, text: null, contentHash: null };
    }
    const content = await readFile(candidate);
    return {
      status: "observed",
      relativePath,
      text: content.toString("utf8"),
      contentHash: `sha256:${createHash("sha256").update(content).digest("hex")}`
    };
  } catch {
    return { status: "unreadable", relativePath, text: null, contentHash: null };
  }
}
