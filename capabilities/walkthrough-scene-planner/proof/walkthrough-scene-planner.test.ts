import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import {
  plansRepositoryWalkthroughScenes,
  type ScenePlanningRequest
} from "../application/plans-repository-walkthrough-scenes.js";
import { createsRepositoryWalkthroughScenePlannerEdges } from "../runtime/creates-repository-walkthrough-scene-planner-edges.js";
import { resolvesRepositoryWalkthroughScenePlanningAuthority } from "../runtime/resolves-repository-walkthrough-scene-planning-authority.js";
import { enforcesCollapsedRuntimeBody } from "./conformance/enforces-collapsed-runtime-bodies.js";
import { enforcesScenePlanBoundary } from "./conformance/enforces-scene-plan-boundary.js";

const capabilityRoot = process.cwd();

async function fixture<T>(name: string): Promise<T> {
  return JSON.parse(
    await readFile(join(capabilityRoot, "proof", "fixtures", name), "utf8")
  ) as T;
}

async function request(): Promise<ScenePlanningRequest> {
  return {
    contractType: "scene-planning-request.v1",
    requestId: "plan-file-system-shaper-walkthrough",
    story: await fixture<ScenePlanningRequest["story"]>(
      "valid-file-system-shaper-story.json"
    ),
    presentationInventory: await fixture<ScenePlanningRequest["presentationInventory"]>(
      "valid-file-system-shaper-presentation-inventory.json"
    ),
    planningPolicy: {
      policyId: "complete-required-story-coverage.v1",
      missingPresentationAsset: "reject",
      unsupportedStoryBeat: "reject",
      incompleteCoverage: "reject"
    }
  };
}

test("produces a five-scene File System Shaper plan with complete coverage", async () => {
  const result = await plansRepositoryWalkthroughScenes(await request());
  assert.equal(result.disposition, "SCENE_PLAN_RESOLVED");
  assert.equal(result.plan.scenes.length, 5);
  assert.deepEqual(result.plan.coverage, {
    requiredStoryBeatCount: 5,
    coveredStoryBeatCount: 5,
    uncoveredStoryBeatIds: []
  });
  assert.deepEqual(
    result.plan.scenes.map((scene) => scene.sequence),
    [1, 2, 3, 4, 5]
  );
  assert.equal(result.receipt.disposition, "SCENE_PLAN_PROVEN");
  assert.equal(result.receipt.assertions.length, 13);
  assert.equal(enforcesScenePlanBoundary(result.plan), true);
});

test("projects the declared purpose, subject, intent, and semantic anchor", async () => {
  const result = await plansRepositoryWalkthroughScenes(await request());
  assert.deepEqual(
    result.plan.scenes.map((scene) => ({
      purpose: scene.purpose,
      subject: scene.visualSubject.kind,
      intent: scene.presentationIntent,
      anchor: scene.visualSubject.semanticAnchor
    })),
    [
      {
        purpose: "introduce-capability",
        subject: "document-section",
        intent: "establish",
        anchor: "purpose"
      },
      {
        purpose: "present-architecture",
        subject: "diagram",
        intent: "trace",
        anchor: "architecture"
      },
      {
        purpose: "explain-semantic-authority",
        subject: "semantic-contract",
        intent: "focus",
        anchor: "placements"
      },
      {
        purpose: "show-execution-body",
        subject: "source-fragment",
        intent: "demonstrate",
        anchor: "shapesFileSystem"
      },
      {
        purpose: "show-proof",
        subject: "execution-receipt",
        intent: "verify",
        anchor: "verified-operations"
      }
    ]
  );
});

test("rejects a required story beat with no admitted presentation asset", async () => {
  const input = await request();
  input.story.beats[2].requiredConcepts = ["concept absent from inventory"];
  const result = await plansRepositoryWalkthroughScenes(input);
  assert.equal(result.disposition, "SCENE_PLAN_REJECTED");
  assert.deepEqual(result.plan.coverage.uncoveredStoryBeatIds, [
    "explain-semantic-contract"
  ]);
  assert.ok(result.findings.some((candidate) =>
    candidate.failureCode === "STORY_BEAT_HAS_NO_PRESENTATION_ASSET"
    && candidate.storyBeatId === "explain-semantic-contract"
  ));
  assert.equal(result.receipt.disposition, "SCENE_PLAN_REJECTION_PROVEN");
});

test("may reuse one admitted asset for distinct story purposes", async () => {
  const input = await request();
  input.story.beats = [
    {
      ...input.story.beats[0],
      storyBeatId: "introduce-purpose",
      sequence: 1
    },
    {
      ...input.story.beats[4],
      storyBeatId: "prove-purpose",
      sequence: 2,
      requiredConcepts: ["purpose"],
      continuityGroup: "capability-introduction"
    }
  ];
  const result = await plansRepositoryWalkthroughScenes(input);
  assert.equal(result.disposition, "SCENE_PLAN_RESOLVED");
  assert.equal(result.plan.scenes[0].visualSource.assetId, "readme-title-and-purpose");
  assert.equal(result.plan.scenes[1].visualSource.assetId, "readme-title-and-purpose");
  assert.notEqual(result.plan.scenes[0].purpose, result.plan.scenes[1].purpose);
  assert.equal(
    result.plan.scenes[1].entrance.disposition,
    "retain-source-change-focus"
  );
});

test("same inputs produce equivalent authority, plan, and receipt identities", async () => {
  const input = await request();
  const first = await plansRepositoryWalkthroughScenes(input);
  const second = await plansRepositoryWalkthroughScenes(input);
  assert.equal(first.plan.planHash, second.plan.planHash);
  assert.equal(first.receipt.authorityHash, second.receipt.authorityHash);
  assert.deepEqual(first, second);
});

test("request, plan, receipt, and result conform to published contracts", async () => {
  const input = await request();
  const result = await plansRepositoryWalkthroughScenes(input);
  const contracts = join(capabilityRoot, "contracts");
  const upstreamStory = JSON.parse(await readFile(
    join(capabilityRoot, "..", "walkthrough-story-resolver", "contracts", "walkthrough-story.schema.v1.json"),
    "utf8"
  ));
  const upstreamAsset = JSON.parse(await readFile(
    join(capabilityRoot, "..", "repository-presentation-inspector", "contracts", "presentation-asset.schema.v1.json"),
    "utf8"
  ));
  const upstreamInventory = JSON.parse(await readFile(
    join(capabilityRoot, "..", "repository-presentation-inspector", "contracts", "repository-presentation-inventory.schema.v1.json"),
    "utf8"
  ));
  const schemaNames = [
    "scene-transition.schema.v1.json",
    "walkthrough-scene.schema.v1.json",
    "walkthrough-scene-plan.schema.v1.json",
    "scene-planning-policy.schema.v1.json",
    "scene-planning-receipt.schema.v1.json",
    "scene-planning-request.schema.v1.json",
    "resolved-authority.schema.v1.json",
    "result.schema.v1.json"
  ];
  const schemas = await Promise.all(schemaNames.map(async (name) =>
    JSON.parse(await readFile(join(contracts, name), "utf8"))
  ));
  const ajv = new (Ajv2020 as any)({ allErrors: true, strict: false });
  (addFormats as any)(ajv);
  ajv.addSchema(upstreamStory);
  ajv.addSchema(upstreamAsset);
  ajv.addSchema(upstreamInventory);
  for (const schema of schemas) ajv.addSchema(schema);

  const validateRequest = ajv.getSchema("scene-planning-request.schema.v1.json")!;
  const validateAuthority = ajv.getSchema("resolved-authority.schema.v1.json")!;
  const validateResult = ajv.getSchema("result.schema.v1.json")!;
  const authority = await resolvesRepositoryWalkthroughScenePlanningAuthority({
    request: input,
    edges: createsRepositoryWalkthroughScenePlannerEdges()
  });
  assert.equal(validateRequest(input), true, JSON.stringify(validateRequest.errors));
  assert.equal(validateAuthority(authority), true, JSON.stringify(validateAuthority.errors));
  assert.equal(validateResult(result), true, JSON.stringify(validateResult.errors));
});

test("resolve, execute, project, and public runtime bodies remain collapsed", async () => {
  const bodies = [
    "resolves-repository-walkthrough-scene-planning-authority.ts",
    "executes-resolved-repository-walkthrough-scene-planning.ts",
    "projects-repository-walkthrough-scene-plan.ts",
    "plans-repository-walkthrough-scenes.ts"
  ];
  for (const body of bodies) {
    const source = await readFile(join(capabilityRoot, "runtime", body), "utf8");
    assert.equal(enforcesCollapsedRuntimeBody(source), true, body);
  }
});
