import type {
  EntrypointPortInput,
  RecognizedRepositoryReference,
  RepositorySourcePorts,
  RevisionPortInput
} from "../../runtime/repository-source-resolution.type.js";
import { observesGithubBranch } from "./observes-github-branch.js";
import { observesGithubCommit } from "./observes-github-commit.js";
import { observesGithubDefaultBranch } from "./observes-github-default-branch.js";
import { observesGithubEntrypoint } from "./observes-github-entrypoint.js";
import { observesGithubRepository } from "./observes-github-repository.js";
import { observesGithubTag } from "./observes-github-tag.js";

export function createsGithubRepositorySourcePorts(
  fetchImplementation: typeof fetch = fetch
): RepositorySourcePorts {
  return Object.freeze({
    observesGithubRepository: (input: RecognizedRepositoryReference) =>
      observesGithubRepository(input, fetchImplementation),
    observesGithubDefaultBranch: (input: RevisionPortInput) =>
      observesGithubDefaultBranch(input, fetchImplementation),
    observesGithubBranch: (input: RevisionPortInput) =>
      observesGithubBranch(input, fetchImplementation),
    observesGithubTag: (input: RevisionPortInput) =>
      observesGithubTag(input, fetchImplementation),
    observesGithubCommit: (input: RevisionPortInput) =>
      observesGithubCommit(input, fetchImplementation),
    observesGithubEntrypoint: (input: EntrypointPortInput) =>
      observesGithubEntrypoint(input, fetchImplementation)
  });
}
