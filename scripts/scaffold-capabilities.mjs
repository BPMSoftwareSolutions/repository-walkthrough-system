import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const capabilities = [
  {
    id: "repository-source-resolver",
    title: "Repository Source Resolver",
    outcome: "Produce one immutable, authorized repository source.",
    truth: "repository identity and revision",
    vocabulary: ["repository reference", "repository provider", "repository identity", "revision", "branch", "tag", "commit", "presentation entrypoint", "authorization", "source disposition"],
    exclusions: ["scene", "narration", "scroll", "browser", "recording", "frame", "video"],
    intentFile: "resolve-an-authorized-repository-source.intent-ir.v1.json",
    featureFile: "resolve-an-authorized-repository-source.feature",
    trigger: "a repository reference and revision constraint are submitted",
    desiredOutcome: "one immutable and authorized repository source is resolved",
    semanticResponsibilities: ["recognize-repository-reference", "resolve-repository-provider", "resolve-repository-revision", "resolve-presentation-entrypoint", "project-resolved-repository-source"],
    contracts: ["repository-source-request.schema.v1.json", "observed-repository-reference.schema.v1.json", "resolved-repository-source.schema.v1.json", "repository-source-resolution-receipt.schema.v1.json"],
    publicContract: "resolved-repository-source.schema.v1.json",
    dependencies: []
  },
  {
    id: "repository-presentation-inspector",
    title: "Repository Presentation Inspector",
    outcome: "Produce an inventory of presentable repository material.",
    truth: "presentable repository material",
    vocabulary: ["presentation asset", "document", "section", "heading", "diagram", "source example", "feature example", "contract example", "proof example", "presentability", "repository presentation inventory"],
    exclusions: ["story beat", "scroll path", "recording profile", "video codec"],
    intentFile: "inventory-presentable-repository-material.intent-ir.v1.json",
    featureFile: "inventory-presentable-repository-material.feature",
    trigger: "an immutable repository source is submitted for inspection",
    desiredOutcome: "presentable repository assets are inventoried without deciding their story",
    semanticResponsibilities: ["classify-repository-artifact", "classify-document-section", "resolve-presentability", "resolve-presentation-significance", "iterate-repository-artifacts", "project-repository-presentation-inventory"],
    contracts: ["repository-inspection-request.schema.v1.json", "observed-repository-artifact.schema.v1.json", "presentation-asset.schema.v1.json", "repository-presentation-inventory.schema.v1.json", "repository-presentation-inspection-receipt.schema.v1.json"],
    publicContract: "repository-presentation-inventory.schema.v1.json",
    dependencies: ["repository-source-resolver"]
  },
  {
    id: "walkthrough-story-resolver",
    title: "Walkthrough Story Resolver",
    outcome: "Produce the semantic story the walkthrough intends to communicate.",
    truth: "educational narrative",
    vocabulary: ["audience", "learning objective", "story", "story beat", "concept", "explanation", "introduction", "demonstration", "evidence", "conclusion", "narrative order", "presentation emphasis"],
    exclusions: ["CSS selector", "DOM element", "browser viewport", "FFmpeg", "WebM", "Playwright"],
    intentFile: "resolve-a-repository-walkthrough-story.intent-ir.v1.json",
    featureFile: "resolve-a-repository-walkthrough-story.feature",
    trigger: "a presentation inventory and learning intent are submitted",
    desiredOutcome: "an audience-appropriate ordered walkthrough story is resolved",
    semanticResponsibilities: ["resolve-audience-profile", "resolve-learning-objective", "select-presentation-assets", "resolve-story-beats", "order-story-beats", "resolve-presentation-emphasis", "project-walkthrough-story"],
    contracts: ["walkthrough-story-request.schema.v1.json", "audience-profile.schema.v1.json", "learning-objective.schema.v1.json", "story-beat.schema.v1.json", "walkthrough-story.schema.v1.json", "walkthrough-story-resolution-receipt.schema.v1.json"],
    publicContract: "walkthrough-story.schema.v1.json",
    dependencies: ["repository-presentation-inspector"]
  },
  {
    id: "walkthrough-scene-planner",
    title: "Walkthrough Scene Planner",
    outcome: "Produce an ordered scene model from a resolved story.",
    truth: "visual story",
    vocabulary: ["scene", "visual source", "visual subject", "scene purpose", "entrance", "presentation state", "focus target", "exit", "scene sequence", "scene transition"],
    exclusions: ["Playwright", "CSS selector", "physical scrolling", "video codec"],
    intentFile: "project-a-walkthrough-story-into-scenes.intent-ir.v1.json",
    featureFile: "project-a-walkthrough-story-into-scenes.feature",
    trigger: "a resolved walkthrough story is submitted",
    desiredOutcome: "semantic story beats are projected into ordered visual scenes",
    semanticResponsibilities: ["resolve-scene-kind", "select-scene-source", "resolve-scene-focus", "resolve-scene-transition", "order-walkthrough-scenes", "project-walkthrough-scene-plan"],
    contracts: ["scene-planning-request.schema.v1.json", "walkthrough-scene.schema.v1.json", "walkthrough-scene-plan.schema.v1.json", "scene-planning-receipt.schema.v1.json"],
    publicContract: "walkthrough-scene-plan.schema.v1.json",
    dependencies: ["walkthrough-story-resolver"]
  },
  {
    id: "browser-presentation-resolver",
    title: "Browser Presentation Resolver",
    outcome: "Produce an executable browser presentation plan.",
    truth: "browser presentation authority",
    vocabulary: ["browser presentation", "navigation", "viewport", "scroll path", "focus action", "presentation action", "page target", "target locator", "settling condition", "browser state"],
    exclusions: ["educational emphasis", "recording codec", "scene proof disposition"],
    intentFile: "resolve-browser-presentation-authority.intent-ir.v1.json",
    featureFile: "resolve-browser-presentation-authority.feature",
    trigger: "an ordered walkthrough scene plan is submitted",
    desiredOutcome: "each semantic scene is resolved into complete ordered browser execution authority",
    semanticResponsibilities: ["resolve-presentation-surface", "resolve-navigation-operation", "resolve-visual-target", "resolve-viewport-profile", "resolve-scroll-path", "resolve-focus-action", "resolve-settling-condition", "order-browser-presentation-operations", "project-resolved-browser-presentation"],
    contracts: ["browser-presentation-request.schema.v1.json", "browser-presentation-operation.schema.v1.json", "browser-scene-execution-plan.schema.v1.json", "resolved-browser-walkthrough.schema.v1.json", "browser-presentation-resolution-receipt.schema.v1.json"],
    publicContract: "resolved-browser-walkthrough.schema.v1.json",
    dependencies: ["walkthrough-scene-planner"]
  },
  {
    id: "browser-walkthrough-executor",
    title: "Browser Walkthrough Executor",
    outcome: "Mechanically execute a resolved browser plan and emit testimony.",
    truth: "browser execution testimony",
    vocabulary: ["browser session", "browser operation", "page", "element", "navigation result", "scroll result", "focus result", "observed browser failure", "execution disposition"],
    exclusions: ["learning objective", "story beat", "presentation emphasis", "recording proof"],
    intentFile: "execute-a-resolved-browser-walkthrough.intent-ir.v1.json",
    featureFile: "execute-a-resolved-browser-walkthrough.feature",
    trigger: "a resolved browser walkthrough is submitted",
    desiredOutcome: "authorized browser operations are executed in order and mechanical testimony is recorded",
    semanticResponsibilities: ["dispatch-browser-operation", "classify-browser-operation-result", "classify-browser-operation-failure", "execute-browser-operation-sequence", "project-browser-execution-testimony"],
    contracts: ["browser-execution-request.schema.v1.json", "browser-operation-result.schema.v1.json", "browser-execution-testimony.schema.v1.json", "browser-execution-receipt.schema.v1.json"],
    publicContract: "browser-execution-testimony.schema.v1.json",
    dependencies: ["browser-presentation-resolver"]
  },
  {
    id: "screen-recording-controller",
    title: "Screen Recording Controller",
    outcome: "Capture an authorized visual session as an inspectable recording artifact.",
    truth: "captured-media testimony",
    vocabulary: ["recording session", "capture source", "capture region", "frame", "frame rate", "resolution", "recording stream", "container", "codec", "recording artifact", "recording integrity"],
    exclusions: ["GitHub", "README", "scene meaning", "repository", "architecture explanation"],
    intentFile: "capture-an-authorized-visual-session.intent-ir.v1.json",
    featureFile: "capture-an-authorized-visual-session.feature",
    trigger: "an authorized visual session and recording profile are submitted",
    desiredOutcome: "the declared visual source is captured into a readable recording artifact",
    semanticResponsibilities: ["resolve-capture-source", "resolve-recording-profile", "resolve-recording-container", "resolve-recording-lifecycle", "classify-recording-result", "project-recording-artifact"],
    contracts: ["recording-session-request.schema.v1.json", "resolved-recording-profile.schema.v1.json", "recording-artifact.schema.v1.json", "recording-session-receipt.schema.v1.json"],
    publicContract: "recording-artifact.schema.v1.json",
    dependencies: []
  },
  {
    id: "walkthrough-scene-observer",
    title: "Walkthrough Scene Observer",
    outcome: "Record whether each declared scene visibly occurred.",
    truth: "visual observation testimony",
    vocabulary: ["expected scene", "observed scene", "visual assertion", "visibility", "position", "stability", "scene start", "scene completion", "scene observation", "scene conformance"],
    exclusions: ["story generation", "browser navigation authority", "capture codec", "walkthrough proof disposition"],
    intentFile: "observe-walkthrough-scene-execution.intent-ir.v1.json",
    featureFile: "observe-walkthrough-scene-execution.feature",
    trigger: "an expected scene and observable presentation state are submitted",
    desiredOutcome: "facts establish whether the expected visual scene visibly conformed",
    semanticResponsibilities: ["resolve-scene-observation-requirements", "evaluate-visual-target-visibility", "evaluate-browser-state", "evaluate-scene-settlement", "classify-scene-observation", "project-scene-observation-testimony"],
    contracts: ["scene-observation-request.schema.v1.json", "visual-observation.schema.v1.json", "scene-observation-testimony.schema.v1.json", "scene-observation-receipt.schema.v1.json"],
    publicContract: "scene-observation-testimony.schema.v1.json",
    dependencies: ["walkthrough-scene-planner", "browser-walkthrough-executor"]
  },
  {
    id: "recording-proof-builder",
    title: "Recording Proof Builder",
    outcome: "Evaluate evidence and produce truthful recording proof.",
    truth: "recording conformance",
    vocabulary: ["proof requirement", "recording evidence", "scene evidence", "artifact evidence", "conformance", "finding", "proof disposition", "proven walkthrough", "rejected walkthrough", "incomplete walkthrough"],
    exclusions: ["browser navigation", "capture execution", "story generation", "scene replay"],
    intentFile: "establish-proof-of-a-recorded-walkthrough.intent-ir.v1.json",
    featureFile: "establish-proof-of-a-recorded-walkthrough.feature",
    trigger: "recording artifact evidence and declared scene evidence are submitted",
    desiredOutcome: "a proven, rejected, or incomplete recording disposition is established from evidence",
    semanticResponsibilities: ["resolve-recording-proof-requirements", "evaluate-scene-evidence-coverage", "evaluate-recording-artifact-integrity", "evaluate-walkthrough-conformance", "classify-recording-proof-disposition", "project-recording-proof"],
    contracts: ["recording-proof-request.schema.v1.json", "recording-proof-finding.schema.v1.json", "repository-walkthrough-proof.schema.v1.json", "recording-proof-receipt.schema.v1.json"],
    publicContract: "repository-walkthrough-proof.schema.v1.json",
    dependencies: ["screen-recording-controller", "walkthrough-scene-observer"]
  },
  {
    id: "repository-walkthrough-harness",
    title: "Repository Walkthrough Harness",
    outcome: "Compose the capability constellation through public contracts.",
    truth: "capability composition",
    vocabulary: ["walkthrough request", "capability invocation", "capability result", "execution context", "composition", "walkthrough outcome"],
    exclusions: ["README parsing", "story beat construction", "CSS selector", "scroll speed", "Playwright launch", "FFmpeg launch", "video metadata interpretation"],
    intentFile: "obtain-a-proven-repository-walkthrough.intent-ir.v1.json",
    featureFile: "obtain-a-proven-repository-walkthrough.feature",
    trigger: "a complete repository walkthrough request is submitted",
    desiredOutcome: "capability providers are composed and a proven or rejected walkthrough outcome is returned",
    semanticResponsibilities: ["resolve-walkthrough-capability-composition", "resolve-walkthrough-execution-order", "resolve-blocking-capability-disposition", "project-repository-walkthrough-outcome"],
    contracts: ["obtain-repository-walkthrough-request.schema.v1.json", "repository-walkthrough-execution-context.schema.v1.json", "repository-walkthrough-capability-result.schema.v1.json", "proven-repository-walkthrough.schema.v1.json"],
    publicContract: "proven-repository-walkthrough.schema.v1.json",
    dependencies: ["repository-source-resolver", "repository-presentation-inspector", "walkthrough-story-resolver", "walkthrough-scene-planner", "browser-presentation-resolver", "browser-walkthrough-executor", "screen-recording-controller", "walkthrough-scene-observer", "recording-proof-builder"]
  }
];

async function writeMissing(relativePath, content) {
  const target = join(repositoryRoot, relativePath);
  await mkdir(dirname(target), { recursive: true });
  try {
    await readFile(target);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await writeFile(target, content.endsWith("\n") ? content : `${content}\n`, "utf8");
  }
}

async function writeJson(relativePath, value) {
  await writeMissing(relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

function semanticId(value) {
  return value.replace(/\.schema\.v1\.json$/, ".v1");
}

function titleFromFile(file) {
  return file
    .replace(/\.schema\.v1\.json$/, "")
    .split("-")
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

for (const capability of capabilities) {
  const base = `capabilities/${capability.id}`;
  const constraints = [
    `canonical meaning is limited to ${capability.truth}`,
    "all capability-specific decisions are declared in semantic authority",
    "runtime bodies execute resolved authority without authored domain decisions",
    "effects occur only through declared ports and produce proof receipts"
  ];

  await writeJson(`${base}/package.json`, {
    name: `@repository-walkthrough/${capability.id}`,
    version: "0.0.0",
    private: true,
    description: capability.outcome,
    type: "module"
  });

  await writeMissing(`${base}/README.md`, `# ${capability.title}

## Owned outcome

${capability.outcome}

## Published contract

\`contracts/${capability.publicContract}\`

## Domain language

${capability.vocabulary.map((term) => `- ${term}`).join("\n")}

## Semantic exclusions

${capability.exclusions.map((term) => `- ${term}`).join("\n")}

## Dependencies

${capability.dependencies.length ? capability.dependencies.map((id) => `- \`${id}\` through its published contract`).join("\n") : "- None"}

## Maturity

Scaffold only. Expand scenarios, semantic declarations, schemas, execution,
and proof before promotion.
`);

  await writeMissing(`${base}/AGENTS.md`, `# ${capability.title} Agent Contract

Own only: ${capability.truth}.

Allowed vocabulary: ${capability.vocabulary.join(", ")}.

Boundary-warning vocabulary: ${capability.exclusions.join(", ")}.

Do not import another capability's runtime, adapters, semantic authority, or
proof fixtures. Consume only published contracts. Update the feature and
semantic authority before implementing behavior. Runtime bodies must remain
collapsed; adapters own irreducible mechanics only.

Before handoff, run \`npm test\` at the repository root and report which
promotion gates remain.
`);

  await writeJson(`${base}/intent/${capability.intentFile}`, {
    $schema: "../../../contracts/intent-ir.schema.v1.json",
    capabilityId: capability.id,
    title: capability.title,
    purpose: capability.outcome,
    actor: "authorized-caller",
    trigger: capability.trigger,
    desiredOutcome: capability.desiredOutcome,
    constraints,
    featureIds: [capability.featureFile.replace(/\.feature$/, "")],
    status: "scaffold"
  });

  await writeMissing(`${base}/features/${capability.featureFile}`, `Feature: ${capability.title}

  Scenario: Produce the owned outcome from authorized input
    Given an authorized ${capability.title.toLowerCase()} request
    And the required observed facts are available
    When the capability resolves and executes its authority
    Then ${capability.desiredOutcome}
    And a conformance receipt is produced

  Scenario: Reject unresolved authority before effects
    Given a request that cannot be completely authorized
    When the capability resolves its authority
    Then no external effect occurs
    And the blocking finding is recorded
`);

  await writeMissing(`${base}/architecture/${capability.id}.ascii.md`, `# ${capability.title}

\`\`\`text
authorized request
      |
      v
observe facts
      |
      v
resolve semantic authority
      |
      v
execute resolved mechanics
      |
      v
project ${capability.truth} result and receipt
\`\`\`
`);

  await writeMissing(`${base}/architecture/execution-flow.ascii.md`, `# Execution Flow

\`\`\`text
intent -> scenario -> semantic authority -> resolved authority
       -> runtime/adapters -> result -> proof receipt
\`\`\`
`);

  await writeMissing(`${base}/architecture/boundary-context.ascii.md`, `# Boundary Context

\`\`\`text
owns: ${capability.truth}
publishes: ${capability.publicContract}
must not own: ${capability.exclusions.join(", ")}
\`\`\`
`);

  await writeJson(`${base}/semantic-authority/responsibilities/scenario-responsibilities.sej.v1.json`, {
    semanticType: "scenario-responsibility-catalog.v1",
    capabilityId: capability.id,
    status: "scaffold",
    responsibilities: capability.semanticResponsibilities.map((responsibilityId, index) => ({
      responsibilityId,
      sequence: index + 1,
      kind: responsibilityId.startsWith("project")
        ? "projection"
        : ["classify", "dispatch", "evaluate", "recognize", "resolve", "select"].some((verb) => responsibilityId.startsWith(verb))
          ? "decision"
          : ["execute", "iterate", "order"].some((verb) => responsibilityId.startsWith(verb))
            ? "execution-model"
            : "observation"
    }))
  });

  const catalogs = [
    ["observations", "observations.sej.v1.json", "observation-catalog.v1"],
    ["decisions", "decisions.sej.v1.json", "decision-catalog.v1"],
    ["projections", "projections.sej.v1.json", "projection-catalog.v1"],
    ["ports", "ports.sej.v1.json", "port-catalog.v1"],
    ["effects", "effects.sej.v1.json", "effect-catalog.v1"]
  ];
  for (const [folder, file, semanticType] of catalogs) {
    await writeJson(`${base}/semantic-authority/${folder}/${file}`, {
      semanticType,
      capabilityId: capability.id,
      status: "scaffold",
      entries: []
    });
  }

  await writeJson(`${base}/semantic-authority/execution-models/execution-model.sej.v1.json`, {
    semanticType: "execution-model.v1",
    capabilityId: capability.id,
    status: "scaffold",
    operations: [
      { sequence: 1, operation: `resolve-${capability.id}-authority` },
      { sequence: 2, operation: `execute-resolved-${capability.id}` },
      { sequence: 3, operation: `project-${capability.id}-result` }
    ],
    iterationAuthority: [],
    stateTransitions: []
  });

  await writeJson(`${base}/semantic-authority/failure-policies/failure-policy.sej.v1.json`, {
    semanticType: "failure-policy.v1",
    capabilityId: capability.id,
    status: "scaffold",
    classifications: [],
    fallbackPolicy: "no-implicit-fallback",
    retryPolicy: "no-implicit-retry"
  });

  await writeJson(`${base}/semantic-authority/proof-requirements/proof-requirements.sej.v1.json`, {
    semanticType: "proof-requirements.v1",
    capabilityId: capability.id,
    status: "scaffold",
    requiredAssertions: [
      "intent-identity-recorded",
      "resolved-authority-identity-recorded",
      "effect-results-recorded",
      "final-disposition-recorded"
    ]
  });

  const commonContracts = [
    "request.schema.v1.json",
    "execution-context.schema.v1.json",
    "resolved-authority.schema.v1.json",
    "result.schema.v1.json",
    "receipt.schema.v1.json"
  ];
  for (const contract of [...new Set([...commonContracts, ...capability.contracts])]) {
    const contractId = semanticId(contract);
    await writeJson(`${base}/contracts/${contract}`, {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: contract,
      title: `${capability.title} ${titleFromFile(contract)}`,
      type: "object",
      required: ["contractType"],
      properties: {
        contractType: { const: contractId }
      },
      additionalProperties: true,
      "x-capability-id": capability.id,
      "x-status": "scaffold"
    });
  }

  await writeMissing(`${base}/adapters/README.md`, `# Adapters

Place irreducible platform mechanics here. Adapters may observe or perform
declared effects; they may not authorize an effect, choose fallback, retry, or
classify domain success.
`);
  await writeMissing(`${base}/runtime/README.md`, `# Runtime

Runtime bodies must read as a collapsed transcript:

\`\`\`text
resolve -> execute -> project -> return
\`\`\`

Do not author capability decisions, DTO stitching, iteration policy, fallback,
retry, or proof disposition here.
`);
  await writeMissing(`${base}/projectors/README.md`, `# Projectors

Generated or generic language projections of semantic authority belong here.
Hand-authored domain mappings do not.
`);
  await writeMissing(`${base}/docs/README.md`, `# Capability Documentation

Add examples, contract evolution notes, and release evidence here without
duplicating canonical semantic authority.
`);
  for (const proofArea of ["fixtures", "scenarios", "assertions", "conformance"]) {
    await writeMissing(`${base}/proof/${proofArea}/README.md`, `# ${proofArea[0].toUpperCase()}${proofArea.slice(1)}

Proof artifacts for ${capability.title} belong here.
`);
  }
}

const bodyContract = {
  contractType: "repository-walkthrough-system-body.v1",
  systemId: "repository-walkthrough-system",
  status: "scaffold",
  capabilities: capabilities.map((capability) => ({
    capabilityId: capability.id,
    package: `capabilities/${capability.id}`,
    owns: capability.vocabulary,
    mustNotOwn: capability.exclusions,
    publicContract: `capabilities/${capability.id}/contracts/${capability.publicContract}`,
    dependencies: capability.dependencies
  }))
};
await writeJson("capability-authority/repository-walkthrough-system-body.v1.json", bodyContract);

for (const capability of capabilities) {
  await writeJson(`capability-authority/${capability.id}.capability.json`, {
    capabilityType: "repository-walkthrough-capability.v1",
    capabilityId: capability.id,
    title: capability.title,
    outcome: capability.outcome,
    owns: capability.vocabulary,
    mustNotOwn: capability.exclusions,
    publicContract: `capabilities/${capability.id}/contracts/${capability.publicContract}`,
    dependencies: capability.dependencies,
    status: "scaffold"
  });
}

await writeJson("semantic-authority/composition/compose-repository-walkthrough.sej.v1.json", {
  semanticType: "capability-composition.v1",
  compositionId: "compose-repository-walkthrough",
  status: "scaffold",
  providers: capabilities.filter(({ id }) => id !== "repository-walkthrough-harness").map(({ id }) => id),
  boundaryRule: "published-contracts-only"
});

await writeJson("semantic-authority/execution/repository-walkthrough-execution-model.sej.v1.json", {
  semanticType: "execution-model.v1",
  executionModelId: "repository-walkthrough-execution-model",
  status: "scaffold",
  operations: [
    "resolve-repository-walkthrough-authority",
    "execute-resolved-repository-walkthrough",
    "project-repository-walkthrough-receipt"
  ]
});

await writeJson("semantic-authority/policies/repository-walkthrough-system-policy.sej.v1.json", {
  semanticType: "system-policy.v1",
  policyId: "repository-walkthrough-system-policy",
  status: "scaffold",
  rules: [
    "reject-unresolved-capability-authority-before-effects",
    "invoke-capabilities-through-published-contracts-only",
    "do-not-infer-proof-from-artifact-existence",
    "do-not-apply-implicit-fallback-or-retry"
  ]
});

await writeJson("semantic-authority/proof/repository-walkthrough-system-proof.sej.v1.json", {
  semanticType: "proof-requirements.v1",
  proofContractId: "repository-walkthrough-system-proof.v1",
  status: "scaffold",
  requiredAssertions: [
    "walkthrough-request-identity-recorded",
    "composition-authority-hash-recorded",
    "every-required-capability-receipt-recorded",
    "recording-proof-recorded",
    "final-system-disposition-recorded"
  ]
});

await writeMissing("runtime/README.md", `# System Runtime

The eventual system body may only resolve composition authority, execute the
resolved composition through published capability contracts, and project the
system receipt. It must not contain provider mechanics or capability domain
decisions.
`);

console.log(`Scaffold ensured for ${capabilities.length} capability packages.`);
