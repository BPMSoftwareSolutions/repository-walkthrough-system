import { createHash } from "node:crypto";
import { lstat, readFile, readdir, realpath } from "node:fs/promises";
import { basename, extname, relative, resolve, sep } from "node:path";
import type {
  ArtifactInventoryObservation,
  ObservedRepositoryArtifact
} from "../../runtime/repository-presentation-inspection.type.js";

function contentHash(content: Buffer): string {
  return `sha256:${createHash("sha256").update(content).digest("hex")}`;
}

function isWithin(root: string, candidate: string): boolean {
  const relation = relative(root, candidate);
  return relation === "" || (!relation.startsWith(`..${sep}`) && relation !== "..");
}

export async function listsRepositoryArtifacts(
  authorizedRoot: string,
  ignoredSegments: string[]
): Promise<ArtifactInventoryObservation> {
  try {
    const root = await realpath(resolve(authorizedRoot));
    const artifacts: ObservedRepositoryArtifact[] = [];
    const pending = [root];

    while (pending.length > 0) {
      const directory = pending.pop() as string;
      const entries = await readdir(directory, { withFileTypes: true });
      for (const entry of entries) {
        if (ignoredSegments.includes(entry.name)) continue;
        const absolutePath = resolve(directory, entry.name);
        if (!isWithin(root, absolutePath)) {
          return { status: "scope-violation", artifacts: [] };
        }
        if (entry.isDirectory()) {
          pending.push(absolutePath);
          continue;
        }
        const repositoryRelativePath = relative(root, absolutePath).split(sep).join("/");
        const metadata = await lstat(absolutePath);
        const symlink = metadata.isSymbolicLink();
        let content: Buffer | null = null;
        try {
          content = symlink ? null : await readFile(absolutePath);
        } catch {
          content = null;
        }
        artifacts.push({
          contractType: "observed-repository-artifact.v1",
          artifactId: `artifact-${createHash("sha256").update(repositoryRelativePath).digest("hex").slice(0, 16)}`,
          relativePath: repositoryRelativePath,
          fileName: basename(repositoryRelativePath),
          extension: extname(repositoryRelativePath).toLowerCase(),
          size: metadata.size,
          contentHash: content === null ? null : contentHash(content),
          readable: content !== null,
          symlink
        });
      }
    }
    artifacts.sort((left, right) => left.relativePath.localeCompare(right.relativePath, "en"));
    return { status: "observed", artifacts };
  } catch {
    return { status: "unreadable", artifacts: [] };
  }
}
