# README Presentation Inspector

The **README Presentation Inspector** should be a narrowly bounded deterministic capability that answers one question:

> **What presentable material exists inside a repository README, where is it located, and how significant is it for a walkthrough?**

It does **not** write the story, plan browser movements, choose narration, or record anything. It produces a canonical **README presentation inventory** that downstream capabilities can trust.

This is the specialized first implementation of the broader Repository Presentation Inspector identified in the walkthrough capability constellation. 

---

# 1. Capability Boundary

```text
Resolved Repository Source
          │
          ▼
┌──────────────────────────────────────────────┐
│        README PRESENTATION INSPECTOR         │
│                                              │
│  observes README material                    │
│  recognizes document structure              │
│  classifies presentable assets               │
│  resolves presentation significance         │
│  projects a presentation inventory           │
│  proves what was inspected                   │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
          README Presentation Inventory
```

## Outcome it owns

```text
Given:
    one authorized repository source
    and one declared README inspection policy

Produce:
    one canonical inventory of README presentation assets
    with stable semantic anchors, classifications,
    significance, diagnostics, and inspection proof
```

## It owns this language

```text
README document
README section
heading
paragraph
list
code block
diagram
table
example
command
link
badge
image
semantic anchor
presentation asset
presentability
presentation significance
inspection finding
```

## It must not own this language

```text
audience
learning objective
story beat
narration
scene
scroll speed
CSS selector
browser viewport
recording
frame rate
video
```

Those terms belong to downstream capabilities.

---

# 2. Position in the Walkthrough System

```text
Repository Source Resolver
          │
          │ ResolvedRepositorySource
          ▼
README Presentation Inspector
          │
          │ ReadmePresentationInventory
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

The contract boundary is important:

```text
README Inspector says:

    “This section exists.”
    “This block is an architectural diagram.”
    “This command is a runnable example.”
    “This section has high presentation significance.”

README Inspector does not say:

    “Show this first.”
    “Spend 20 seconds here.”
    “Explain this to beginners.”
    “Zoom into line 45.”
```

Those are story and presentation decisions.

---

# 3. C4 Component View

```text
┌──────────────────── README PRESENTATION INSPECTOR ────────────────────┐
│                                                                       │
│  ┌────────────────────────┐                                           │
│  │ Inspection Request     │                                           │
│  │ Validator              │                                           │
│  └────────────┬───────────┘                                           │
│               ▼                                                       │
│  ┌────────────────────────┐                                           │
│  │ README Source Resolver │                                           │
│  └────────────┬───────────┘                                           │
│               ▼                                                       │
│  ┌────────────────────────┐                                           │
│  │ README Observer        │                                           │
│  │                        │                                           │
│  │ bytes, hash, encoding, │                                           │
│  │ line and node facts    │                                           │
│  └────────────┬───────────┘                                           │
│               ▼                                                       │
│  ┌────────────────────────┐                                           │
│  │ Document Structure     │                                           │
│  │ Resolver               │                                           │
│  └────────────┬───────────┘                                           │
│               ▼                                                       │
│  ┌────────────────────────┐                                           │
│  │ Presentation Asset     │                                           │
│  │ Classifier             │                                           │
│  └────────────┬───────────┘                                           │
│               ▼                                                       │
│  ┌────────────────────────┐                                           │
│  │ Semantic Anchor        │                                           │
│  │ Projector              │                                           │
│  └────────────┬───────────┘                                           │
│               ▼                                                       │
│  ┌────────────────────────┐                                           │
│  │ Presentation           │                                           │
│  │ Significance Resolver  │                                           │
│  └────────────┬───────────┘                                           │
│               ▼                                                       │
│  ┌────────────────────────┐                                           │
│  │ Inventory Projector    │                                           │
│  └────────────┬───────────┘                                           │
│               ▼                                                       │
│  ┌────────────────────────┐                                           │
│  │ Inspection Proof       │                                           │
│  │ Projector              │                                           │
│  └────────────────────────┘                                           │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

The rich meaning belongs in semantic declarations. The runtime bodies should remain linear execution witnesses, consistent with the deterministic micro-capability standard. 

---

# 4. Canonical Intent

```json
{
  "$schema": "./readme-presentation-inspector.intent-ir.schema.v1.json",
  "capabilityId": "inspect-readme-presentation-material",
  "title": "Inspect README presentation material",
  "purpose": "Produce a canonical inventory of presentable material contained in an authorized repository README.",
  "actor": "authorized-walkthrough-harness",
  "trigger": "a resolved repository source and README inspection policy are submitted",
  "desiredOutcome": "all admissible README presentation assets are classified, anchored, and reported without authoring a walkthrough story",
  "constraints": [
    "the repository source must already be authorized",
    "the inspected README identity must be recorded",
    "source order must be preserved",
    "semantic anchors must be stable within the observed README revision",
    "unsupported material must produce diagnostics rather than silent omission",
    "no browser selectors may be projected",
    "no narrative ordering may be invented",
    "no repository mutation may occur"
  ],
  "featureIds": [
    "inspect-readme-presentation-material"
  ]
}
```

---

# 5. Gherkin Feature

```gherkin
Feature: Inspect README presentation material

  Scenario: Inventory a README containing presentable sections
    Given an authorized repository source
    And the repository contains an admissible README document
    And the README contains headings, prose, code, and diagrams
    When the README presentation material is inspected
    Then the README document identity is recorded
    And each admissible presentation asset is classified
    And each presentation asset receives a stable semantic anchor
    And the source order of the assets is preserved
    And a README presentation inventory is produced
    And an inspection receipt is produced

  Scenario: Report that no README is available
    Given an authorized repository source
    And no admissible README document exists
    When the README presentation material is inspected
    Then no document inspection is attempted
    And the result disposition is README_NOT_FOUND
    And no presentation assets are projected
    And an inspection receipt is produced

  Scenario: Reject an unreadable README before classification
    Given an authorized repository source
    And the resolved README cannot be read
    When the README presentation material is inspected
    Then the document is not classified
    And the failure is reported as README_UNREADABLE
    And no presentation inventory is claimed as complete

  Scenario: Preserve unsupported README material as a diagnostic
    Given an authorized README contains an unsupported embedded element
    When the README presentation material is inspected
    Then the element is represented by an unsupported-material diagnostic
    And surrounding supported presentation assets remain present
    And the inspection disposition records partial support

  Scenario: Preserve repeated headings as distinct semantic anchors
    Given an authorized README contains repeated heading text
    When the README presentation material is inspected
    Then each heading receives a distinct semantic anchor
    And each anchor preserves its document position
    And no heading is silently merged with another

  Scenario: Produce a stable inventory for unchanged source
    Given the same authorized README revision
    And the same inspection policy
    When the README presentation material is inspected more than once
    Then the projected inventory is byte-stable
    And the inventory hash is unchanged
```

---

# 6. Bounded Semantic Responsibilities

I would use **10 semantic micro-components** inside this capability.

```text
README Presentation Inspector
├── 1. validates inspection request
├── 2. resolves README source
├── 3. observes README document
├── 4. resolves document structure
├── 5. classifies presentation assets
├── 6. projects semantic anchors
├── 7. resolves presentation significance
├── 8. resolves asset relationships
├── 9. projects presentation inventory
└── 10. projects inspection proof
```

## 1. Inspection Request Validator

Answers:

> Is the request structurally admissible?

Validates:

```text
resolved repository identity
repository revision identity
repository root authority
inspection policy identity
supported README names
requested inventory contract version
correlation identity
```

It must fail closed when repository authority is incomplete.

---

## 2. README Source Resolver

Answers:

> Which README document is authorized for inspection?

Candidate names may include declared entries such as:

```text
README.md
README.MD
README
docs/README.md
```

The selection order must come from policy, not authored code.

```json
{
  "decisionId": "resolve-readme-source",
  "candidateOrder": [
    "repository-root/README.md",
    "repository-root/README.MD",
    "repository-root/README",
    "repository-root/docs/README.md"
  ],
  "multipleCandidateDisposition": "select-first-by-declared-order",
  "missingDisposition": "readme-not-found"
}
```

---

## 3. README Document Observer

Answers:

> What physical facts were observed about the selected README?

It records:

```text
path
content hash
byte length
encoding
line count
parser dialect
observed revision
read disposition
```

This is mechanical observation, not interpretation.

---

## 4. Document Structure Resolver

Answers:

> What structural nodes exist in the README?

It resolves nodes such as:

```text
document title
heading
paragraph
ordered list
unordered list
blockquote
fenced code block
indented code block
table
image
link
horizontal rule
HTML block
diagram block
```

Its output preserves source order and containment.

```text
README
├── Heading: Purpose
│   ├── Paragraph
│   └── List
├── Heading: Architecture
│   ├── ASCII diagram
│   └── Explanation
└── Heading: Usage
    ├── Shell command
    └── Output example
```

---

## 5. Presentation Asset Classifier

Answers:

> What kind of presentable material does each structural node represent?

Canonical classifications might include:

```text
title
capability-summary
problem-statement
purpose-explanation
architecture-explanation
architecture-diagram
execution-flow
installation-command
usage-command
configuration-example
input-example
output-example
contract-example
code-example
feature-example
proof-example
table
image
external-reference
supporting-prose
unsupported-material
```

The distinction between structural kind and presentation kind matters:

```text
Structural kind:
    fenced-code-block

Presentation kind:
    architecture-diagram
    shell-command
    JSON-contract-example
    source-code-example
```

---

## 6. Semantic Anchor Projector

Answers:

> How can downstream capabilities refer to this asset without using physical browser selectors?

Example:

```json
{
  "anchorType": "readme-semantic-anchor.v1",
  "anchorId": "architecture__execution-flow__code-block-01",
  "documentPath": "README.md",
  "headingPath": [
    "Architecture",
    "Execution Flow"
  ],
  "sourceRange": {
    "startLine": 42,
    "endLine": 58
  },
  "nodeOrdinal": 17,
  "contentHash": "sha256:..."
}
```

A downstream scene planner can request:

```text
assetId:
    readme-architecture-execution-flow

semanticAnchor:
    architecture__execution-flow__code-block-01
```

The Browser Presentation Resolver later translates that semantic anchor into a platform-specific visual target.

---

## 7. Presentation Significance Resolver

Answers:

> How important is this asset as potential presentation material?

Recommended dispositions:

```text
essential
recommended
supporting
optional
excluded
unsupported
```

This is not narrative ordering.

It is an inspection-time evaluation of repository material under a declared policy.

Example criteria:

```json
{
  "decisionId": "resolve-readme-presentation-significance",
  "inputs": [
    "asset.presentationKind",
    "asset.headingDepth",
    "asset.contentLength",
    "asset.containsExecutableExample",
    "asset.containsArchitectureSignal",
    "asset.containsProofSignal",
    "policy.emphasisProfile"
  ],
  "rules": [
    {
      "when": {
        "asset.presentationKind": "capability-summary"
      },
      "then": "essential"
    },
    {
      "when": {
        "asset.presentationKind": "architecture-diagram"
      },
      "then": "recommended"
    },
    {
      "when": {
        "asset.presentationKind": "proof-example"
      },
      "then": "recommended"
    },
    {
      "when": {
        "asset.presentationKind": "supporting-prose"
      },
      "then": "supporting"
    }
  ]
}
```

---

## 8. Asset Relationship Resolver

Answers:

> Which assets belong together structurally or semantically?

Relationships may include:

```text
contained-by-section
explains-diagram
introduces-example
command-produces-output
caption-describes-image
table-supports-section
code-demonstrates-contract
proof-supports-claim
```

Example:

```json
{
  "relationshipId": "usage-command-produces-sample-output",
  "kind": "command-produces-output",
  "fromAssetId": "usage-command",
  "toAssetId": "usage-output-example"
}
```

This gives the story and scene capabilities richer material without asking them to reconstruct README structure.

---

## 9. Presentation Inventory Projector

Answers:

> What is the complete canonical representation of the inspected README?

It composes:

```text
document identity
document summary facts
sections
assets
anchors
relationships
diagnostics
inventory disposition
```

DTO construction belongs in semantic projection authority, not handwritten TypeScript. That follows the governing standard’s treatment of DTO shaping. 

---

## 10. Inspection Proof Projector

Answers:

> What can the capability truthfully prove about this inspection?

It records:

```text
repository identity
repository revision
README path
README hash
inspection policy hash
parser identity
structural node count
classified asset count
unsupported node count
inventory hash
diagnostic count
final disposition
```

A returned inventory alone is not sufficient proof.

---

# 7. Primary Contracts

## Inspection Request

```json
{
  "$schema": "./readme-presentation-inspection-request.schema.v1.json",
  "requestType": "readme-presentation-inspection-request.v1",
  "requestId": "inspect-readme-01",
  "repositorySource": {
    "repositoryId": "file-system-shaper",
    "revision": "commit:abc123",
    "workspaceAuthority": "authorized-repository-workspace",
    "rootReference": "workspace://file-system-shaper"
  },
  "inspectionPolicyId": "default-readme-presentation-policy.v1",
  "requestedInventoryContract": "readme-presentation-inventory.v1"
}
```

## Observed README Document

```json
{
  "documentType": "observed-readme-document.v1",
  "repositoryId": "file-system-shaper",
  "path": "README.md",
  "revision": "commit:abc123",
  "contentHash": "sha256:...",
  "byteLength": 8432,
  "lineCount": 217,
  "encoding": "utf-8",
  "markupDialect": "github-flavored-markdown",
  "readDisposition": "observed"
}
```

## Presentation Asset

```json
{
  "assetType": "readme-presentation-asset.v1",
  "assetId": "readme-architecture-execution-flow",
  "structuralKind": "fenced-code-block",
  "presentationKind": "architecture-diagram",
  "headingPath": [
    "Architecture",
    "Execution Flow"
  ],
  "semanticAnchor": {
    "anchorId": "architecture__execution-flow__code-block-01",
    "sourceRange": {
      "startLine": 42,
      "endLine": 58
    },
    "contentHash": "sha256:..."
  },
  "significance": "recommended",
  "sourceOrder": 17,
  "presentability": "presentable"
}
```

## README Presentation Inventory

```json
{
  "inventoryType": "readme-presentation-inventory.v1",
  "inventoryId": "readme-inventory-01",
  "repository": {
    "repositoryId": "file-system-shaper",
    "revision": "commit:abc123"
  },
  "document": {
    "path": "README.md",
    "contentHash": "sha256:...",
    "title": "File System Shaper"
  },
  "sections": [],
  "assets": [],
  "relationships": [],
  "diagnostics": [],
  "summary": {
    "sectionCount": 8,
    "assetCount": 24,
    "essentialAssetCount": 3,
    "recommendedAssetCount": 9,
    "unsupportedAssetCount": 0
  },
  "disposition": "README_PRESENTATION_INVENTORIED"
}
```

## Inspection Receipt

```json
{
  "receiptType": "readme-presentation-inspection-receipt.v1",
  "runId": "run-01",
  "repositoryId": "file-system-shaper",
  "repositoryRevision": "commit:abc123",
  "readmePath": "README.md",
  "readmeHash": "sha256:...",
  "inspectionPolicyHash": "sha256:...",
  "observedNodeCount": 53,
  "classifiedAssetCount": 24,
  "unsupportedNodeCount": 0,
  "inventoryHash": "sha256:...",
  "disposition": "README_PRESENTATION_INVENTORIED"
}
```

---

# 8. Semantic Execution Model

```json
{
  "executionModelId": "inspect-readme-presentation-material.v1",
  "operations": [
    {
      "sequence": 1,
      "invoke": "validate-readme-presentation-inspection-request"
    },
    {
      "sequence": 2,
      "invoke": "resolve-authorized-readme-source"
    },
    {
      "sequence": 3,
      "invoke": "observe-resolved-readme-document"
    },
    {
      "sequence": 4,
      "invoke": "resolve-readme-document-structure"
    },
    {
      "sequence": 5,
      "invoke": "classify-readme-presentation-assets"
    },
    {
      "sequence": 6,
      "invoke": "project-readme-semantic-anchors"
    },
    {
      "sequence": 7,
      "invoke": "resolve-readme-presentation-significance"
    },
    {
      "sequence": 8,
      "invoke": "resolve-readme-asset-relationships"
    },
    {
      "sequence": 9,
      "project": "project-readme-presentation-inventory"
    },
    {
      "sequence": 10,
      "project": "project-readme-presentation-inspection-receipt"
    }
  ],
  "failurePolicyId": "readme-presentation-inspection-failure-policy.v1",
  "proofContractId": "readme-presentation-inspection-proof.v1"
}
```

The runtime receives this resolved order. It does not author its own loop, branching, fallback, or aggregation rules.

---

# 9. Collapsed Runtime Bodies

## Public operation

```typescript
export async function inspectsReadmePresentationMaterial(
  context: InspectReadmePresentationMaterialContext
): Promise<ReadmePresentationInspectionResult> {
  const authority = await edges.invokes(
    "resolve-readme-presentation-inspection-authority",
    context
  );

  const execution = await edges.invokes(
    "execute-resolved-readme-presentation-inspection",
    authority
  );

  return edges.projects(
    "project-readme-presentation-inspection-result",
    execution
  );
}
```

## Responsibility bodies

```typescript
export async function resolvesReadmePresentationInspectionAuthority(
  context: InspectReadmePresentationMaterialContext
): Promise<ResolvedReadmePresentationInspectionAuthority> {
  return edges.invokes(
    "resolve-readme-presentation-inspection-authority",
    context
  );
}
```

```typescript
export async function executesResolvedReadmePresentationInspection(
  context: ResolvedReadmePresentationInspectionAuthority
): Promise<ExecutedReadmePresentationInspection> {
  return edges.invokes(
    "execute-resolved-readme-presentation-inspection",
    context
  );
}
```

```typescript
export function projectsReadmePresentationInspectionResult(
  context: ExecutedReadmePresentationInspection
): ReadmePresentationInspectionResult {
  return edges.projects(
    "project-readme-presentation-inspection-result",
    context
  );
}
```

No provider logic.
No Markdown classification switches.
No DTO stitching.
No loops.
No story generation.
No browser automation.

---

# 10. Mechanical Adapters

Adapters may contain irreducible platform mechanics.

```text
adapters/
├── repository-workspace/
│   ├── lists-readme-candidates.ts
│   └── reads-readme-document.ts
│
├── markdown/
│   ├── parses-github-flavored-markdown.ts
│   └── observes-markdown-source-ranges.ts
│
└── hashing/
    └── calculates-content-hash.ts
```

Examples of acceptable adapter mechanics:

```typescript
export async function readsReadmeDocument(
  request: ReadReadmeDocumentRequest
): Promise<ReadReadmeDocumentResult> {
  const content = await readFile(request.absolutePath, "utf8");

  return {
    content
  };
}
```

The adapter may read bytes.

It must not decide:

```text
whether the README is authoritative
whether a code block is important
whether a heading should appear in the video
whether an unsupported node should be omitted
```

---

# 11. Repository File-System Body

```text
readme-presentation-inspector/
├── README.md
│
├── intent/
│   └── inspect-readme-presentation-material.intent-ir.v1.json
│
├── features/
│   └── inspect-readme-presentation-material.feature
│
├── architecture/
│   ├── readme-presentation-inspector.ascii.md
│   ├── readme-inspection-flow.ascii.md
│   └── boundary-context.ascii.md
│
├── semantic-authority/
│   ├── validate-inspection-request/
│   │   └── validate-readme-presentation-inspection-request.sej.v1.json
│   │
│   ├── resolve-readme-source/
│   │   └── resolve-authorized-readme-source.sej.v1.json
│   │
│   ├── resolve-document-structure/
│   │   └── resolve-readme-document-structure.sej.v1.json
│   │
│   ├── classify-presentation-assets/
│   │   ├── classify-readme-presentation-asset.sej.v1.json
│   │   └── readme-presentation-kind-catalog.sej.v1.json
│   │
│   ├── project-semantic-anchors/
│   │   └── project-readme-semantic-anchor.sej.v1.json
│   │
│   ├── resolve-presentation-significance/
│   │   └── resolve-readme-presentation-significance.sej.v1.json
│   │
│   ├── resolve-asset-relationships/
│   │   └── resolve-readme-asset-relationships.sej.v1.json
│   │
│   ├── iteration/
│   │   └── inspect-readme-document-nodes.sej.v1.json
│   │
│   ├── execution/
│   │   └── inspect-readme-presentation-material.execution-model.sej.v1.json
│   │
│   ├── failures/
│   │   └── readme-presentation-inspection-failure-policy.sej.v1.json
│   │
│   └── proof/
│       └── readme-presentation-inspection-proof.sej.v1.json
│
├── contracts/
│   ├── readme-presentation-inspection-request.schema.v1.json
│   ├── observed-readme-document.schema.v1.json
│   ├── observed-readme-node.schema.v1.json
│   ├── readme-semantic-anchor.schema.v1.json
│   ├── readme-presentation-asset.schema.v1.json
│   ├── readme-asset-relationship.schema.v1.json
│   ├── readme-presentation-inventory.schema.v1.json
│   ├── resolved-readme-presentation-inspection.schema.v1.json
│   └── readme-presentation-inspection-receipt.schema.v1.json
│
├── adapters/
│   ├── repository-workspace/
│   │   ├── lists-readme-candidates.ts
│   │   └── reads-readme-document.ts
│   ├── markdown/
│   │   ├── parses-github-flavored-markdown.ts
│   │   └── observes-markdown-source-ranges.ts
│   └── hashing/
│       └── calculates-readme-content-hash.ts
│
├── runtime/
│   ├── resolves-readme-presentation-inspection-authority.ts
│   ├── executes-resolved-readme-presentation-inspection.ts
│   └── projects-readme-presentation-inspection-result.ts
│
└── proof/
    ├── fixtures/
    │   ├── complete-readme/
    │   ├── repeated-headings/
    │   ├── unsupported-html/
    │   ├── no-readme/
    │   └── unreadable-readme/
    ├── scenarios/
    ├── assertions/
    └── conformance/
```

---

# 12. Failure Model

```json
{
  "failurePolicyId": "readme-presentation-inspection-failure-policy.v1",
  "classifications": [
    {
      "when": {
        "failureCode": "README_NOT_FOUND"
      },
      "resolveAs": "complete-with-no-readme"
    },
    {
      "when": {
        "failureCode": "README_UNREADABLE"
      },
      "resolveAs": "reject-unreadable-readme"
    },
    {
      "when": {
        "failureCode": "UNSUPPORTED_ENCODING"
      },
      "resolveAs": "reject-unsupported-encoding"
    },
    {
      "when": {
        "failureCode": "MARKDOWN_PARSE_FAILED"
      },
      "resolveAs": "reject-unparsed-readme"
    },
    {
      "when": {
        "failureCode": "UNSUPPORTED_DOCUMENT_NODE"
      },
      "resolveAs": "preserve-diagnostic-and-continue"
    },
    {
      "when": {
        "failureCode": "*"
      },
      "resolveAs": "fail-unclassified"
    }
  ]
}
```

A missing README can be a legitimate deterministic result.

An unreadable README is different: the capability cannot claim a complete inspection.

---

# 13. Proof Contract

```json
{
  "proofContractId": "readme-presentation-inspection-proof.v1",
  "requiredAssertions": [
    "repository-identity-recorded",
    "repository-revision-recorded",
    "readme-resolution-disposition-recorded",
    "readme-path-recorded-when-present",
    "readme-content-hash-recorded-when-present",
    "inspection-policy-hash-recorded",
    "all-observed-document-nodes-accounted-for",
    "all-projected-assets-have-semantic-anchors",
    "asset-source-order-is-preserved",
    "unsupported-material-produces-diagnostics",
    "inventory-hash-recorded",
    "final-inspection-disposition-recorded"
  ]
}
```

## Proof dispositions

```text
README_PRESENTATION_INVENTORIED
README_PRESENTATION_PARTIALLY_INVENTORIED
README_NOT_FOUND
README_INSPECTION_REJECTED
README_INSPECTION_FAILED
```

---

# 14. Boundary Enforcement

The body contract should explicitly forbid contamination.

```json
{
  "capabilityId": "readme-presentation-inspector",
  "owns": [
    "readme-document",
    "readme-section",
    "readme-presentation-asset",
    "readme-semantic-anchor",
    "presentation-significance",
    "readme-presentation-inventory"
  ],
  "mustNotOwn": [
    "audience-profile",
    "learning-objective",
    "story-beat",
    "scene-duration",
    "browser-selector",
    "scroll-operation",
    "recording-profile",
    "narration-script"
  ]
}
```

## Conformance violations

The conveyor should reject:

```text
CSS selectors inside semantic anchors
scene durations inside presentation assets
narration text inside inventory projections
browser imports inside capability runtime
manual DTO construction inside runtime bodies
Markdown node switches inside capability bodies
silent dropping of unsupported material
unstable anchors for unchanged README content
```

---

# 15. First Vertical Slice

The first version does not need to understand every README feature.

Start with:

```text
Supported structure
├── document title
├── headings
├── paragraphs
├── lists
├── fenced code blocks
├── ASCII diagrams
└── links

Supported presentation classifications
├── capability-summary
├── purpose-explanation
├── architecture-explanation
├── architecture-diagram
├── usage-command
├── code-example
├── contract-example
└── supporting-prose
```

## First acceptance outcome

```text
Given a resolved local repository source

When README.md is inspected

Then produce:
    document identity
    ordered section inventory
    classified code blocks
    stable semantic anchors
    presentation significance
    diagnostics
    inventory hash
    inspection receipt
```

That slice is already enough to feed a manually configured walkthrough story.

---

# 16. Build Order

```text
1. README presentation inventory contract
2. Presentation asset contract
3. Semantic anchor contract
4. Inspection request contract
5. Gherkin scenarios
6. README source resolution authority
7. Markdown structural observation adapter
8. Presentation asset classification catalog
9. Semantic anchor projection
10. Presentation significance decision table
11. Inventory projection
12. Inspection proof contract
13. Three collapsed runtime bodies
14. Conformance and byte-stability tests
```

---

# 17. North Star

```text
Repository truth
      ↓
README document truth
      ↓
Presentation-material truth
      ↓
Story authority
      ↓
Scene authority
      ↓
Browser execution
```

The README Presentation Inspector should stop precisely at **presentation-material truth**.

Its public promise is:

> **I will tell you exactly what presentable material exists in this README, how it is structured, how downstream capabilities can refer to it semantically, and what evidence supports that inventory.**

That gives the repository walkthrough system a clean first content-analysis boundary: rich enough to make the README cognitively usable, but disciplined enough that it never drifts into storytelling, browser mechanics, or recording.
