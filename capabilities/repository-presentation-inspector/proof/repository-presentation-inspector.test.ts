import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import {
  inspectsRepositoryPresentation,
  type RepositoryPresentationInspectionPorts,
  type RepositoryPresentationInspectionRequest
} from "../application/inspects-repository-presentation.js";
import { enforcesInspectionProof } from "./conformance/enforces-inspection-proof.js";
import { enforcesLinearInspectionBodies } from "./conformance/enforces-linear-inspection-bodies.js";

const capabilityRoot = process.cwd();
const fixtureRoot = join(capabilityRoot, "proof", "fixtures");
const sha = `sha256:${"a".repeat(64)}`;

function request(
  fixture: string,
  overrides: Partial<RepositoryPresentationInspectionRequest> = {}
): RepositoryPresentationInspectionRequest {
  return {
    contractType: "repository-presentation-inspection-request.v1",
    requestId: `inspect-${fixture}`,
    source: {
      contractType: "resolved-local-repository-source.v1",
      repositoryId: fixture,
      provider: "local-workspace",
      revision: "revision-01",
      authorizedRoot: join(fixtureRoot, fixture),
      sourceReceiptHash: sha
    },
    profileId: "repository-overview.v1",
    inventoryContractVersion: "repository-presentation-inventory.v1",
    inspectionTimestamp: "2026-07-26T12:00:00.000Z",
    ...overrides
  };
}

test("inventories supported Markdown, Gherkin, semantic JSON, schemas, and TypeScript", async () => {
  const result = await inspectsRepositoryPresentation({
    request: request("minimal-presentable-repository")
  });
  assert.equal(result.disposition, "PRESENTATION_INVENTORY_PRODUCED");
  assert.ok(result.inventory);
  const kinds = new Set(result.inventory.assets.map((asset) => asset.kind));
  for (const kind of [
    "document-section",
    "architecture-diagram",
    "code-example",
    "feature-definition",
    "scenario-definition",
    "semantic-decision",
    "semantic-projection",
    "schema-definition",
    "public-operation",
    "execution-body"
  ]) {
    assert.equal(kinds.has(kind as never), true, kind);
  }
  assert.equal(enforcesInspectionProof(result), true);
});

test("preserves unsupported material as a finding while retaining supported assets", async () => {
  const result = await inspectsRepositoryPresentation({
    request: request("unsupported-artifact-repository")
  });
  assert.equal(result.disposition, "PRESENTATION_INVENTORY_PRODUCED_WITH_FINDINGS");
  assert.ok((result.inventory?.assets.length ?? 0) > 0);
  assert.equal(result.inventory?.summary.unsupportedArtifactCount, 1);
  assert.equal(result.findings[0]?.artifactPath, "archive.bin");
});

test("rejects unresolved source authority before repository reads", async () => {
  let calls = 0;
  const ports: RepositoryPresentationInspectionPorts = {
    listsRepositoryArtifacts: async () => {
      calls += 1;
      return { status: "observed", artifacts: [] };
    },
    readsRepositoryArtifact: async (_root, relativePath) => {
      calls += 1;
      return { status: "observed", relativePath, text: "", contentHash: sha };
    }
  };
  const invalid = request("minimal-presentable-repository");
  invalid.source.revision = "";
  const result = await inspectsRepositoryPresentation({ request: invalid, ports });
  assert.equal(result.disposition, "REJECTED_UNRESOLVED_REPOSITORY_SOURCE");
  assert.equal(result.inventory, null);
  assert.equal(calls, 0);
});

test("repeated inspection produces canonical asset ordering and the same inventory hash", async () => {
  const inspectionRequest = request("deterministic-ordering-repository");
  const first = await inspectsRepositoryPresentation({ request: inspectionRequest });
  const second = await inspectsRepositoryPresentation({ request: inspectionRequest });
  assert.deepEqual(first.inventory?.assets, second.inventory?.assets);
  assert.equal(first.inventory?.inventoryHash, second.inventory?.inventoryHash);
  assert.equal(first.receipt.inspectionAuthorityHash, second.receipt.inspectionAuthorityHash);
});

test("reports no presentable material without treating it as runtime failure", async () => {
  const result = await inspectsRepositoryPresentation({
    request: request("empty-presentable-repository")
  });
  assert.equal(result.disposition, "NO_PRESENTABLE_MATERIAL");
  assert.deepEqual(result.inventory?.assets, []);
  assert.equal(result.inventory?.summary.unsupportedArtifactCount, 1);
});

test("successful result conforms to the published inventory, asset, receipt, and result contracts", async () => {
  const result = await inspectsRepositoryPresentation({
    request: request("minimal-presentable-repository")
  });
  const contracts = join(capabilityRoot, "contracts");
  const assetSchema = JSON.parse(await readFile(join(contracts, "presentation-asset.schema.v1.json"), "utf8"));
  const inventorySchema = JSON.parse(await readFile(join(contracts, "repository-presentation-inventory.schema.v1.json"), "utf8"));
  const receiptSchema = JSON.parse(await readFile(join(contracts, "repository-presentation-inspection-receipt.schema.v1.json"), "utf8"));
  const resultSchema = JSON.parse(await readFile(join(contracts, "result.schema.v1.json"), "utf8"));
  const ajv = new (Ajv2020 as any)({ allErrors: true, strict: false });
  (addFormats as any)(ajv);
  ajv.addSchema(assetSchema);
  ajv.addSchema(inventorySchema);
  ajv.addSchema(receiptSchema);
  const validate = ajv.compile(resultSchema);
  assert.equal(validate(result), true, JSON.stringify(validate.errors));
});

test("public and responsibility bodies remain linear semantic-edge witnesses", async () => {
  const bodies = [
    "application/inspects-repository-presentation.ts",
    "runtime/resolves-repository-presentation-inspection-authority.ts",
    "runtime/executes-resolved-repository-presentation-inspection.ts",
    "runtime/projects-repository-presentation-inspection-result.ts"
  ];
  for (const body of bodies) {
    const source = await readFile(join(capabilityRoot, body), "utf8");
    assert.equal(enforcesLinearInspectionBodies(source), true, body);
  }
});
