# Walkthrough Scene Planner

## Owned outcome

Project a resolved walkthrough story and repository presentation inventory into
an ordered, semantically anchored scene plan.

## Published contract

`contracts/walkthrough-scene-plan.schema.v1.json`

## Domain language

- scene
- visual source
- visual subject
- scene purpose
- entrance
- presentation state
- focus target
- exit
- scene sequence
- scene transition

## Semantic exclusions

- Playwright
- CSS selector
- physical scrolling
- video codec

## Dependencies

- `walkthrough-story-resolver` through
  `contracts/walkthrough-story.schema.v1.json`
- `repository-presentation-inspector` through
  `contracts/repository-presentation-inventory.schema.v1.json`

## First executable slice

The implemented slice resolves five required story-beat purposes:

1. introduce a capability;
2. present architecture;
3. explain semantic authority;
4. show a collapsed execution body;
5. show execution proof.

It selects only admitted inventory assets, projects semantic visual subjects,
orders scenes by declared story sequence, resolves semantic transitions,
evaluates required-beat coverage, and produces deterministic plan and authority
hashes with a proof receipt.

No external adapter is required. The capability is a deterministic projection
over immutable JSON testimony.

## Commands

```text
npm run build
npm test
```

## Maturity

Implemented first slice. Executable proof covers the File System Shaper
five-scene acceptance path, missing-asset rejection, asset reuse, deterministic
replay, published-schema conformance, boundary purity, and collapsed runtime
bodies.
