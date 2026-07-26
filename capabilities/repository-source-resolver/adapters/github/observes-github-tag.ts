import type {
  RevisionObservation,
  RevisionPortInput
} from "../../runtime/repository-source-resolution.type.js";
import { observesGithubJson } from "./github-http.js";

export async function observesGithubTag(
  input: RevisionPortInput,
  fetchImplementation: typeof fetch = fetch
): Promise<RevisionObservation> {
  const reference = await observesGithubJson(
    `/repos/${encodeURIComponent(input.owner)}/${encodeURIComponent(input.repositoryName)}/git/ref/tags/${encodeURIComponent(input.value)}`,
    fetchImplementation
  );
  if (reference.status !== "observed") return reference;

  const target = reference.body.object;
  if (target.type === "commit") {
    return {
      status: "observed",
      providerStatus: reference.providerStatus,
      kind: "tag",
      name: input.value,
      commit: String(target.sha)
    };
  }

  const annotatedTag = await observesGithubJson(
    `/repos/${encodeURIComponent(input.owner)}/${encodeURIComponent(input.repositoryName)}/git/tags/${encodeURIComponent(String(target.sha))}`,
    fetchImplementation
  );
  if (annotatedTag.status !== "observed") return annotatedTag;
  return {
    status: "observed",
    providerStatus: annotatedTag.providerStatus,
    kind: "tag",
    name: input.value,
    commit: String(annotatedTag.body.object.sha)
  };
}
