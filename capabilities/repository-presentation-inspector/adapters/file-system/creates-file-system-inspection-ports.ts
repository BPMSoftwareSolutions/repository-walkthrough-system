import type { RepositoryPresentationInspectionPorts } from "../../runtime/repository-presentation-inspection.type.js";
import { listsRepositoryArtifacts } from "./lists-repository-artifacts.js";
import { readsRepositoryArtifact } from "./reads-repository-artifact.js";

export function createsFileSystemInspectionPorts(): RepositoryPresentationInspectionPorts {
  return Object.freeze({
    listsRepositoryArtifacts,
    readsRepositoryArtifact
  });
}
