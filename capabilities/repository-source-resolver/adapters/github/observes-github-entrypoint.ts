import type {
  EntrypointObservation,
  EntrypointPortInput
} from "../../runtime/repository-source-resolution.type.js";
import { observesGithubJson } from "./github-http.js";

export async function observesGithubEntrypoint(
  input: EntrypointPortInput,
  fetchImplementation: typeof fetch = fetch
): Promise<EntrypointObservation> {
  const observation = await observesGithubJson(
    `/repos/${encodeURIComponent(input.owner)}/${encodeURIComponent(input.repositoryName)}/contents/${input.path.split("/").map(encodeURIComponent).join("/")}?ref=${encodeURIComponent(input.commit)}`,
    fetchImplementation
  );
  return {
    status: observation.status,
    providerStatus: observation.providerStatus,
    exists: observation.status === "observed",
    path: input.path
  };
}
