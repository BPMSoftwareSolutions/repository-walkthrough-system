# Repository Presentation Inspector

The **Repository Presentation Inspector** is the deterministic capability that converts an authorized repository source into a structured inventory of material that can be presented, explained, demonstrated, or used to construct a walkthrough.

It does **not** decide the story, scenes, narration, browser movements, or recording behavior.

Its single outcome is:

> **Produce a verified inventory of presentable repository material from an immutable repository source.**

This keeps the boundary clean inside the larger repository-walkthrough constellation: the source resolver establishes repository truth, the presentation inspector establishes presentable-material truth, and downstream capabilities decide what story to tell with that material. 

---

# 1. Capability Boundary

```text
Resolved Repository Source
          │
          ▼
┌────────────────────────────────────────────┐
│    REPOSITORY PRESENTATION INSPECTOR       │
│                                            │
│  Observe repository artifacts             │
│  Classify presentable material             │
│  Resolve presentation significance        │
│  Extract semantic anchors                  │
│  Project presentation inventory            │
│  Produce inspection proof                  │
└─────────────────────┬──────────────────────┘
                      │
                      ▼
Repository Presentation Inventory
```

## It owns

```text
Repository artifact
Presentation asset
Document section
Semantic anchor
Artifact classification
Presentability
Presentation significance
Presentation readiness
Presentation inventory
Inspection finding
```

## It must not own

```text
Audience
Learning objective
Story beat
Narration
Scene
Transition
Browser operation
CSS selector
Scroll behavior
Recording profile
Video proof
```

That gives us the semantic exclusion rule:

```text
Inspector:
What material is available and presentable?

Story Resolver:
What should be communicated?

Scene Planner:
What visual scenes should communicate it?

Browser Resolver:
How should those scenes be physically presented?
```

---

# 2. Canonical Intent

```json
{
  "$schema": "./repository-presentation-inspector.intent-ir.schema.v1.json",
  "capabilityId": "repository-presentation-inspector",
  "title": "Repository Presentation Inspector",
  "purpose": "Produce a verified inventory of presentable material from an authorized repository source.",
  "actor": "authorized-walkthrough-harness",
  "trigger": "a resolved repository source is submitted for presentation inspection",
  "desiredOutcome": "all supported presentable repository material is classified, anchored, ranked, and projected into a deterministic presentation inventory",
  "constraints": [
    "the repository source must already be resolved and immutable",
    "inspection must not mutate the repository",
    "unsupported artifacts must be reported rather than silently ignored",
    "presentation significance must be resolved through declared semantic authority",
    "all inventory entries must reference observable repository locations",
    "the inspection receipt must identify the inspected repository revision",
    "the capability must not construct a walkthrough story or scene plan"
  ],
  "featureIds": [
    "inventory-presentable-repository-material"
  ]
}
```

The semantic layer remains the source of truth; runtime bodies only execute the resolved inspection authority. That follows the deterministic micro-capability standard’s central separation between canonical meaning, execution authority, mechanical code, and proof. 

---

# 3. Primary Feature

```gherkin
Feature: Inventory presentable repository material

  As an authorized repository walkthrough harness
  I want a deterministic inventory of presentable repository material
  So that downstream capabilities can construct stories and scenes
  without interpreting the repository independently

  Scenario: Inventory presentable material from a supported repository
    Given an immutable resolved repository source
    And the repository revision can be inspected
    And supported presentation artifact policies are declared
    When the repository presentation is inspected
    Then supported repository artifacts are observed
    And each presentable artifact is classified
    And semantic presentation anchors are recorded
    And presentation significance is resolved
    And a repository presentation inventory is produced
    And an inspection receipt identifies the inspected revision

  Scenario: Preserve unsupported material as an inspection finding
    Given an immutable resolved repository source
    And the repository contains an unsupported artifact
    When the repository presentation is inspected
    Then the unsupported artifact is not silently discarded
    And an unsupported-artifact finding is recorded
    And supported artifacts remain available in the inventory

  Scenario: Reject an unresolved repository source
    Given a repository request without a resolved revision identity
    When repository presentation inspection is requested
    Then inspection is rejected
    And no repository artifacts are read
    And a rejection receipt is produced

  Scenario: Produce byte-stable inventory ordering
    Given the same immutable repository revision
    And the same inspection authority
    When repository presentation inspection is repeated
    Then the presentation inventory entries appear in canonical order
    And the inventory hash remains unchanged

  Scenario: Report an empty presentable repository
    Given an immutable resolved repository source
    And no supported presentable artifacts are observed
    When the repository presentation is inspected
    Then an empty presentation inventory is produced
    And the disposition is NO_PRESENTABLE_MATERIAL
    And the inspection is not reported as a runtime failure
```

---

# 4. Public Operation

```text
inspectsRepositoryPresentation(request)
        ↓
RepositoryPresentationInspectionResult
```

Conceptual signature:

```typescript
export async function inspectsRepositoryPresentation(
  context: RepositoryPresentationInspectionContext
): Promise<RepositoryPresentationInspectionResult> {
  const authority = await edges.invokes(
    "resolve-repository-presentation-inspection-authority",
    context
  );

  const execution = await edges.invokes(
    "execute-resolved-repository-presentation-inspection",
    authority
  );

  return edges.projects(
    "project-repository-presentation-inspection-result",
    execution
  );
}
```

The body remains collapsed:

```text
Resolve
Execute
Project
Return
```

No file extension switches, loops over directories, hand-built DTOs, significance ranking, or artifact filtering belongs inside this body. Meaning expands semantically; execution collapses mechanically. 

---

# 5. Internal Capability Flow

```text
Resolved repository source
          │
          ▼
1. Validate inspection request
          │
          ▼
2. Resolve inspection profile
          │
          ▼
3. Observe repository artifact inventory
          │
          ▼
4. Classify repository artifacts
          │
          ▼
5. Inspect supported artifact contents
          │
          ▼
6. Classify document sections and semantic bodies
          │
          ▼
7. Resolve presentation anchors
          │
          ▼
8. Resolve presentability
          │
          ▼
9. Resolve presentation significance
          │
          ▼
10. Resolve presentation readiness
          │
          ▼
11. Order presentation assets canonically
          │
          ▼
12. Project presentation inventory and receipt
```

---

# 6. Bounded Semantic Micro-Components

I would establish **12 semantic micro-components** beneath the one public capability.

## 1. Inspection Request Validator

Answers:

> Is this request admissible for repository presentation inspection?

Validates:

```text
Resolved repository identity exists
Revision identity exists
Repository root is authorized
Inspection profile is recognized
Requested inventory contract version is supported
Inspection boundaries are declared
```

Output:

```text
accepted-inspection-request
rejected-inspection-request
```

---

## 2. Inspection Profile Resolver

Answers:

> Which inspection authority applies to this repository and requested presentation mode?

A profile may define:

```text
Supported artifact families
Ignored infrastructure paths
Maximum document size
Maximum source example size
Binary-file disposition
Generated-file disposition
Hidden-file disposition
Symlink policy
Anchor extraction policy
Significance policy
Canonical ordering policy
```

Example profiles:

```text
repository-overview.v1
architecture-walkthrough.v1
capability-demonstration.v1
readme-only.v1
proof-focused.v1
```

The initial implementation should support one profile:

```text
repository-overview.v1
```

---

## 3. Repository Artifact Observer

Answers:

> What artifacts physically exist inside the authorized repository source?

It observes facts only:

```text
Relative path
Artifact kind
Extension
Size
Content hash
Directory relationship
Readable disposition
Generated indicator, when declared
Symlink indicator
```

It does not decide whether an artifact is presentable.

---

## 4. Repository Artifact Classifier

Answers:

> What semantic repository artifact kind does each observed artifact represent?

Initial classifications:

```text
readme-document
markdown-document
architecture-diagram
gherkin-feature
semantic-authority
json-contract
json-schema
source-file
test-file
proof-artifact
configuration
package-manifest
license-document
image-asset
unsupported-artifact
```

Example authority:

```json
{
  "decisionId": "classify-repository-artifact",
  "inputs": [
    "artifact.relativePath",
    "artifact.fileName",
    "artifact.extension",
    "artifact.detectedFormat"
  ],
  "rules": [
    {
      "when": {
        "artifact.fileName": {
          "inCaseInsensitive": ["README.md", "README"]
        }
      },
      "then": "readme-document"
    },
    {
      "when": {
        "artifact.extension": ".feature"
      },
      "then": "gherkin-feature"
    },
    {
      "when": {
        "artifact.fileName": {
          "endsWith": ".sej.v1.json"
        }
      },
      "then": "semantic-authority"
    },
    {
      "when": {
        "artifact.fileName": {
          "contains": ".schema."
        }
      },
      "then": "json-schema"
    },
    {
      "when": {
        "*": true
      },
      "then": "unsupported-artifact"
    }
  ]
}
```

---

## 5. Supported Artifact Content Inspector

Answers:

> What presentable internal structure is observable inside this supported artifact?

Different artifact families expose different observable structures.

```text
Markdown
├── heading
├── paragraph
├── code block
├── table
├── list
├── block quote
└── diagram block

Gherkin
├── feature
├── background
├── scenario
├── scenario outline
├── examples
└── step

Semantic JSON
├── root semantic body
├── decision
├── projection
├── policy
├── operation
├── responsibility
└── proof requirement

Source
├── exported operation
├── function
├── class
├── public method
└── collapsed capability body
```

The first version should deeply inspect only:

```text
README and Markdown
Gherkin
SEJ or semantic JSON
JSON schemas and contracts
TypeScript source
```

Everything else can initially be artifact-level only.

---

## 6. Presentation Unit Classifier

Answers:

> What kind of presentable unit was observed inside the artifact?

Canonical presentation-unit kinds:

```text
document-heading
document-section
architecture-diagram
code-example
command-example
feature-definition
scenario-definition
semantic-decision
semantic-projection
semantic-policy
contract-definition
schema-definition
public-operation
execution-body
proof-example
table
image
repository-tree
```

This creates a provider-neutral presentation vocabulary.

A README heading and a Gherkin scenario are different source structures, but both become presentation units with stable semantic identities.

---

## 7. Presentation Anchor Resolver

Answers:

> How can downstream capabilities refer to this material without relying on fragile physical selectors?

Each presentable unit receives a semantic anchor.

Examples:

```text
readme/purpose
readme/architecture
feature/inventory-presentable-repository-material
scenario/preserve-unsupported-material
semantic-authority/classify-repository-artifact
contract/repository-presentation-inventory
source-operation/inspects-repository-presentation
proof/inspection-receipt
```

Anchor shape:

```json
{
  "anchorId": "readme/architecture",
  "anchorKind": "document-heading",
  "artifactPath": "README.md",
  "sourceIdentity": {
    "headingText": "Architecture",
    "headingLevel": 2,
    "occurrence": 1
  }
}
```

The browser presentation resolver can later translate this semantic anchor into a platform-specific locator.

The inspector must never emit CSS selectors.

---

## 8. Presentability Resolver

Answers:

> Is this unit suitable for presentation under the resolved inspection profile?

Dispositions:

```text
recommended
available
supporting
excluded
unsupported
blocked
```

Example considerations:

```text
Artifact is readable
Unit has stable identity
Unit contains meaningful content
Unit is not generated noise
Unit is not secret-bearing
Unit is not outside inspection scope
Unit is not too large under the selected policy
```

The resolver reports why something was excluded.

---

## 9. Presentation Significance Resolver

Answers:

> How important is this material for explaining the repository?

Canonical significance:

```text
foundational
primary
supporting
supplemental
incidental
```

Example semantic guidance:

```text
Intent and purpose                 → foundational
Architecture overview             → foundational
Public operation                  → primary
Main feature and scenarios        → primary
Semantic authority                → primary
Proof receipt                     → primary
Supporting contracts              → supporting
Infrastructure configuration      → supplemental
Generated lock files              → incidental or excluded
```

This is not story selection.

It is inventory metadata that helps the story resolver make a later decision.

---

## 10. Presentation Readiness Resolver

Answers:

> What prevents this material from being reliably presented?

Readiness dispositions:

```text
ready
ready-with-findings
requires-renderer
requires-expansion
requires-transformation
blocked
```

Examples:

```text
ASCII diagram in Markdown
    → ready

Large JSON body
    → requires-focus-selection

Binary architecture image
    → requires-renderer

Unreadable file
    → blocked

Source function without stable line identity
    → ready-with-findings
```

This distinction is valuable because presentability and readiness are not identical.

```text
Presentable:
The material has presentation value.

Ready:
The material can be reliably surfaced by downstream execution.
```

---

## 11. Canonical Inventory Ordering Resolver

Answers:

> In what stable order should presentation assets appear in the inventory?

Canonical order should not depend on filesystem enumeration.

Recommended ordering:

```text
1. Repository overview
2. Purpose and intent
3. Architecture
4. Features and scenarios
5. Semantic authority
6. Contracts and schemas
7. Public operations
8. Execution bodies
9. Proof and receipts
10. Supporting documentation
11. Supplemental material
12. Unsupported findings
```

Within each group:

```text
significance rank
artifact path
source position
anchor identity
```

This gives byte-stable output for an unchanged repository revision and unchanged inspection authority.

---

## 12. Presentation Inventory Projector and Proof Builder

Answers:

> Can the observed and resolved material be projected into one conforming presentation inventory?

It produces:

```text
Repository identity
Revision identity
Inspection profile
Presentation assets
Artifact summaries
Semantic anchors
Significance
Readiness
Findings
Coverage facts
Inventory hash
Inspection receipt
```

---

# 7. Presentation Asset Contract

```json
{
  "$schema": "./presentation-asset.schema.v1.json",
  "assetId": "readme-architecture",
  "artifactId": "artifact-readme",
  "kind": "document-section",
  "title": "Architecture",
  "location": {
    "repositoryRelativePath": "README.md",
    "semanticAnchor": "readme/architecture"
  },
  "source": {
    "artifactKind": "readme-document",
    "startLine": 42,
    "endLine": 88,
    "contentHash": "sha256:..."
  },
  "presentation": {
    "presentability": "recommended",
    "significance": "foundational",
    "readiness": "ready",
    "supportedSurfaces": [
      "repository-browser",
      "markdown-renderer",
      "source-viewer"
    ]
  },
  "relationships": {
    "parentAssetId": null,
    "childAssetIds": [
      "architecture-context-diagram",
      "architecture-execution-flow"
    ],
    "relatedAssetIds": [
      "feature-inventory-presentable-material"
    ]
  },
  "findings": []
}
```

---

# 8. Repository Presentation Inventory Contract

```json
{
  "$schema": "./repository-presentation-inventory.schema.v1.json",
  "inventoryType": "repository-presentation-inventory.v1",
  "inventoryId": "inventory-repository-presentation-inspector",
  "repository": {
    "repositoryId": "repository-presentation-inspector",
    "provider": "local-workspace",
    "revision": "sha256:repository-revision",
    "sourceReceiptHash": "sha256:..."
  },
  "inspection": {
    "profileId": "repository-overview.v1",
    "authorityHash": "sha256:...",
    "startedAt": "2026-07-26T00:00:00Z",
    "completedAt": "2026-07-26T00:00:01Z"
  },
  "summary": {
    "observedArtifactCount": 42,
    "supportedArtifactCount": 27,
    "presentationAssetCount": 63,
    "recommendedAssetCount": 14,
    "unsupportedArtifactCount": 3,
    "blockedAssetCount": 0
  },
  "assets": [],
  "findings": [],
  "disposition": "PRESENTATION_INVENTORY_PRODUCED",
  "inventoryHash": "sha256:..."
}
```

---

# 9. Resolved Inspection Authority

Before inspection execution, the resolver should produce complete authority:

```json
{
  "authorityType": "resolved-repository-presentation-inspection.v1",
  "inspectionId": "inspect-repository-presentation-01",
  "repository": {
    "repositoryId": "repository-presentation-inspector",
    "revision": "sha256:repository-revision",
    "authorizedRoot": "/workspace/repository-presentation-inspector"
  },
  "profileId": "repository-overview.v1",
  "operations": [
    {
      "sequence": 1,
      "operation": "observe-repository-artifacts",
      "iterationId": "observe-authorized-repository-artifacts"
    },
    {
      "sequence": 2,
      "operation": "classify-repository-artifacts",
      "decisionId": "classify-repository-artifact"
    },
    {
      "sequence": 3,
      "operation": "inspect-supported-artifact-content",
      "dispatchId": "dispatch-supported-artifact-inspection"
    },
    {
      "sequence": 4,
      "operation": "classify-presentation-units",
      "decisionId": "classify-presentation-unit"
    },
    {
      "sequence": 5,
      "operation": "resolve-presentation-anchors",
      "projectionId": "project-semantic-presentation-anchor"
    },
    {
      "sequence": 6,
      "operation": "resolve-presentability",
      "decisionId": "resolve-presentation-unit-presentability"
    },
    {
      "sequence": 7,
      "operation": "resolve-presentation-significance",
      "decisionId": "resolve-presentation-significance"
    },
    {
      "sequence": 8,
      "operation": "resolve-presentation-readiness",
      "decisionId": "resolve-presentation-readiness"
    },
    {
      "sequence": 9,
      "operation": "order-presentation-assets",
      "orderingId": "order-repository-presentation-assets"
    },
    {
      "sequence": 10,
      "operation": "project-presentation-inventory",
      "projectionId": "project-repository-presentation-inventory"
    }
  ],
  "failurePolicyId": "repository-presentation-inspection-failure-policy",
  "proofContractId": "repository-presentation-inspection-proof.v1"
}
```

At that point, execution has nothing left to interpret.

---

# 10. Repository File-System Body

```text
repository-presentation-inspector/
├── README.md
│
├── intent/
│   └── inventory-presentable-repository-material.intent-ir.v1.json
│
├── features/
│   └── inventory-presentable-repository-material.feature
│
├── architecture/
│   ├── repository-presentation-inspector.ascii.md
│   ├── repository-presentation-inspection-flow.ascii.md
│   ├── presentation-asset-model.ascii.md
│   └── boundary-context.ascii.md
│
├── semantic-authority/
│   ├── inspection-profiles/
│   │   └── repository-overview.sej.v1.json
│   │
│   ├── validate-inspection-request/
│   │   └── validate-inspection-request.sej.v1.json
│   │
│   ├── observe-repository-artifacts/
│   │   └── observe-authorized-repository-artifacts.sej.v1.json
│   │
│   ├── classify-repository-artifact/
│   │   └── classify-repository-artifact.sej.v1.json
│   │
│   ├── inspect-supported-artifact-content/
│   │   └── dispatch-supported-artifact-inspection.sej.v1.json
│   │
│   ├── classify-presentation-unit/
│   │   └── classify-presentation-unit.sej.v1.json
│   │
│   ├── resolve-presentation-anchor/
│   │   └── project-semantic-presentation-anchor.sej.v1.json
│   │
│   ├── resolve-presentability/
│   │   └── resolve-presentation-unit-presentability.sej.v1.json
│   │
│   ├── resolve-presentation-significance/
│   │   └── resolve-presentation-significance.sej.v1.json
│   │
│   ├── resolve-presentation-readiness/
│   │   └── resolve-presentation-readiness.sej.v1.json
│   │
│   ├── order-presentation-assets/
│   │   └── order-repository-presentation-assets.sej.v1.json
│   │
│   ├── project-presentation-inventory/
│   │   └── project-repository-presentation-inventory.sej.v1.json
│   │
│   ├── failure-policies/
│   │   └── repository-presentation-inspection-failure-policy.sej.v1.json
│   │
│   └── proof/
│       └── repository-presentation-inspection-proof.sej.v1.json
│
├── contracts/
│   ├── repository-presentation-inspection-request.schema.v1.json
│   ├── repository-presentation-inspection-context.schema.v1.json
│   ├── observed-repository-artifact.schema.v1.json
│   ├── classified-repository-artifact.schema.v1.json
│   ├── observed-presentation-unit.schema.v1.json
│   ├── presentation-anchor.schema.v1.json
│   ├── presentation-asset.schema.v1.json
│   ├── resolved-repository-presentation-inspection.schema.v1.json
│   ├── repository-presentation-inventory.schema.v1.json
│   └── repository-presentation-inspection-receipt.schema.v1.json
│
├── adapters/
│   ├── file-system/
│   │   ├── lists-repository-artifacts.ts
│   │   ├── reads-repository-artifact.ts
│   │   └── observes-repository-artifact-metadata.ts
│   │
│   ├── markdown/
│   │   ├── observes-markdown-headings.ts
│   │   ├── observes-markdown-code-blocks.ts
│   │   ├── observes-markdown-tables.ts
│   │   └── observes-markdown-diagrams.ts
│   │
│   ├── gherkin/
│   │   ├── observes-gherkin-feature.ts
│   │   └── observes-gherkin-scenarios.ts
│   │
│   ├── json/
│   │   ├── observes-json-body.ts
│   │   └── observes-json-schema-identity.ts
│   │
│   └── typescript/
│       ├── observes-exported-operations.ts
│       └── observes-source-body-range.ts
│
├── runtime/
│   ├── resolves-repository-presentation-inspection-authority.ts
│   ├── executes-resolved-repository-presentation-inspection.ts
│   └── projects-repository-presentation-inspection-result.ts
│
├── proof/
│   ├── fixtures/
│   │   ├── minimal-presentable-repository/
│   │   ├── unsupported-artifact-repository/
│   │   ├── empty-presentable-repository/
│   │   └── deterministic-ordering-repository/
│   │
│   ├── scenarios/
│   ├── assertions/
│   └── conformance/
│
└── examples/
    ├── repository-overview.inspection-request.json
    └── repository-overview.presentation-inventory.json
```

Files remain verb-oriented, except for type and schema bodies. This follows the repository standard’s preference for semantic verb phrases and one responsibility per body. 

---

# 11. Runtime Bodies

## Resolve authority

```typescript
export async function resolvesRepositoryPresentationInspectionAuthority(
  context: RepositoryPresentationInspectionContext
): Promise<ResolvedRepositoryPresentationInspection> {
  return edges.invokes(
    "resolve-repository-presentation-inspection-authority",
    context
  );
}
```

## Execute authority

```typescript
export async function executesResolvedRepositoryPresentationInspection(
  context: ResolvedRepositoryPresentationInspectionContext
): Promise<ExecutedRepositoryPresentationInspection> {
  return edges.invokes(
    "execute-resolved-repository-presentation-inspection",
    context
  );
}
```

## Project result

```typescript
export function projectsRepositoryPresentationInspectionResult(
  context: ExecutedRepositoryPresentationInspectionContext
): RepositoryPresentationInspectionResult {
  return edges.projects(
    "project-repository-presentation-inspection-result",
    context
  );
}
```

No provider-specific or artifact-specific decisions enter those bodies.

---

# 12. Proof Contract

A successful return is not enough.

```json
{
  "proofContractId": "repository-presentation-inspection-proof.v1",
  "requiredAssertions": [
    "resolved-repository-source-identity-recorded",
    "repository-revision-recorded",
    "inspection-authority-hash-recorded",
    "every-inventory-asset-references-an-observed-artifact",
    "every-presentable-unit-has-a-stable-semantic-anchor",
    "every-unsupported-artifact-has-a-declared-finding",
    "canonical-ordering-applied",
    "inventory-contract-validation-passed",
    "inventory-content-hash-recorded",
    "inspection-disposition-recorded"
  ]
}
```

Receipt:

```json
{
  "receiptType": "repository-presentation-inspection-receipt.v1",
  "runId": "inspection-run-01",
  "repositoryId": "repository-presentation-inspector",
  "repositoryRevision": "sha256:...",
  "inspectionProfileId": "repository-overview.v1",
  "inspectionAuthorityHash": "sha256:...",
  "observedArtifactCount": 42,
  "presentationAssetCount": 63,
  "unsupportedArtifactCount": 3,
  "inventoryHash": "sha256:...",
  "findings": [],
  "disposition": "PRESENTATION_INVENTORY_PRODUCED"
}
```

---

# 13. Failure Dispositions

The inspector should fail closed where authority is missing, but not classify ordinary repository diversity as runtime failure.

```text
PRESENTATION_INVENTORY_PRODUCED
PRESENTATION_INVENTORY_PRODUCED_WITH_FINDINGS
NO_PRESENTABLE_MATERIAL
REJECTED_UNRESOLVED_REPOSITORY_SOURCE
REJECTED_UNSUPPORTED_INSPECTION_PROFILE
BLOCKED_REPOSITORY_UNREADABLE
BLOCKED_INSPECTION_SCOPE_VIOLATION
FAILED_UNCLASSIFIED
```

Unsupported files should usually produce findings, not terminate the whole inspection.

Repository escape, unresolved revision, or unreadable root should block the inspection.

---

# 14. First Vertical Slice

The first implementation should stay extremely narrow:

> Given a resolved local repository source, inspect its README, Gherkin files, semantic JSON files, JSON schemas, and TypeScript public operations; then produce a deterministic presentation inventory.

## Supported initially

```text
README.md
docs/**/*.md
features/**/*.feature
semantic-authority/**/*.json
contracts/**/*.json
src/**/*.ts
runtime/**/*.ts
```

## Presentation units initially

```text
README headings
Markdown code blocks
Markdown ASCII diagrams
Gherkin features
Gherkin scenarios
Semantic JSON root identities
Decision IDs
Projection IDs
Schema identities
Exported TypeScript operations
Collapsed execution bodies
```

## Explicitly deferred

```text
Image analysis
PDF inspection
Video inspection
Dependency graph generation
Git history analysis
Runtime execution discovery
Story generation
Scene planning
Browser locators
Presentation screenshots
LLM interpretation
```

This first slice remains deterministic and inexpensive.

---

# 15. First Example Inventory

```json
{
  "inventoryType": "repository-presentation-inventory.v1",
  "repository": {
    "repositoryId": "file-system-shaper",
    "revision": "sha256:abc123"
  },
  "assets": [
    {
      "assetId": "readme-purpose",
      "kind": "document-section",
      "title": "Purpose",
      "location": {
        "repositoryRelativePath": "README.md",
        "semanticAnchor": "readme/purpose"
      },
      "presentation": {
        "presentability": "recommended",
        "significance": "foundational",
        "readiness": "ready"
      }
    },
    {
      "assetId": "feature-shape-file-system",
      "kind": "feature-definition",
      "title": "Shape a file system",
      "location": {
        "repositoryRelativePath": "features/shape-a-file-system.feature",
        "semanticAnchor": "feature/shape-a-file-system"
      },
      "presentation": {
        "presentability": "recommended",
        "significance": "primary",
        "readiness": "ready"
      }
    },
    {
      "assetId": "semantic-placement-contract",
      "kind": "semantic-policy",
      "title": "File-system shape declaration",
      "location": {
        "repositoryRelativePath": "semantic-authority/file-system-shape.sej.v1.json",
        "semanticAnchor": "semantic-authority/file-system-shape"
      },
      "presentation": {
        "presentability": "recommended",
        "significance": "primary",
        "readiness": "requires-focus-selection"
      }
    },
    {
      "assetId": "operation-shapes-file-system",
      "kind": "public-operation",
      "title": "shapesFileSystem",
      "location": {
        "repositoryRelativePath": "runtime/shapes-file-system.ts",
        "semanticAnchor": "source-operation/shapes-file-system"
      },
      "presentation": {
        "presentability": "recommended",
        "significance": "primary",
        "readiness": "ready"
      }
    }
  ],
  "findings": [],
  "disposition": "PRESENTATION_INVENTORY_PRODUCED"
}
```

---

# 16. Relationship to Downstream Capabilities

```text
Repository Source Resolver
        │
        │ ResolvedRepositorySource
        ▼
Repository Presentation Inspector
        │
        │ RepositoryPresentationInventory
        ▼
Walkthrough Story Resolver
        │
        │ WalkthroughStory
        ▼
Walkthrough Scene Planner
        │
        │ WalkthroughScenePlan
        ▼
Browser Presentation Resolver
```

The presentation inventory becomes a **stable semantic catalog**.

The story resolver should select:

```text
assetId
semanticAnchor
significance
presentation role
```

It should not reopen the repository and independently reinterpret the source.

That avoids duplicate authority.

---

# 17. Final Capability Shape

```text
Repository Presentation Inspector
├── 1 canonical capability intent
├── 1 primary feature
├── 5 initial scenarios
├── 12 semantic micro-components
├── 10 primary contracts
├── artifact-specific observation adapters
├── 3 collapsed runtime bodies
├── 1 canonical presentation inventory
└── 1 independently verifiable proof model
```

The cleanest public definition is:

> **The Repository Presentation Inspector inventories what a repository can truthfully present. It does not decide what story to tell, how to visualize that story, or how to record it.**

And the architectural invariant is:

```text
Repository truth
      ↓
Presentable-material truth
      ↓
Communicative truth
      ↓
Visual-scene truth
      ↓
Presentation-execution truth
      ↓
Observed proof
```

That gives the walkthrough system exactly the kind of bounded, independently governable meaning the capability constellation was designed to preserve. 
