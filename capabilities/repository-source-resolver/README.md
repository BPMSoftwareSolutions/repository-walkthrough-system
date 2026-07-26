# Repository Source Resolver

## Owned outcome

Produce one immutable, authorized repository source.

## Published contract

`contracts/resolved-repository-source.schema.v1.json`

## Domain language

- repository reference
- repository provider
- repository identity
- revision
- branch
- tag
- commit
- presentation entrypoint
- authorization
- source disposition

## Semantic exclusions

- scene
- narration
- scroll
- browser
- recording
- frame
- video

## Dependencies

- None

## Maturity

Implemented first slice:

- public `github.com` HTTPS repository references;
- default branch, explicit branch, explicit tag, and full commit resolution;
- immutable 40-character commit output;
- README, repository-root, and repository-relative presentation entrypoints;
- deterministic fail-closed dispositions;
- credential-free resolution receipts and canonical authority hashes.

GitLab, local repositories, private repositories, credential brokerage, and
repository materialization remain deferred.

## Verification

From the repository root:

```text
npm test
```

The capability suite compiles the TypeScript projection, executes deterministic
port-backed scenarios, and validates successful output against the published
JSON contracts. The root scaffold check still proves structure and JSON
readability only.
