import type {
  RevisionObservation,
  RevisionPortInput
} from "../../runtime/repository-source-resolution.type.js";
import { observesGithubBranch } from "./observes-github-branch.js";

export async function observesGithubDefaultBranch(
  input: RevisionPortInput,
  fetchImplementation: typeof fetch = fetch
): Promise<RevisionObservation> {
  return observesGithubBranch(input, fetchImplementation);
}
