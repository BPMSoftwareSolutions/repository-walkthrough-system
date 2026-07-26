# ADR 0002: Structural conformance is not behavioral proof

Status: Accepted for scaffold

## Context

An empty directory tree can appear complete while containing no executable
semantic authority or proof.

## Decision

All generated semantic catalogs and contracts carry a `scaffold` status.
`npm test` initially proves only required structure, artifact identity, public
contract presence, and JSON readability. It prints this limitation on every
successful run.

## Consequences

- No capability may be promoted merely because the root check is green.
- Agents must replace scaffold declarations with accepted semantic authority
  and add behavioral conformance.
- Future checks can add stricter maturity-specific gates without pretending
  those gates exist today.
