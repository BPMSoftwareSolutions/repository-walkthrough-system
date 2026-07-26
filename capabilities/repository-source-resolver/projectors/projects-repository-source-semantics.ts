import {
  canonicalHash,
  hasCredentialMaterial,
  isFullCommit
} from "../runtime/semantic-kernel.js";
import type {
  BlockingFinding,
  EntrypointObservation,
  RecognitionAuthority,
  RecognizedRepositoryReference,
  RepositoryObservation,
  RepositorySourcePorts,
  RepositorySourceRequest,
  RepositorySourceResolutionContext,
  RepositorySourceResolutionResult,
  ResolutionDisposition,
  RevisionKind,
  RevisionObservation,
  RevisionPortInput
} from "../runtime/repository-source-resolution.type.js";

const proofAssertions = [
  "submitted-reference-recorded",
  "recognition-authority-recorded",
  "repository-provider-recorded",
  "canonical-repository-identity-recorded",
  "repository-access-observed",
  "requested-revision-preserved",
  "immutable-commit-recorded",
  "presentation-entrypoint-recorded",
  "credential-material-not-recorded",
  "resolved-source-contract-valid",
  "source-authority-hash-recorded",
  "final-disposition-recorded"
];

const portBindings: unique symbol = Symbol("repository-source-port-bindings");

export const githubHttpsRecognitionAuthority: RecognitionAuthority = {
  recognizerId: "recognize-github-https-reference",
  referenceDialect: "github-https",
  providerId: "github",
  host: "github.com",
  pattern: /^https:\/\/github\.com\/([^/?#]+)\/([^/?#]+?)(?:\.git)?\/?$/,
  ownerCapture: 1,
  repositoryNameCapture: 2
};

interface AuthorizedAuthority {
  authorityType: "resolved-repository-source-resolution-authority.v1";
  disposition: "authorized";
  request: RepositorySourceRequest;
  recognizedReference: RecognizedRepositoryReference;
  [portBindings]: RepositorySourcePorts;
  operations: string[];
}

interface RejectedExecution {
  disposition: ResolutionDisposition;
  findings: BlockingFinding[];
}

interface SuccessfulExecution {
  disposition: "REPOSITORY_SOURCE_RESOLVED";
  request: RepositorySourceRequest;
  recognizedReference: RecognizedRepositoryReference;
  repository: NonNullable<RepositoryObservation["repository"]>;
  requestedRevision: {
    value: string | null;
    kindHint: RevisionKind | null;
    disposition: "explicit" | "provider-default";
  };
  resolvedRevision: {
    kind: RevisionKind;
    name: string | null;
    commit: string;
  };
  presentationEntrypoint: {
    kind: "repository-root" | "readme" | "repository-path";
    path: string;
  };
  hashes: {
    requestHash: string;
    observationHash: string;
    authorityHash: string;
  };
}

function rejected(disposition: ResolutionDisposition, findingId: string): RejectedExecution {
  return {
    disposition,
    findings: [{ findingId, disposition: "blocking" }]
  };
}

function requestIsValid(request: RepositorySourceRequest): boolean {
  const revisionIsValid = request?.revision === undefined
    || (
      typeof request.revision.value === "string"
      && request.revision.value.length > 0
      && ["branch", "tag", "commit"].includes(request.revision.kindHint)
    );
  return request?.contractType === "repository-source-request.v1"
    && typeof request.requestId === "string"
    && request.requestId.length > 0
    && typeof request.reference === "string"
    && request.reference.length > 0
    && request.resolutionPolicy?.unknownProvider === "reject"
    && request.resolutionPolicy?.missingRevision === "reject"
    && request.resolutionPolicy?.ambiguousReference === "reject"
    && request.resolutionPolicy?.inaccessibleRepository === "reject"
    && ["use-readme", "use-repository-root", "reject"].includes(request.resolutionPolicy?.missingEntrypoint)
    && revisionIsValid
    && (
      request.presentationEntrypoint === undefined
      || typeof request.presentationEntrypoint === "string"
    );
}

function entrypointIsWithinRepository(path: string | undefined): boolean {
  if (path === undefined || path === "." || path === "") return true;
  const normalized = path.replaceAll("\\", "/");
  return !normalized.startsWith("/")
    && !/^[a-zA-Z]:\//.test(normalized)
    && normalized.split("/").every((segment) => segment !== "..");
}

function recognizeReference(
  request: RepositorySourceRequest,
  authorities: RecognitionAuthority[]
): RecognizedRepositoryReference | RejectedExecution {
  const matches = authorities
    .map((authority) => ({ authority, match: authority.pattern.exec(request.reference) }))
    .filter((candidate) => candidate.match !== null);

  if (matches.length === 0) return rejected("UNSUPPORTED_REFERENCE", "unsupported-reference");
  if (matches.length > 1) return rejected("AMBIGUOUS_REFERENCE", "ambiguous-reference");

  const { authority, match } = matches[0];
  if (authority.providerId !== "github" || authority.host !== "github.com") {
    return rejected("UNSUPPORTED_PROVIDER", "unsupported-provider");
  }
  if (request.providerHint !== undefined && request.providerHint !== authority.providerId) {
    return rejected("UNSUPPORTED_PROVIDER", "unsupported-provider");
  }

  return {
    contractType: "recognized-repository-reference.v1",
    recognizerId: authority.recognizerId,
    providerId: "github",
    host: "github.com",
    referenceDialect: "github-https",
    owner: match![authority.ownerCapture],
    repositoryName: match![authority.repositoryNameCapture]
  };
}

export function resolveRepositorySourceAuthority(
  context: RepositorySourceResolutionContext,
  defaultPorts: RepositorySourcePorts
): AuthorizedAuthority | RejectedExecution {
  if (!requestIsValid(context.request)) {
    return rejected("INVALID_SOURCE_REQUEST", "invalid-source-request");
  }
  if (!entrypointIsWithinRepository(context.request.presentationEntrypoint)) {
    return rejected(
      "PRESENTATION_ENTRYPOINT_OUTSIDE_REPOSITORY",
      "presentation-entrypoint-outside-repository"
    );
  }
  if (
    context.request.revision?.kindHint === "commit"
    && !isFullCommit(context.request.revision.value)
  ) {
    return rejected("REVISION_NOT_IMMUTABLE", "revision-not-immutable");
  }

  const recognition = recognizeReference(
    context.request,
    context.recognitionAuthorities ?? [githubHttpsRecognitionAuthority]
  );
  if ("findings" in recognition) return recognition;

  return {
    authorityType: "resolved-repository-source-resolution-authority.v1",
    disposition: "authorized",
    request: context.request,
    recognizedReference: recognition,
    [portBindings]: context.ports ?? defaultPorts,
    operations: [
      "observe-repository-identity",
      "resolve-repository-access",
      "observe-requested-revision",
      "resolve-immutable-revision",
      "observe-presentation-entrypoint",
      "resolve-presentation-entrypoint",
      "project-resolved-source",
      "project-resolution-receipt"
    ]
  };
}

function repositoryFailure(observation: RepositoryObservation): RejectedExecution | null {
  const dispositions: Partial<Record<RepositoryObservation["status"], [ResolutionDisposition, string]>> = {
    "not-found": ["REPOSITORY_NOT_FOUND", "repository-not-found"],
    "access-denied": ["REPOSITORY_ACCESS_DENIED", "repository-access-denied"],
    unreachable: ["PROVIDER_UNREACHABLE", "provider-unreachable"]
  };
  const failure = dispositions[observation.status];
  if (failure !== undefined) return rejected(failure[0], failure[1]);
  if (observation.repository?.visibility !== "public") {
    return rejected("REPOSITORY_ACCESS_DENIED", "repository-access-denied");
  }
  return null;
}

async function observeRevision(
  authority: AuthorizedAuthority,
  repository: NonNullable<RepositoryObservation["repository"]>
): Promise<RevisionObservation> {
  const requested = authority.request.revision;
  const kind = requested?.kindHint ?? "branch";
  const value = requested?.value ?? repository.defaultBranch;
  const input: RevisionPortInput = {
    owner: repository.owner,
    repositoryName: repository.repositoryName,
    value
  };
  const observers: Record<RevisionKind, (input: RevisionPortInput) => Promise<RevisionObservation>> = {
    branch: requested === undefined
      ? authority[portBindings].observesGithubDefaultBranch.bind(authority[portBindings])
      : authority[portBindings].observesGithubBranch.bind(authority[portBindings]),
    tag: authority[portBindings].observesGithubTag.bind(authority[portBindings]),
    commit: authority[portBindings].observesGithubCommit.bind(authority[portBindings])
  };
  return observers[kind](input);
}

function revisionFailure(observation: RevisionObservation): RejectedExecution | null {
  if (observation.status === "not-found") return rejected("REVISION_NOT_FOUND", "revision-not-found");
  if (observation.status === "access-denied") {
    return rejected("REPOSITORY_ACCESS_DENIED", "repository-access-denied");
  }
  if (observation.status === "unreachable") return rejected("PROVIDER_UNREACHABLE", "provider-unreachable");
  if (!isFullCommit(observation.commit)) {
    return rejected("REVISION_NOT_IMMUTABLE", "revision-not-immutable");
  }
  return null;
}

async function resolveEntrypoint(
  authority: AuthorizedAuthority,
  repository: NonNullable<RepositoryObservation["repository"]>,
  commit: string
): Promise<SuccessfulExecution["presentationEntrypoint"] | RejectedExecution> {
  const requestedPath = authority.request.presentationEntrypoint;
  if (requestedPath === ".") return { kind: "repository-root", path: "." };

  const candidatePath = requestedPath ?? "README.md";
  const observation: EntrypointObservation = await authority[portBindings].observesGithubEntrypoint({
    owner: repository.owner,
    repositoryName: repository.repositoryName,
    commit,
    path: candidatePath
  });

  if (observation.status === "unreachable") return rejected("PROVIDER_UNREACHABLE", "provider-unreachable");
  if (observation.status === "access-denied") {
    return rejected("REPOSITORY_ACCESS_DENIED", "repository-access-denied");
  }
  if (observation.exists) {
    return {
      kind: candidatePath.toLowerCase() === "readme.md" ? "readme" : "repository-path",
      path: candidatePath
    };
  }
  if (requestedPath !== undefined || authority.request.resolutionPolicy.missingEntrypoint === "reject") {
    return rejected("PRESENTATION_ENTRYPOINT_NOT_FOUND", "presentation-entrypoint-not-found");
  }
  if (authority.request.resolutionPolicy.missingEntrypoint === "use-repository-root") {
    return { kind: "repository-root", path: "." };
  }
  return rejected("PRESENTATION_ENTRYPOINT_NOT_FOUND", "presentation-entrypoint-not-found");
}

export async function executeRepositorySourceAuthority(
  authority: AuthorizedAuthority | RejectedExecution
): Promise<SuccessfulExecution | RejectedExecution> {
  if ("findings" in authority) return authority;

  const repositoryObservation = await authority[portBindings].observesGithubRepository(
    authority.recognizedReference
  );
  const repositoryFinding = repositoryFailure(repositoryObservation);
  if (repositoryFinding !== null) return repositoryFinding;
  const repository = repositoryObservation.repository!;

  const revisionObservation = await observeRevision(authority, repository);
  const revisionFinding = revisionFailure(revisionObservation);
  if (revisionFinding !== null) return revisionFinding;
  if (
    authority.request.revision?.kindHint === "commit"
    && authority.request.revision.value.toLowerCase() !== revisionObservation.commit!.toLowerCase()
  ) {
    return rejected("REVISION_NOT_IMMUTABLE", "observed-commit-does-not-match-request");
  }

  const presentationEntrypoint = await resolveEntrypoint(
    authority,
    repository,
    revisionObservation.commit!
  );
  if ("findings" in presentationEntrypoint) return presentationEntrypoint;

  const requestedRevision = {
    value: authority.request.revision?.value ?? null,
    kindHint: authority.request.revision?.kindHint ?? null,
    disposition: authority.request.revision === undefined ? "provider-default" as const : "explicit" as const
  };
  const resolvedRevision = {
    kind: revisionObservation.kind!,
    name: revisionObservation.kind === "commit"
      ? null
      : (authority.request.revision?.value ?? repository.defaultBranch),
    commit: revisionObservation.commit!.toLowerCase()
  };
  const observations = {
    repository: repositoryObservation,
    revision: revisionObservation,
    presentationEntrypoint
  };
  const requestHash = canonicalHash(authority.request);
  const observationHash = canonicalHash(observations);
  const authorityHash = canonicalHash({
    requestHash,
    observationHash,
    recognizedReference: authority.recognizedReference,
    repository,
    resolvedRevision,
    presentationEntrypoint
  });

  return {
    disposition: "REPOSITORY_SOURCE_RESOLVED",
    request: authority.request,
    recognizedReference: authority.recognizedReference,
    repository,
    requestedRevision,
    resolvedRevision,
    presentationEntrypoint,
    hashes: { requestHash, observationHash, authorityHash }
  };
}

export function projectRepositorySourceResult(
  execution: SuccessfulExecution | RejectedExecution
): RepositorySourceResolutionResult {
  if ("findings" in execution) {
    return {
      contractType: "repository-source-resolution-result.v1",
      disposition: execution.disposition,
      source: null,
      receipt: null,
      findings: execution.findings
    };
  }

  const source = {
    contractType: "resolved-repository-source.v1",
    sourceId: `github:${execution.repository.canonicalSlug}@${execution.resolvedRevision.commit}`,
    submittedReference: execution.request.reference,
    provider: {
      providerId: execution.recognizedReference.providerId,
      host: execution.recognizedReference.host,
      referenceDialect: execution.recognizedReference.referenceDialect
    },
    repository: {
      providerRepositoryId: execution.repository.providerRepositoryId,
      owner: execution.repository.owner,
      repositoryName: execution.repository.repositoryName,
      canonicalSlug: execution.repository.canonicalSlug,
      visibility: execution.repository.visibility
    },
    requestedRevision: execution.requestedRevision,
    resolvedRevision: execution.resolvedRevision,
    sourceLocation: {
      kind: "remote",
      canonicalReference: `github:${execution.repository.canonicalSlug}`,
      browseReference: `https://github.com/${execution.repository.canonicalSlug}/tree/${execution.resolvedRevision.commit}`,
      localRoot: null
    },
    access: {
      disposition: "authorized-public",
      authorizationReference: null
    },
    presentationEntrypoint: execution.presentationEntrypoint,
    authority: execution.hashes
  };
  const receipt = {
    contractType: "repository-source-resolution-receipt.v1",
    requestId: execution.request.requestId,
    requestHash: execution.hashes.requestHash,
    recognizedReference: {
      recognizerId: execution.recognizedReference.recognizerId,
      providerId: execution.recognizedReference.providerId,
      referenceKind: "remote-repository"
    },
    repository: {
      canonicalSlug: execution.repository.canonicalSlug,
      providerRepositoryId: execution.repository.providerRepositoryId
    },
    requestedRevision: execution.requestedRevision,
    resolvedRevision: execution.resolvedRevision,
    accessDisposition: "authorized-public",
    presentationEntrypoint: execution.presentationEntrypoint,
    observations: proofAssertions.map((assertionId) => ({
      assertionId,
      disposition: "satisfied"
    })),
    sourceAuthorityHash: execution.hashes.authorityHash,
    idempotency: "same-observations-produce-equivalent-authority",
    disposition: execution.disposition
  };

  if (hasCredentialMaterial({ source, receipt })) {
    return {
      contractType: "repository-source-resolution-result.v1",
      disposition: "SOURCE_RESOLUTION_FAILED",
      source: null,
      receipt: null,
      findings: [{ findingId: "credential-material-exposed", disposition: "blocking" }]
    };
  }

  return {
    contractType: "repository-source-resolution-result.v1",
    disposition: execution.disposition,
    source,
    receipt,
    findings: []
  };
}
