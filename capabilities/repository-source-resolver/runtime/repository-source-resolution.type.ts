export type RevisionKind = "branch" | "tag" | "commit";

export interface RepositorySourceRequest {
  contractType: "repository-source-request.v1";
  requestId: string;
  reference: string;
  providerHint?: "github";
  revision?: {
    value: string;
    kindHint: RevisionKind;
  };
  presentationEntrypoint?: string;
  resolutionPolicy: {
    unknownProvider: "reject";
    missingRevision: "reject";
    ambiguousReference: "reject";
    inaccessibleRepository: "reject";
    missingEntrypoint: "use-readme" | "use-repository-root" | "reject";
  };
}

export interface RecognitionAuthority {
  recognizerId: string;
  referenceDialect: string;
  providerId: string;
  host: string;
  pattern: RegExp;
  ownerCapture: number;
  repositoryNameCapture: number;
}

export interface RecognizedRepositoryReference {
  contractType: "recognized-repository-reference.v1";
  recognizerId: string;
  providerId: "github";
  host: "github.com";
  referenceDialect: "github-https";
  owner: string;
  repositoryName: string;
}

export type ObservationStatus = "observed" | "not-found" | "access-denied" | "unreachable";

export interface RepositoryObservation {
  contractType: "observed-repository-source.v1";
  status: ObservationStatus;
  providerStatus: number | null;
  repository?: {
    providerRepositoryId: string;
    owner: string;
    repositoryName: string;
    canonicalSlug: string;
    visibility: "public" | "private";
    defaultBranch: string;
  };
}

export interface RevisionObservation {
  status: ObservationStatus;
  providerStatus: number | null;
  kind?: RevisionKind;
  name?: string | null;
  commit?: string;
}

export interface EntrypointObservation {
  status: ObservationStatus;
  providerStatus: number | null;
  exists: boolean;
  path: string;
}

export interface RepositorySourcePorts {
  observesGithubRepository(reference: RecognizedRepositoryReference): Promise<RepositoryObservation>;
  observesGithubDefaultBranch(input: RevisionPortInput): Promise<RevisionObservation>;
  observesGithubBranch(input: RevisionPortInput): Promise<RevisionObservation>;
  observesGithubTag(input: RevisionPortInput): Promise<RevisionObservation>;
  observesGithubCommit(input: RevisionPortInput): Promise<RevisionObservation>;
  observesGithubEntrypoint(input: EntrypointPortInput): Promise<EntrypointObservation>;
}

export interface RevisionPortInput {
  owner: string;
  repositoryName: string;
  value: string;
}

export interface EntrypointPortInput {
  owner: string;
  repositoryName: string;
  commit: string;
  path: string;
}

export interface RepositorySourceResolutionContext {
  request: RepositorySourceRequest;
  ports?: RepositorySourcePorts;
  recognitionAuthorities?: RecognitionAuthority[];
}

export type ResolutionDisposition =
  | "REPOSITORY_SOURCE_RESOLVED"
  | "REPOSITORY_SOURCE_ALREADY_RESOLVED"
  | "INVALID_SOURCE_REQUEST"
  | "UNSUPPORTED_REFERENCE"
  | "AMBIGUOUS_REFERENCE"
  | "UNSUPPORTED_PROVIDER"
  | "REPOSITORY_NOT_FOUND"
  | "REPOSITORY_ACCESS_DENIED"
  | "PROVIDER_UNREACHABLE"
  | "REVISION_NOT_FOUND"
  | "REVISION_NOT_IMMUTABLE"
  | "PRESENTATION_ENTRYPOINT_NOT_FOUND"
  | "PRESENTATION_ENTRYPOINT_OUTSIDE_REPOSITORY"
  | "SOURCE_RESOLUTION_FAILED";

export interface BlockingFinding {
  findingId: string;
  disposition: "blocking";
}

export interface RepositorySourceResolutionResult {
  contractType: "repository-source-resolution-result.v1";
  disposition: ResolutionDisposition;
  source: Record<string, unknown> | null;
  receipt: Record<string, unknown> | null;
  findings: BlockingFinding[];
}

export interface SemanticEdges {
  invokes(edgeId: string, context: unknown): Promise<unknown>;
  projects(edgeId: string, context: unknown): Promise<unknown>;
}

export interface AuthorityContext {
  resolutionContext: RepositorySourceResolutionContext;
  edges: SemanticEdges;
}

export interface ExecutionContext {
  authority: unknown;
  edges: SemanticEdges;
}

export interface ProjectionContext {
  execution: unknown;
  edges: SemanticEdges;
}
