import { createsGithubRepositorySourcePorts } from "../adapters/github/creates-github-repository-source-ports.js";
import {
  executeRepositorySourceAuthority,
  projectRepositorySourceResult,
  resolveRepositorySourceAuthority
} from "../projectors/projects-repository-source-semantics.js";
import type {
  RepositorySourceResolutionContext,
  SemanticEdges
} from "./repository-source-resolution.type.js";

export function createsRepositorySourceResolverEdges(): SemanticEdges {
  const defaultPorts = createsGithubRepositorySourcePorts();
  const invocations: Record<string, (context: any) => Promise<unknown>> = {
    "resolve-repository-source-authority": async (context: RepositorySourceResolutionContext) =>
      resolveRepositorySourceAuthority(context, defaultPorts),
    "execute-resolved-repository-source-resolution": async (authority: unknown) =>
      executeRepositorySourceAuthority(authority as never)
  };
  const projections: Record<string, (context: any) => Promise<unknown>> = {
    "project-repository-source-resolution-result": async (execution: unknown) =>
      projectRepositorySourceResult(execution as never)
  };

  return Object.freeze({
    invokes: async (edgeId: string, context: unknown) => invocations[edgeId](context),
    projects: async (edgeId: string, context: unknown) => projections[edgeId](context)
  });
}
