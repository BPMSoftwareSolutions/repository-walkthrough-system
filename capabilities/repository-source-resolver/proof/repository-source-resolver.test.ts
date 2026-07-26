import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import {
  resolvesAuthorizedRepositorySource,
  type RecognitionAuthority,
  type RepositorySourcePorts,
  type RepositorySourceRequest
} from "../application/resolves-authorized-repository-source.js";
import { enforcesImmutableRevisionOutput } from "./conformance/enforces-immutable-revision-output.js";
import { enforcesLinearCapabilityBodies } from "./conformance/enforces-linear-capability-bodies.js";
import { enforcesNoCredentialTestimony } from "./conformance/enforces-no-credential-testimony.js";
import { enforcesSourceContractCompleteness } from "./conformance/enforces-source-contract-completeness.js";

const commit = "8f4d31c5c3dd4f6c127d6d41a8de65477d5037e1";
const capabilityRoot = process.cwd();

function request(overrides: Partial<RepositorySourceRequest> = {}): RepositorySourceRequest {
  return {
    contractType: "repository-source-request.v1",
    requestId: "resolve-source-01",
    reference: "https://github.com/deterministic-solutions/file-system-shaper",
    resolutionPolicy: {
      unknownProvider: "reject",
      missingRevision: "reject",
      ambiguousReference: "reject",
      inaccessibleRepository: "reject",
      missingEntrypoint: "use-repository-root"
    },
    ...overrides
  };
}

function ports(
  overrides: Partial<RepositorySourcePorts> = {},
  calls: string[] = []
): RepositorySourcePorts {
  const revision = (kind: "branch" | "tag" | "commit", name: string | null) => async () => {
    calls.push(kind);
    return { status: "observed" as const, providerStatus: 200, kind, name, commit };
  };
  return {
    observesGithubRepository: async () => {
      calls.push("repository");
      return {
        contractType: "observed-repository-source.v1",
        status: "observed",
        providerStatus: 200,
        repository: {
          providerRepositoryId: "R_kgDOExample",
          owner: "deterministic-solutions",
          repositoryName: "file-system-shaper",
          canonicalSlug: "deterministic-solutions/file-system-shaper",
          visibility: "public",
          defaultBranch: "main"
        }
      };
    },
    observesGithubDefaultBranch: revision("branch", "main"),
    observesGithubBranch: revision("branch", "feature/docs"),
    observesGithubTag: revision("tag", "v1.0.0"),
    observesGithubCommit: revision("commit", null),
    observesGithubEntrypoint: async (input) => {
      calls.push("entrypoint");
      return {
        status: "observed",
        providerStatus: 200,
        exists: true,
        path: input.path
      };
    },
    ...overrides
  };
}

test("resolves a public GitHub repository default branch to an immutable source", async () => {
  const result = await resolvesAuthorizedRepositorySource({ request: request(), ports: ports() });
  assert.equal(result.disposition, "REPOSITORY_SOURCE_RESOLVED");
  assert.equal(result.source?.sourceId, `github:deterministic-solutions/file-system-shaper@${commit}`);
  assert.equal((result.source?.resolvedRevision as any).kind, "branch");
  assert.equal((result.receipt?.observations as unknown[]).length, 12);
});

test("preserves explicit branch testimony without fallback", async () => {
  const result = await resolvesAuthorizedRepositorySource({
    request: request({ revision: { value: "feature/docs", kindHint: "branch" } }),
    ports: ports()
  });
  assert.deepEqual(result.source?.requestedRevision, {
    value: "feature/docs",
    kindHint: "branch",
    disposition: "explicit"
  });
  assert.equal((result.source?.resolvedRevision as any).commit, commit);
});

test("resolves an explicit tag to its target commit", async () => {
  const result = await resolvesAuthorizedRepositorySource({
    request: request({ revision: { value: "v1.0.0", kindHint: "tag" } }),
    ports: ports()
  });
  assert.equal((result.source?.resolvedRevision as any).kind, "tag");
  assert.equal((result.source?.resolvedRevision as any).commit, commit);
});

test("preserves an explicit full commit", async () => {
  const result = await resolvesAuthorizedRepositorySource({
    request: request({ revision: { value: commit, kindHint: "commit" } }),
    ports: ports()
  });
  assert.equal((result.source?.resolvedRevision as any).kind, "commit");
  assert.equal((result.source?.resolvedRevision as any).commit, commit);
});

test("rejects a non-immutable commit request before provider observation", async () => {
  const calls: string[] = [];
  const result = await resolvesAuthorizedRepositorySource({
    request: request({ revision: { value: "8f4d31c", kindHint: "commit" } }),
    ports: ports({}, calls)
  });
  assert.equal(result.disposition, "REVISION_NOT_IMMUTABLE");
  assert.deepEqual(calls, []);
});

test("rejects provider testimony that does not preserve the explicit commit identity", async () => {
  const differentCommit = "7f4d31c5c3dd4f6c127d6d41a8de65477d5037e2";
  const result = await resolvesAuthorizedRepositorySource({
    request: request({ revision: { value: commit, kindHint: "commit" } }),
    ports: ports({
      observesGithubCommit: async () => ({
        status: "observed",
        providerStatus: 200,
        kind: "commit",
        name: null,
        commit: differentCommit
      })
    })
  });
  assert.equal(result.disposition, "REVISION_NOT_IMMUTABLE");
  assert.equal(result.source, null);
});

test("rejects an unsupported reference before any provider operation", async () => {
  const calls: string[] = [];
  const result = await resolvesAuthorizedRepositorySource({
    request: request({ reference: "ssh://example.test/org/repo" }),
    ports: ports({}, calls)
  });
  assert.equal(result.disposition, "UNSUPPORTED_REFERENCE");
  assert.deepEqual(calls, []);
});

test("rejects ambiguous recognition before any provider operation", async () => {
  const calls: string[] = [];
  const authority: RecognitionAuthority = {
    recognizerId: "duplicate-authority",
    referenceDialect: "github-https",
    providerId: "github",
    host: "github.com",
    pattern: /^https:\/\/github\.com\/([^/]+)\/([^/]+)$/,
    ownerCapture: 1,
    repositoryNameCapture: 2
  };
  const result = await resolvesAuthorizedRepositorySource({
    request: request(),
    ports: ports({}, calls),
    recognitionAuthorities: [authority, { ...authority, recognizerId: "duplicate-authority-2" }]
  });
  assert.equal(result.disposition, "AMBIGUOUS_REFERENCE");
  assert.deepEqual(calls, []);
});

test("rejects a missing revision without selecting a fallback", async () => {
  const calls: string[] = [];
  const result = await resolvesAuthorizedRepositorySource({
    request: request({ revision: { value: "missing", kindHint: "tag" } }),
    ports: ports({
      observesGithubTag: async () => {
        calls.push("tag");
        return { status: "not-found", providerStatus: 404 };
      }
    }, calls)
  });
  assert.equal(result.disposition, "REVISION_NOT_FOUND");
  assert.deepEqual(calls, ["repository", "tag"]);
});

test("rejects inaccessible repository metadata", async () => {
  const result = await resolvesAuthorizedRepositorySource({
    request: request(),
    ports: ports({
      observesGithubRepository: async () => ({
        contractType: "observed-repository-source.v1",
        status: "access-denied",
        providerStatus: 403
      })
    })
  });
  assert.equal(result.disposition, "REPOSITORY_ACCESS_DENIED");
  assert.equal(result.source, null);
});

test("rejects repository traversal before any provider operation", async () => {
  const calls: string[] = [];
  const result = await resolvesAuthorizedRepositorySource({
    request: request({ presentationEntrypoint: "../README.md" }),
    ports: ports({}, calls)
  });
  assert.equal(result.disposition, "PRESENTATION_ENTRYPOINT_OUTSIDE_REPOSITORY");
  assert.deepEqual(calls, []);
});

test("uses repository root only when the declared missing-entrypoint policy authorizes it", async () => {
  const result = await resolvesAuthorizedRepositorySource({
    request: request(),
    ports: ports({
      observesGithubEntrypoint: async (input) => ({
        status: "not-found",
        providerStatus: 404,
        exists: false,
        path: input.path
      })
    })
  });
  assert.deepEqual(result.source?.presentationEntrypoint, { kind: "repository-root", path: "." });
});

test("same request and observations produce equivalent immutable authority", async () => {
  const first = await resolvesAuthorizedRepositorySource({ request: request(), ports: ports() });
  const second = await resolvesAuthorizedRepositorySource({ request: request(), ports: ports() });
  assert.equal(
    (first.source?.authority as any).authorityHash,
    (second.source?.authority as any).authorityHash
  );
  assert.equal(first.source?.sourceId, second.source?.sourceId);
});

test("successful result, source, and receipt conform to published JSON contracts", async () => {
  const result = await resolvesAuthorizedRepositorySource({ request: request(), ports: ports() });
  const contracts = join(capabilityRoot, "contracts");
  const sourceSchema = JSON.parse(await readFile(join(contracts, "resolved-repository-source.schema.v1.json"), "utf8"));
  const receiptSchema = JSON.parse(await readFile(join(contracts, "repository-source-resolution-receipt.schema.v1.json"), "utf8"));
  const resultSchema = JSON.parse(await readFile(join(contracts, "repository-source-resolution-result.schema.v1.json"), "utf8"));
  const ajv = new (Ajv2020 as any)({ allErrors: true, strict: false });
  (addFormats as any)(ajv);
  ajv.addSchema(sourceSchema);
  ajv.addSchema(receiptSchema);
  const validate = ajv.compile(resultSchema);
  assert.equal(validate(result), true, JSON.stringify(validate.errors));
});

test("receipt and source contain no credential values", async () => {
  const result = await resolvesAuthorizedRepositorySource({ request: request(), ports: ports() });
  const testimony = JSON.stringify({ source: result.source, receipt: result.receipt });
  assert.doesNotMatch(testimony, /bearer\s+|github_pat_|gh[oprsu]_/i);
});

test("executable proof checks validate output and collapsed capability bodies", async () => {
  const result = await resolvesAuthorizedRepositorySource({ request: request(), ports: ports() });
  assert.equal(enforcesImmutableRevisionOutput(result), true);
  assert.equal(enforcesNoCredentialTestimony(result), true);
  assert.equal(enforcesSourceContractCompleteness(result), true);

  const bodies = [
    "application/resolves-authorized-repository-source.ts",
    "runtime/resolves-repository-source-authority.ts",
    "runtime/executes-resolved-repository-source-resolution.ts",
    "runtime/projects-repository-source-resolution-result.ts"
  ];
  for (const body of bodies) {
    const source = await readFile(join(capabilityRoot, body), "utf8");
    assert.equal(enforcesLinearCapabilityBodies(source), true, body);
  }
});
