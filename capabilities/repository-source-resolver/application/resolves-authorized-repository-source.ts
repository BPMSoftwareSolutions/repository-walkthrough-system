import { resolvesRepositorySourceAuthority } from "../runtime/resolves-repository-source-authority.js";
import { executesResolvedRepositorySourceResolution } from "../runtime/executes-resolved-repository-source-resolution.js";
import { projectRepositorySourceResolutionResult } from "../runtime/projects-repository-source-resolution-result.js";
import { createsRepositorySourceResolverEdges } from "../runtime/creates-repository-source-resolver-edges.js";
import type {
  RepositorySourceResolutionContext,
  RepositorySourceResolutionResult
} from "../runtime/repository-source-resolution.type.js";

export async function resolvesAuthorizedRepositorySource(
  context: RepositorySourceResolutionContext
): Promise<RepositorySourceResolutionResult> {
  const edges = createsRepositorySourceResolverEdges();
  const authority = await resolvesRepositorySourceAuthority({ resolutionContext: context, edges });
  const execution = await executesResolvedRepositorySourceResolution({ authority, edges });
  return projectRepositorySourceResolutionResult({ execution, edges });
}

export type {
  RecognitionAuthority,
  RepositorySourcePorts,
  RepositorySourceRequest,
  RepositorySourceResolutionContext,
  RepositorySourceResolutionResult
} from "../runtime/repository-source-resolution.type.js";
