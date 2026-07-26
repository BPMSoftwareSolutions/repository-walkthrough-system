# Repository Walkthrough System

Repository Walkthrough Recording is a composed system capability delivered by
independently governed deterministic capabilities.

This repository follows the Deterministic Micro-Capability Engineering
Standard maintained in the BPM intelligence standards repository.
Canonical intent and semantic authority are the source of truth.
Language-specific code bodies contain execution mechanics only. Decisions, DTO
shaping, control flow, ports, effects, and proof requirements are governed
through language-neutral semantic contracts.

## System outcome

Given an authorized repository source, presentation intent, and a recording
profile, produce a repository walkthrough recording whose declared scenes,
captured artifact, and conformance can be proven.

## Capability constellation

| Capability | Truth it owns |
| --- | --- |
| `repository-source-resolver` | Repository identity and revision |
| `repository-presentation-inspector` | Presentable repository material |
| `walkthrough-story-resolver` | Educational narrative |
| `walkthrough-scene-planner` | Visual story |
| `browser-presentation-resolver` | Browser presentation authority |
| `browser-walkthrough-executor` | Browser execution testimony |
| `screen-recording-controller` | Captured-media testimony |
| `walkthrough-scene-observer` | Visual-observation testimony |
| `recording-proof-builder` | Recording conformance truth |
| `repository-walkthrough-harness` | Composition between published contracts |

The root owns system intent, composition authority, system contracts, and
cross-capability conformance. Capability implementations live under
`capabilities/` and may depend only on published contracts.

## Start here

1. Read [`AGENTS.md`](AGENTS.md).
2. Choose one work packet in
   [`docs/agent-work-plan.md`](docs/agent-work-plan.md).
3. Read that capability's `README.md`, `AGENTS.md`, intent, and feature.
4. Expand semantic authority and contracts before adding runtime mechanics.
5. Run `npm test` before handing work off.

## Scaffold commands

```text
npm run scaffold:check
npm test
```

`npm run scaffold:generate` is idempotent and only creates missing scaffold
files. It never overwrites an existing capability artifact.

## Maturity

This is an architecture scaffold, not an implemented recorder. Contracts and
semantic catalogs are marked `scaffold`; they must not be treated as
promotion-ready until the quality gates in `docs/engineering-standard.md` are
satisfied.
