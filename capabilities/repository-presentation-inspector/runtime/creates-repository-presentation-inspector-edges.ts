import { createsFileSystemInspectionPorts } from "../adapters/file-system/creates-file-system-inspection-ports.js";
import {
  executeRepositoryPresentationInspectionAuthority,
  projectRepositoryPresentationInspectionResult,
  resolveRepositoryPresentationInspectionAuthority
} from "../projectors/projects-repository-presentation-semantics.js";
import type {
  RepositoryPresentationInspectionContext,
  RepositoryPresentationInspectionPorts,
  SemanticEdges
} from "./repository-presentation-inspection.type.js";

export function createsRepositoryPresentationInspectorEdges(): SemanticEdges {
  let activePorts: RepositoryPresentationInspectionPorts = createsFileSystemInspectionPorts();
  const invocations: Record<string, (context: any) => Promise<unknown>> = {
    "resolve-repository-presentation-inspection-authority": async (
      context: RepositoryPresentationInspectionContext
    ) => {
      activePorts = context.ports ?? activePorts;
      return resolveRepositoryPresentationInspectionAuthority(context);
    },
    "execute-resolved-repository-presentation-inspection": async (authority: unknown) =>
      executeRepositoryPresentationInspectionAuthority(authority as never, activePorts)
  };
  const projections: Record<string, (context: any) => Promise<unknown>> = {
    "project-repository-presentation-inspection-result": async (execution: unknown) =>
      projectRepositoryPresentationInspectionResult(execution as never)
  };
  return Object.freeze({
    invokes: async (edgeId: string, context: unknown) => invocations[edgeId](context),
    projects: async (edgeId: string, context: unknown) => projections[edgeId](context)
  });
}
