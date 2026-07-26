# Agent Operating Contract

## Read before changing anything

1. `README.md`
2. `docs/engineering-standard.md`
3. `architecture/capability-context-map.ascii.md`
4. `capability-authority/repository-walkthrough-system-body.v1.json`
5. The target capability's `README.md`, `AGENTS.md`, intent, and feature

## Source-of-truth order

1. Canonical intent
2. Gherkin scenarios
3. Semantic authority
4. Published JSON contracts
5. Resolved execution authority
6. Runtime and adapter mechanics
7. Proof and receipts

When these disagree, do not silently make runtime code authoritative. Repair
the higher authority first or record the unresolved conflict.

## Boundary rules

- Work in one capability unless a published contract must change.
- Treat every capability as independently releasable and provable.
- Depend on another capability through `contracts/`, never its runtime,
  adapter, proof fixture, or semantic-authority file.
- Keep provider, browser, operating-system, and library details in adapters.
- Keep domain decisions, ordering, retry, failure disposition, DTO mappings,
  state transitions, and proof requirements in semantic authority.
- Keep runtime bodies collapsed to resolve, execute, project, and return.
- Do not add a shared domain model that merges capability vocabularies.
- Do not make the harness interpret provider-specific results.

## Change sequence

For behavior changes, update artifacts in this order:

1. intent when the owned outcome changes;
2. feature scenarios;
3. responsibilities and semantic authority;
4. contracts;
5. runtime or adapters;
6. proof fixtures, assertions, and conformance;
7. architecture documentation.

## Handoff requirements

Report:

- capability and scenario changed;
- semantic authority added or changed;
- public contracts changed;
- effects and adapters introduced;
- proof produced;
- commands run and their results;
- remaining promotion gates.

Run `npm test` from the repository root. A green scaffold check proves
structure and JSON readability only; it does not prove capability behavior.
