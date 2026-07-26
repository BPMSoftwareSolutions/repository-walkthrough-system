# Repository Presentation Inspector

The **Repository Presentation Inspector** is the deterministic capability that converts an authorized repository source into a structured inventory of material that can be presented, explained, demonstrated, or used to construct a walkthrough.

## Implemented first slice

Given a resolved local repository source, the inspector observes and inventories:

- `README.md` and `docs/**/*.md`;
- `features/**/*.feature`;
- `semantic-authority/**/*.json`;
- `contracts/**/*.json`;
- `src/**/*.ts` and `runtime/**/*.ts`.

It extracts stable units for Markdown headings, code blocks, ASCII diagrams,
Gherkin features and scenarios, semantic identities, JSON schema identities,
exported TypeScript operations, and collapsed execution bodies. Unsupported
artifacts are preserved as findings.

## Public operation

```text
inspectsRepositoryPresentation(context)
  -> repository-presentation-inspection-result.v1
```

The public body is a linear resolve, execute, project, and return witness.
Artifact policy, presentation classification, significance, readiness,
ordering, failure disposition, and proof requirements are declared in
`semantic-authority/`.

## Boundary

This capability owns presentable-material truth. It does not choose a story,
scene, narration, browser movement, or recording behavior. It consumes
resolved source testimony and publishes
`contracts/repository-presentation-inventory.schema.v1.json`.

## Verification

```text
npm run test --workspace @repository-walkthrough/repository-presentation-inspector
npm test
```

The targeted suite proves the five canonical scenarios, contract conformance,
canonical ordering and hashing, proof completeness, and collapsed body shape.
