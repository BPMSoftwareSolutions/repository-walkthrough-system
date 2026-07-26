import type {
  RevisionObservation,
  RevisionPortInput
} from "../../runtime/repository-source-resolution.type.js";
import { observesGithubJson } from "./github-http.js";

export async function observesGithubCommit(
  input: RevisionPortInput,
  fetchImplementation: typeof fetch = fetch
): Promise<RevisionObservation> {
  const observation = await observesGithubJson(
    `/repos/${encodeURIComponent(input.owner)}/${encodeURIComponent(input.repositoryName)}/commits/${encodeURIComponent(input.value)}`,
    fetchImplementation
  );
  return observation.status === "observed"
    ? {
        status: "observed",
        providerStatus: observation.providerStatus,
        kind: "commit",
        name: null,
        commit: String(observation.body.sha)
      }
    : observation;
}
