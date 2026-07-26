import { resolvesAuthorizedRepositorySource } from "../../application/resolves-authorized-repository-source.js";
import type {
  RepositorySourceRequest,
  RevisionKind
} from "../../runtime/repository-source-resolution.type.js";

function readsOption(args: string[], option: string): string | undefined {
  const index = args.indexOf(option);
  return index === -1 ? undefined : args[index + 1];
}

export function projectsCliRequest(args: string[]): RepositorySourceRequest {
  const reference = args[0] ?? "";
  const revision = readsOption(args, "--revision");
  const revisionKind = readsOption(args, "--revision-kind") as RevisionKind | undefined;
  return {
    contractType: "repository-source-request.v1",
    requestId: readsOption(args, "--request-id") ?? "repository-source-cli",
    reference,
    ...(revision === undefined ? {} : {
      revision: {
        value: revision,
        kindHint: revisionKind ?? "branch"
      }
    }),
    ...(readsOption(args, "--entrypoint") === undefined
      ? {}
      : { presentationEntrypoint: readsOption(args, "--entrypoint") }),
    resolutionPolicy: {
      unknownProvider: "reject",
      missingRevision: "reject",
      ambiguousReference: "reject",
      inaccessibleRepository: "reject",
      missingEntrypoint: "use-repository-root"
    }
  };
}

const exitCodes: Record<string, number> = {
  REPOSITORY_SOURCE_RESOLVED: 0,
  REPOSITORY_SOURCE_ALREADY_RESOLVED: 0,
  INVALID_SOURCE_REQUEST: 2,
  UNSUPPORTED_REFERENCE: 3,
  AMBIGUOUS_REFERENCE: 4,
  UNSUPPORTED_PROVIDER: 5,
  REPOSITORY_NOT_FOUND: 6,
  REPOSITORY_ACCESS_DENIED: 7,
  PROVIDER_UNREACHABLE: 8,
  REVISION_NOT_FOUND: 9,
  REVISION_NOT_IMMUTABLE: 10,
  PRESENTATION_ENTRYPOINT_NOT_FOUND: 11,
  PRESENTATION_ENTRYPOINT_OUTSIDE_REPOSITORY: 12,
  SOURCE_RESOLUTION_FAILED: 1
};

export async function main(args: string[]): Promise<void> {
  const result = await resolvesAuthorizedRepositorySource({
    request: projectsCliRequest(args)
  });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exitCode = exitCodes[result.disposition] ?? 1;
}
