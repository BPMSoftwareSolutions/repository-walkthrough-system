# Repository Walkthrough Scene Planner

The **Repository Walkthrough Scene Planner** should be a standalone deterministic micro-capability that converts a resolved walkthrough story into an ordered visual scene plan.

Its responsibility is not to operate a browser, calculate CSS selectors, record video, or generate narration. Its responsibility is:

> **Determine which visual scenes should represent the resolved walkthrough story, what each scene should communicate, which semantic repository asset it should present, and how the scenes relate in sequence.**

That preserves the boundary established for the larger repository walkthrough constellation: the Story Resolver owns communicative meaning, the Scene Planner owns visual-story meaning, and the Browser Presentation Resolver later turns those scenes into executable browser authority. 

## Implementation Status

The minimal v0.1 slice described here is implemented under
`capabilities/walkthrough-scene-planner`.

The implementation supports the five declared scene purposes, all six visual
subject kinds, the three semantic transition dispositions, resolved and
rejected outcomes, deterministic authority/plan hashing, contract validation,
and executable proof for the File System Shaper acceptance example.

Where the illustrative schemas below differ from a published upstream
contract, the implementation follows the published contract. In particular,
presentation assets are consumed from `presentationInventory.assets`;
admission and significance come from the nested `asset.presentation` object;
and concept matching uses the published asset kind, title, repository-relative
path, and semantic anchor. It does not invent the illustrative
`semanticTags` or `repositoryOrder` fields.

---

# 1. Capability Definition

```text
Capability:
    walkthrough-scene-planner

Canonical operation:
    plansRepositoryWalkthroughScenes(context)

Purpose:
    Project a resolved walkthrough story and repository
    presentation inventory into an ordered, semantically
    anchored visual scene plan.

Primary input:
    Resolved walkthrough story
    Repository presentation inventory
    Scene-planning policy

Primary output:
    Resolved repository walkthrough scene plan

Proof:
    Every required story beat is represented by an ordered,
    admissible, semantically anchored scene.
```

The capability owns the transformation:

```text
Walkthrough story
        +
Presentation inventory
        +
Scene-planning policy
        │
        ▼
Ordered walkthrough scene plan
```

It does **not** own:

```text
Browser navigation
DOM selectors
Scroll coordinates
Recording settings
Narration audio
Video timing
Frame capture
Scene observation
Recording proof
```

---

# 2. Boundary Context

```text
┌──────────────────────────────────┐
│ Walkthrough Story Resolver       │
│                                  │
│ Owns:                            │
│ • audience                       │
│ • learning objective             │
│ • story beats                    │
│ • communicative emphasis         │
└────────────────┬─────────────────┘
                 │ walkthrough story
                 ▼
┌──────────────────────────────────┐
│ REPOSITORY WALKTHROUGH           │
│ SCENE PLANNER                    │
│                                  │
│ Owns:                            │
│ • scene identity                 │
│ • scene purpose                  │
│ • visual subject                 │
│ • semantic focus                 │
│ • scene ordering                 │
│ • scene transitions              │
│ • scene coverage                 │
└────────────────┬─────────────────┘
                 │ walkthrough scene plan
                 ▼
┌──────────────────────────────────┐
│ Browser Presentation Resolver    │
│                                  │
│ Owns:                            │
│ • presentation surface           │
│ • navigation operation           │
│ • semantic-target location       │
│ • scroll and focus authority     │
│ • viewport and settlement        │
└──────────────────────────────────┘
```

The critical translation is:

```text
Story Resolver:
    “Explain why the semantic contract is authoritative.”

Scene Planner:
    “Present the semantic contract’s placement declaration
     as the visual subject of this scene.”

Browser Presentation Resolver:
    “Open this file, resolve the semantic anchor, bring it
     into view, and establish presentation focus.”
```

---

# 3. Domain Language

The Scene Planner should use a small, disciplined vocabulary.

## Owned vocabulary

```text
Walkthrough scene
Scene purpose
Story beat
Visual source
Visual subject
Semantic anchor
Focus target
Presentation intent
Scene entrance
Scene exit
Scene transition
Context continuity
Scene sequence
Scene coverage
Scene disposition
```

## Forbidden vocabulary

These terms signal contamination from downstream capabilities:

```text
CSS selector
XPath
DOM node
Playwright
Browser tab
Scroll pixels
Mouse position
Viewport coordinates
FFmpeg
Codec
Frame rate
Video file
Screenshot hash
```

The planner identifies **what should be shown**, not how a particular browser physically shows it.

---

# 4. Core Mental Model

```text
Story beat
    │
    ▼
Resolve scene purpose
    │
    ▼
Select presentation asset
    │
    ▼
Resolve visual subject
    │
    ▼
Resolve semantic focus
    │
    ▼
Resolve scene relationship
    │
    ▼
Order scene
    │
    ▼
Project scene plan
```

The distinction between a **presentation asset** and a **scene** matters.

```text
Presentation asset:
    Something available to show.

Walkthrough scene:
    A declared use of that asset to communicate
    one specific part of the story.
```

The same asset may appear in multiple scenes under different purposes:

```text
README architecture section
    ├── Scene: introduce the system boundary
    └── Scene: revisit the dependency flow

Execution receipt
    ├── Scene: demonstrate the resulting proof
    └── Scene: conclude with verified execution
```

---

# 5. Capability Architecture

```text
┌──────────────── REPOSITORY WALKTHROUGH SCENE PLANNER ────────────────┐
│                                                                      │
│  Walkthrough Story                                                   │
│  Presentation Inventory                                              │
│  Scene-Planning Policy                                               │
│              │                                                       │
│              ▼                                                       │
│  ┌────────────────────────────┐                                      │
│  │ Scene Planning Request     │                                      │
│  │ Validator                  │                                      │
│  └──────────────┬─────────────┘                                      │
│                 ▼                                                    │
│  ┌────────────────────────────┐                                      │
│  │ Story Beat Scene Resolver  │                                      │
│  └──────────────┬─────────────┘                                      │
│                 ▼                                                    │
│  ┌────────────────────────────┐                                      │
│  │ Presentation Asset         │                                      │
│  │ Selector                   │                                      │
│  └──────────────┬─────────────┘                                      │
│                 ▼                                                    │
│  ┌────────────────────────────┐                                      │
│  │ Visual Subject Resolver    │                                      │
│  └──────────────┬─────────────┘                                      │
│                 ▼                                                    │
│  ┌────────────────────────────┐                                      │
│  │ Scene Focus Resolver       │                                      │
│  └──────────────┬─────────────┘                                      │
│                 ▼                                                    │
│  ┌────────────────────────────┐                                      │
│  │ Scene Transition Resolver  │                                      │
│  └──────────────┬─────────────┘                                      │
│                 ▼                                                    │
│  ┌────────────────────────────┐                                      │
│  │ Scene Sequence Resolver    │                                      │
│  └──────────────┬─────────────┘                                      │
│                 ▼                                                    │
│  ┌────────────────────────────┐                                      │
│  │ Scene Coverage Evaluator   │                                      │
│  └──────────────┬─────────────┘                                      │
│                 ▼                                                    │
│  ┌────────────────────────────┐                                      │
│  │ Walkthrough Scene Plan     │                                      │
│  │ Projector                  │                                      │
│  └──────────────┬─────────────┘                                      │
│                 ▼                                                    │
│       Repository Walkthrough Scene Plan                              │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

These are semantic responsibilities, not necessarily large authored classes.

The runtime body should remain collapsed because the engineering standard requires decisions, DTO shaping, iteration, effects, and proof requirements to be declared above the projection boundary. 

---

# 6. Recommended Micro-Components

I would establish **nine bounded semantic micro-components**.

|  # | Component                        | Question answered                                                     |
| -: | -------------------------------- | --------------------------------------------------------------------- |
|  1 | Scene Planning Request Validator | Is the request complete and admissible?                               |
|  2 | Story Beat Scene Resolver        | What kind of visual scene represents this beat?                       |
|  3 | Presentation Asset Selector      | Which available asset best supports the beat?                         |
|  4 | Visual Subject Resolver          | What semantic object within the asset should be shown?                |
|  5 | Scene Focus Resolver             | What should the viewer’s attention be directed toward?                |
|  6 | Scene Transition Resolver        | How should context enter and leave the scene?                         |
|  7 | Scene Sequence Resolver          | In what order should the scenes appear?                               |
|  8 | Scene Coverage Evaluator         | Does every required story beat have sufficient visual representation? |
|  9 | Scene Plan Projector             | How is the complete resolved plan represented canonically?            |

## Why these boundaries work

```text
Scene kind
    is not asset selection.

Asset selection
    is not semantic focus.

Semantic focus
    is not browser location.

Scene ordering
    is not transition meaning.

Scene coverage
    is not execution proof.
```

Each introduces independently governable meaning.

---

# 7. Canonical Intent IR

```json
{
  "$schema": "./repository-walkthrough-scene-planner.intent-ir.schema.v1.json",
  "capabilityId": "repository-walkthrough-scene-planner",
  "title": "Plan repository walkthrough scenes",
  "purpose": "Project a resolved walkthrough story and repository presentation inventory into an ordered visual scene plan.",
  "actor": "authorized-walkthrough-harness",
  "trigger": "a resolved walkthrough story is submitted with its presentation inventory",
  "desiredOutcome": "every required story beat is represented by an admissible and semantically anchored walkthrough scene",
  "constraints": [
    "the planner must not emit browser selectors or platform-specific navigation instructions",
    "every scene must reference an admitted presentation asset",
    "every required story beat must have declared visual coverage",
    "scene ordering must be resolved before browser presentation authority is requested",
    "no scene may invent repository material absent from the presentation inventory"
  ],
  "featureIds": [
    "plan-repository-walkthrough-scenes"
  ]
}
```

---

# 8. Canonical Gherkin

```gherkin
Feature: Plan repository walkthrough scenes

  Background:
    Given a resolved repository walkthrough story
    And a repository presentation inventory
    And an authorized scene-planning policy

  Scenario: Project each required story beat into an ordered visual scene
    Given every required story beat has at least one admissible presentation asset
    When repository walkthrough scenes are planned
    Then every required story beat is represented by at least one scene
    And every scene references an admitted presentation asset
    And every scene declares a visual subject
    And every scene declares a presentation intent
    And the scenes are returned in resolved narrative order
    And a scene-planning receipt is produced

  Scenario: Reject a story beat with no admissible presentation asset
    Given a required story beat has no admissible presentation asset
    When repository walkthrough scenes are planned
    Then the scene plan is rejected
    And the unsupported story beat is identified
    And no browser presentation authority is produced
    And a scene-planning receipt is produced

  Scenario: Preserve semantic targeting without browser contamination
    Given a story beat references a document section
    When its scene is planned
    Then the scene identifies the document and semantic anchor
    And the scene does not contain a CSS selector
    And the scene does not contain an XPath expression
    And the scene does not contain scroll coordinates

  Scenario: Reuse one presentation asset for distinct story purposes
    Given two story beats require different explanations of the same presentation asset
    When repository walkthrough scenes are planned
    Then two distinct scenes may reference the same asset
    And each scene declares its own purpose
    And each scene declares its own semantic focus

  Scenario: Reject incomplete required story coverage
    Given at least one required story beat has no resolved scene
    When scene coverage is evaluated
    Then the walkthrough scene plan is rejected
    And the missing story coverage is reported
```

---

# 9. Input Contract

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "repository-walkthrough-scene-planning-request.schema.v1.json",
  "title": "Repository Walkthrough Scene Planning Request",
  "type": "object",
  "required": [
    "requestId",
    "story",
    "presentationInventory",
    "planningPolicy"
  ],
  "properties": {
    "requestId": {
      "type": "string",
      "minLength": 1
    },
    "story": {
      "$ref": "./repository-walkthrough-story.schema.v1.json"
    },
    "presentationInventory": {
      "$ref": "./repository-presentation-inventory.schema.v1.json"
    },
    "planningPolicy": {
      "$ref": "./scene-planning-policy.schema.v1.json"
    }
  },
  "additionalProperties": false
}
```

---

# 10. Scene Contract

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "repository-walkthrough-scene.schema.v1.json",
  "title": "Repository Walkthrough Scene",
  "type": "object",
  "required": [
    "sceneId",
    "storyBeatId",
    "sequence",
    "purpose",
    "visualSource",
    "visualSubject",
    "presentationIntent",
    "entrance",
    "exit"
  ],
  "properties": {
    "sceneId": {
      "type": "string"
    },
    "storyBeatId": {
      "type": "string"
    },
    "sequence": {
      "type": "integer",
      "minimum": 1
    },
    "purpose": {
      "type": "string",
      "enum": [
        "introduce-capability",
        "establish-problem",
        "present-architecture",
        "explain-semantic-authority",
        "show-contract",
        "show-execution-body",
        "demonstrate-operation",
        "show-proof",
        "summarize-outcome",
        "conclude-walkthrough"
      ]
    },
    "visualSource": {
      "type": "object",
      "required": [
        "assetId"
      ],
      "properties": {
        "assetId": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "visualSubject": {
      "type": "object",
      "required": [
        "kind",
        "semanticAnchor"
      ],
      "properties": {
        "kind": {
          "type": "string",
          "enum": [
            "document",
            "document-section",
            "document-fragment",
            "diagram",
            "source-file",
            "source-fragment",
            "semantic-contract",
            "gherkin-scenario",
            "execution-receipt",
            "proof-finding",
            "repository-structure"
          ]
        },
        "semanticAnchor": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "presentationIntent": {
      "type": "string",
      "enum": [
        "establish",
        "orient",
        "focus",
        "compare",
        "trace",
        "demonstrate",
        "verify",
        "recap"
      ]
    },
    "entrance": {
      "$ref": "./scene-transition.schema.v1.json"
    },
    "exit": {
      "$ref": "./scene-transition.schema.v1.json"
    },
    "continuityGroup": {
      "type": [
        "string",
        "null"
      ]
    }
  },
  "additionalProperties": false
}
```

Notice what is absent:

```text
selector
xpath
pixel
scrollTop
viewportWidth
playwrightAction
browserUrl
```

That absence is a boundary feature.

---

# 11. Scene Plan Contract

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "repository-walkthrough-scene-plan.schema.v1.json",
  "title": "Repository Walkthrough Scene Plan",
  "type": "object",
  "required": [
    "planId",
    "storyId",
    "repositoryId",
    "scenes",
    "coverage",
    "disposition"
  ],
  "properties": {
    "planId": {
      "type": "string"
    },
    "storyId": {
      "type": "string"
    },
    "repositoryId": {
      "type": "string"
    },
    "scenes": {
      "type": "array",
      "minItems": 1,
      "items": {
        "$ref": "./repository-walkthrough-scene.schema.v1.json"
      }
    },
    "coverage": {
      "type": "object",
      "required": [
        "requiredStoryBeatCount",
        "coveredStoryBeatCount",
        "uncoveredStoryBeatIds"
      ],
      "properties": {
        "requiredStoryBeatCount": {
          "type": "integer",
          "minimum": 0
        },
        "coveredStoryBeatCount": {
          "type": "integer",
          "minimum": 0
        },
        "uncoveredStoryBeatIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "additionalProperties": false
    },
    "disposition": {
      "type": "string",
      "enum": [
        "SCENE_PLAN_RESOLVED",
        "SCENE_PLAN_REJECTED",
        "SCENE_PLAN_INCOMPLETE"
      ]
    }
  },
  "additionalProperties": false
}
```

---

# 12. Scene-Kind Decision Authority

Scene-kind resolution belongs in SEJ rather than a runtime `switch`.

```json
{
  "decisionId": "resolve-repository-walkthrough-scene-kind",
  "inputs": [
    "storyBeat.purpose",
    "storyBeat.concept",
    "availableAssetKinds"
  ],
  "rules": [
    {
      "when": {
        "storyBeat.purpose": "introduce-capability"
      },
      "then": "capability-introduction-scene"
    },
    {
      "when": {
        "storyBeat.purpose": "explain-architecture",
        "availableAssetKinds": {
          "contains": "diagram"
        }
      },
      "then": "architecture-diagram-scene"
    },
    {
      "when": {
        "storyBeat.purpose": "explain-semantic-contract",
        "availableAssetKinds": {
          "contains": "semantic-contract"
        }
      },
      "then": "semantic-contract-scene"
    },
    {
      "when": {
        "storyBeat.purpose": "show-collapsed-execution-body",
        "availableAssetKinds": {
          "contains": "source-file"
        }
      },
      "then": "source-execution-scene"
    },
    {
      "when": {
        "storyBeat.purpose": "show-execution-proof",
        "availableAssetKinds": {
          "contains": "execution-receipt"
        }
      },
      "then": "execution-proof-scene"
    },
    {
      "when": {
        "*": true
      },
      "then": "unsupported-story-beat-scene"
    }
  ]
}
```

---

# 13. Asset Selection Authority

```json
{
  "decisionId": "select-presentation-asset-for-story-beat",
  "inputs": [
    "storyBeat.requiredConcepts",
    "asset.kind",
    "asset.semanticTags",
    "asset.presentability",
    "asset.significance"
  ],
  "selection": {
    "collection": "$.presentationInventory.presentationAssets",
    "eligibleWhen": [
      {
        "path": "$.asset.presentability",
        "in": [
          "recommended",
          "admissible"
        ]
      },
      {
        "path": "$.asset.semanticTags",
        "containsAnyFrom": "$.storyBeat.requiredConcepts"
      }
    ],
    "orderBy": [
      {
        "field": "asset.significance",
        "direction": "descending"
      },
      {
        "field": "asset.repositoryOrder",
        "direction": "ascending"
      }
    ],
    "select": "first",
    "emptyDisposition": "reject-missing-presentation-asset"
  }
}
```

The runtime should not search the inventory manually.

It invokes the declared selection authority.

---

# 14. Scene Transition Authority

Transitions should be semantic, not animation instructions.

```json
{
  "decisionId": "resolve-scene-transition",
  "inputs": [
    "previousScene.visualSource.assetId",
    "currentScene.visualSource.assetId",
    "previousScene.continuityGroup",
    "currentScene.continuityGroup"
  ],
  "rules": [
    {
      "when": {
        "previousScene.visualSource.assetId": {
          "equals": "$currentScene.visualSource.assetId"
        }
      },
      "then": "retain-source-change-focus"
    },
    {
      "when": {
        "previousScene.continuityGroup": {
          "equals": "$currentScene.continuityGroup"
        }
      },
      "then": "preserve-context"
    },
    {
      "when": {
        "*": true
      },
      "then": "establish-new-source"
    }
  ]
}
```

The downstream Browser Presentation Resolver can interpret:

```text
retain-source-change-focus
preserve-context
establish-new-source
```

into platform-specific browser operations.

---

# 15. Semantic Iteration Authority

Story-beat iteration should be declared rather than authored as a capability loop.

```json
{
  "iterationId": "plan-scenes-for-required-story-beats",
  "collection": "$.story.beats",
  "filter": {
    "path": "$.required",
    "equals": true
  },
  "order": {
    "field": "sequence",
    "direction": "ascending"
  },
  "forEach": {
    "invoke": "resolve-scene-for-story-beat"
  },
  "collect": {
    "projection": "collect-resolved-walkthrough-scenes"
  },
  "stopWhen": [
    "blocking-scene-planning-finding"
  ]
}
```

This follows the deterministic engineering rule that iteration meaning belongs in semantic authority while the generic runtime performs the mechanics. 

---

# 16. Resolved Scene-Planning Authority

Before the scene-planning body executes, it should receive or obtain a complete authority object.

```json
{
  "authorityType": "resolved-repository-walkthrough-scene-planning.v1",
  "planningId": "plan-file-system-shaper-walkthrough",
  "storyId": "explain-file-system-shaper",
  "repositoryId": "file-system-shaper",
  "operations": [
    {
      "sequence": 1,
      "operation": "validate-scene-planning-request",
      "contractId": "repository-walkthrough-scene-planning-request.v1"
    },
    {
      "sequence": 2,
      "operation": "plan-required-story-beat-scenes",
      "iterationId": "plan-scenes-for-required-story-beats"
    },
    {
      "sequence": 3,
      "operation": "resolve-scene-transitions",
      "iterationId": "resolve-transitions-between-scenes"
    },
    {
      "sequence": 4,
      "operation": "evaluate-scene-coverage",
      "decisionId": "evaluate-required-story-beat-coverage"
    },
    {
      "sequence": 5,
      "operation": "project-scene-plan",
      "projectionId": "project-repository-walkthrough-scene-plan"
    },
    {
      "sequence": 6,
      "operation": "validate-scene-plan",
      "contractId": "repository-walkthrough-scene-plan.v1"
    }
  ],
  "failurePolicyId": "repository-walkthrough-scene-planning-failure-policy",
  "proofContractId": "repository-walkthrough-scene-planning-proof.v1"
}
```

Nothing remains for the code body to interpret.

---

# 17. Collapsed Runtime Bodies

## Resolve authority

```typescript
export async function resolvesRepositoryWalkthroughScenePlanningAuthority(
  context: RepositoryWalkthroughScenePlanningContext
): Promise<ResolvedRepositoryWalkthroughScenePlanningAuthority> {
  return edges.invokes(
    "resolve-repository-walkthrough-scene-planning-authority",
    context
  );
}
```

## Execute authority

```typescript
export async function executesResolvedRepositoryWalkthroughScenePlanning(
  context: ResolvedRepositoryWalkthroughScenePlanningAuthority
): Promise<ExecutedRepositoryWalkthroughScenePlanning> {
  return edges.invokes(
    "execute-resolved-repository-walkthrough-scene-planning",
    context
  );
}
```

## Project result

```typescript
export function projectsRepositoryWalkthroughScenePlan(
  context: ExecutedRepositoryWalkthroughScenePlanning
): RepositoryWalkthroughScenePlanningResult {
  return edges.projects(
    "project-repository-walkthrough-scene-planning-result",
    context
  );
}
```

## Public operation

```typescript
export async function plansRepositoryWalkthroughScenes(
  context: RepositoryWalkthroughScenePlanningContext
): Promise<RepositoryWalkthroughScenePlanningResult> {
  const authority =
    await resolvesRepositoryWalkthroughScenePlanningAuthority(context);

  const execution =
    await executesResolvedRepositoryWalkthroughScenePlanning(authority);

  return projectsRepositoryWalkthroughScenePlan(execution);
}
```

The public body contains:

```text
Resolve
Execute
Project
Return
```

It contains no:

```text
if
switch
loop
asset search
object stitching
transition calculation
browser operation
```

---

# 18. Example Scene Plan

```json
{
  "planId": "file-system-shaper-walkthrough-scenes-v1",
  "storyId": "explain-file-system-shaper",
  "repositoryId": "file-system-shaper",
  "scenes": [
    {
      "sceneId": "introduce-file-system-shaper",
      "storyBeatId": "introduce-capability",
      "sequence": 1,
      "purpose": "introduce-capability",
      "visualSource": {
        "assetId": "readme-title-and-purpose"
      },
      "visualSubject": {
        "kind": "document-section",
        "semanticAnchor": "purpose"
      },
      "presentationIntent": "establish",
      "entrance": {
        "disposition": "establish-new-source"
      },
      "exit": {
        "disposition": "preserve-context"
      },
      "continuityGroup": "capability-introduction"
    },
    {
      "sceneId": "show-file-system-shape-architecture",
      "storyBeatId": "explain-architecture",
      "sequence": 2,
      "purpose": "present-architecture",
      "visualSource": {
        "assetId": "file-system-shaper-architecture-diagram"
      },
      "visualSubject": {
        "kind": "diagram",
        "semanticAnchor": "resolver-executor-proof-flow"
      },
      "presentationIntent": "trace",
      "entrance": {
        "disposition": "establish-new-source"
      },
      "exit": {
        "disposition": "preserve-context"
      },
      "continuityGroup": "architecture"
    },
    {
      "sceneId": "show-placement-semantic-contract",
      "storyBeatId": "explain-semantic-contract",
      "sequence": 3,
      "purpose": "explain-semantic-authority",
      "visualSource": {
        "assetId": "file-system-shape-contract"
      },
      "visualSubject": {
        "kind": "semantic-contract",
        "semanticAnchor": "placements"
      },
      "presentationIntent": "focus",
      "entrance": {
        "disposition": "establish-new-source"
      },
      "exit": {
        "disposition": "retain-source-change-focus"
      },
      "continuityGroup": "semantic-authority"
    },
    {
      "sceneId": "show-collapsed-shaping-body",
      "storyBeatId": "show-collapsed-execution-body",
      "sequence": 4,
      "purpose": "show-execution-body",
      "visualSource": {
        "assetId": "shapes-file-system-source"
      },
      "visualSubject": {
        "kind": "source-fragment",
        "semanticAnchor": "shapesFileSystem"
      },
      "presentationIntent": "demonstrate",
      "entrance": {
        "disposition": "establish-new-source"
      },
      "exit": {
        "disposition": "preserve-context"
      },
      "continuityGroup": "execution"
    },
    {
      "sceneId": "show-file-shaping-proof",
      "storyBeatId": "show-execution-proof",
      "sequence": 5,
      "purpose": "show-proof",
      "visualSource": {
        "assetId": "file-system-shaping-receipt"
      },
      "visualSubject": {
        "kind": "execution-receipt",
        "semanticAnchor": "verified-operations"
      },
      "presentationIntent": "verify",
      "entrance": {
        "disposition": "establish-new-source"
      },
      "exit": {
        "disposition": "conclude-story"
      },
      "continuityGroup": "proof"
    }
  ],
  "coverage": {
    "requiredStoryBeatCount": 5,
    "coveredStoryBeatCount": 5,
    "uncoveredStoryBeatIds": []
  },
  "disposition": "SCENE_PLAN_RESOLVED"
}
```

---

# 19. Failure Policy

```json
{
  "failurePolicyId": "repository-walkthrough-scene-planning-failure-policy",
  "classifications": [
    {
      "when": {
        "failureCode": "STORY_BEAT_HAS_NO_PRESENTATION_ASSET"
      },
      "resolveAs": "reject-missing-presentation-asset"
    },
    {
      "when": {
        "failureCode": "PRESENTATION_ASSET_NOT_ADMITTED"
      },
      "resolveAs": "reject-unrecognized-presentation-asset"
    },
    {
      "when": {
        "failureCode": "REQUIRED_STORY_BEAT_NOT_COVERED"
      },
      "resolveAs": "reject-incomplete-story-coverage"
    },
    {
      "when": {
        "failureCode": "SCENE_CONTAINS_BROWSER_MECHANICS"
      },
      "resolveAs": "reject-boundary-contamination"
    },
    {
      "when": {
        "failureCode": "AMBIGUOUS_SCENE_SEQUENCE"
      },
      "resolveAs": "reject-ambiguous-scene-order"
    },
    {
      "when": {
        "failureCode": "*"
      },
      "resolveAs": "fail-unclassified-scene-planning"
    }
  ]
}
```

No fallback should silently choose some arbitrary repository file.

Missing visual authority is a blocking signal.

---

# 20. Proof Contract

```json
{
  "proofContractId": "repository-walkthrough-scene-planning-proof.v1",
  "requiredAssertions": [
    "request-identity-recorded",
    "walkthrough-story-hash-recorded",
    "presentation-inventory-hash-recorded",
    "scene-planning-authority-hash-recorded",
    "every-required-story-beat-evaluated",
    "every-scene-references-an-admitted-presentation-asset",
    "every-scene-declares-a-semantic-anchor",
    "every-scene-declares-a-presentation-intent",
    "scene-sequences-are-contiguous-and-unique",
    "required-story-coverage-evaluated",
    "browser-specific-mechanics-absent",
    "scene-plan-contract-validated",
    "final-disposition-recorded"
  ]
}
```

Example receipt:

```json
{
  "receiptType": "repository-walkthrough-scene-planning-receipt.v1",
  "runId": "scene-plan-run-01",
  "planId": "file-system-shaper-walkthrough-scenes-v1",
  "storyHash": "sha256:story123",
  "presentationInventoryHash": "sha256:inventory456",
  "authorityHash": "sha256:authority789",
  "scenePlanHash": "sha256:plan321",
  "requiredStoryBeatCount": 5,
  "coveredStoryBeatCount": 5,
  "sceneCount": 5,
  "boundaryContaminationFindings": [],
  "findings": [],
  "disposition": "SCENE_PLAN_PROVEN"
}
```

---

# 21. Repository File-System Body

```text
repository-walkthrough-scene-planner/
├── README.md
│
├── intent/
│   ├── repository-walkthrough-scene-planner.intent-ir.v1.json
│   └── repository-walkthrough-scene-planner.intent-ir.schema.v1.json
│
├── features/
│   └── plan-repository-walkthrough-scenes.feature
│
├── architecture/
│   ├── repository-walkthrough-scene-planner.ascii.md
│   ├── scene-planning-execution-flow.ascii.md
│   ├── boundary-context.ascii.md
│   └── scene-plan-contract-map.ascii.md
│
├── semantic-authority/
│   ├── validate-scene-planning-request/
│   │   └── validates-scene-planning-request.sej.v1.json
│   │
│   ├── resolve-story-beat-scene/
│   │   └── resolves-story-beat-scene-kind.sej.v1.json
│   │
│   ├── select-presentation-asset/
│   │   └── selects-presentation-asset-for-story-beat.sej.v1.json
│   │
│   ├── resolve-visual-subject/
│   │   └── resolves-scene-visual-subject.sej.v1.json
│   │
│   ├── resolve-scene-focus/
│   │   └── resolves-scene-presentation-focus.sej.v1.json
│   │
│   ├── resolve-scene-transition/
│   │   └── resolves-scene-transition.sej.v1.json
│   │
│   ├── order-walkthrough-scenes/
│   │   └── orders-repository-walkthrough-scenes.sej.v1.json
│   │
│   ├── evaluate-scene-coverage/
│   │   └── evaluates-required-story-beat-coverage.sej.v1.json
│   │
│   ├── execution/
│   │   └── repository-walkthrough-scene-planning-execution-model.sej.v1.json
│   │
│   ├── failures/
│   │   └── repository-walkthrough-scene-planning-failure-policy.sej.v1.json
│   │
│   ├── proof/
│   │   └── repository-walkthrough-scene-planning-proof.sej.v1.json
│   │
│   └── project-scene-plan/
│       ├── projects-repository-walkthrough-scene.sej.v1.json
│       └── projects-repository-walkthrough-scene-plan.sej.v1.json
│
├── contracts/
│   ├── repository-walkthrough-scene-planning-request.schema.v1.json
│   ├── scene-planning-policy.schema.v1.json
│   ├── repository-walkthrough-scene.schema.v1.json
│   ├── scene-transition.schema.v1.json
│   ├── resolved-scene-planning-authority.schema.v1.json
│   ├── repository-walkthrough-scene-plan.schema.v1.json
│   └── repository-walkthrough-scene-planning-receipt.schema.v1.json
│
├── runtime/
│   ├── resolves-repository-walkthrough-scene-planning-authority.ts
│   ├── executes-resolved-repository-walkthrough-scene-planning.ts
│   ├── projects-repository-walkthrough-scene-plan.ts
│   └── plans-repository-walkthrough-scenes.ts
│
├── adapters/
│   └── none-required-for-v0.1.md
│
├── proof/
│   ├── fixtures/
│   │   ├── valid-file-system-shaper-story.json
│   │   ├── valid-file-system-shaper-presentation-inventory.json
│   │   ├── story-with-missing-presentation-asset.json
│   │   └── contaminated-scene-plan.json
│   │
│   ├── scenarios/
│   ├── assertions/
│   └── conformance/
│
└── package.json
```

An important characteristic of this capability is that **v0.1 may require no external adapter at all**. It is primarily a semantic resolver and projector over canonical JSON contracts.

---

# 22. Body Contract Boundary Rules

```json
{
  "capabilityId": "repository-walkthrough-scene-planner",
  "owns": [
    "walkthrough-scene",
    "scene-purpose",
    "visual-source",
    "visual-subject",
    "semantic-anchor",
    "presentation-intent",
    "scene-transition",
    "scene-sequence",
    "scene-coverage"
  ],
  "mustNotOwn": [
    "browser-selector",
    "xpath",
    "scroll-coordinate",
    "viewport-dimension",
    "browser-session",
    "recording-profile",
    "video-codec",
    "frame-rate",
    "screenshot",
    "scene-observation",
    "recording-proof"
  ],
  "publicInputContracts": [
    "repository-walkthrough-story.v1",
    "repository-presentation-inventory.v1",
    "scene-planning-policy.v1"
  ],
  "publicOutputContract": "repository-walkthrough-scene-plan.v1"
}
```

The `mustNotOwn` declarations give the conveyor a direct way to detect semantic contamination.

---

# 23. Minimal v0.1 Slice

The first implementation should avoid trying to solve every possible scene type.

Support five scene purposes:

```text
1. Introduce capability
2. Present architecture
3. Explain semantic contract
4. Show collapsed execution body
5. Show execution proof
```

Support six visual subject kinds:

```text
document-section
diagram
semantic-contract
source-fragment
gherkin-scenario
execution-receipt
```

Support three transition dispositions:

```text
establish-new-source
retain-source-change-focus
preserve-context
```

Support two result dispositions:

```text
SCENE_PLAN_RESOLVED
SCENE_PLAN_REJECTED
```

That is enough to plan a complete first walkthrough for File System Shaper, Response Normalizer, JSON Output Validator, or the Generic LLM Connector.

---

# 24. Build Order

```text
1. Scene plan output contract
2. Individual scene contract
3. Scene-planning request contract
4. Core Gherkin scenarios
5. Story-beat-to-scene-kind decision catalog
6. Presentation-asset selection authority
7. Visual-subject projection
8. Scene ordering authority
9. Scene-transition authority
10. Scene-coverage evaluator
11. Proof contract
12. Three collapsed runtime bodies
13. Public operation
14. Conformance rules
```

The first acceptance target should be:

> Given the File System Shaper walkthrough story and presentation inventory, produce a contract-valid five-scene plan with complete story-beat coverage and no browser-specific mechanics.

---

# 25. Architectural North Star

```text
Story says what must be communicated.

Scene plan says what must be visually presented.

Browser authority says how it will be presented.

Execution testimony says what occurred.

Scene observation says what was visible.

Recording proof says what can be truthfully claimed.
```

So the Scene Planner’s final identity is:

> **A deterministic semantic projector that transforms communicative story authority into ordered visual-scene authority without leaking browser or recording mechanics into the scene domain.**

That gives us a clean, reusable capability that can eventually plan scenes not only for repository browser walkthroughs, but also terminal demonstrations, slide walkthroughs, architecture diagrams, desktop applications, and proof dashboards—without changing the fundamental scene language.
