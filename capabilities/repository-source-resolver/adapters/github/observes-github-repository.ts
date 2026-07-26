import type {
  RecognizedRepositoryReference,
  RepositoryObservation
} from "../../runtime/repository-source-resolution.type.js";
import { observesGithubJson } from "./github-http.js";

export async function observesGithubRepository(
  reference: RecognizedRepositoryReference,
  fetchImplementation: typeof fetch = fetch
): Promise<RepositoryObservation> {
  const observation = await observesGithubJson(
    `/repos/${encodeURIComponent(reference.owner)}/${encodeURIComponent(reference.repositoryName)}`,
    fetchImplementation
  );
  if (observation.status !== "observed") {
    return {
      contractType: "observed-repository-source.v1",
      status: observation.status,
      providerStatus: observation.providerStatus
    };
  }
  return {
    contractType: "observed-repository-source.v1",
    status: "observed",
    providerStatus: observation.providerStatus,
    repository: {
      providerRepositoryId: String(observation.body.node_id),
      owner: String(observation.body.owner.login),
      repositoryName: String(observation.body.name),
      canonicalSlug: String(observation.body.full_name),
      visibility: observation.body.private === true ? "private" : "public",
      defaultBranch: String(observation.body.default_branch)
    }
  };
}
