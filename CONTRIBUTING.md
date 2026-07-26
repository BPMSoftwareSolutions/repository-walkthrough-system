# Contributing

This repository is organized for contract-first, capability-local changes.

## Before implementation

1. Select one capability and read its `AGENTS.md`.
2. Identify the scenario and single responsibility being changed.
3. Confirm the capability owns the vocabulary involved.
4. Update semantic authority and contracts before runtime mechanics.

## Change scope

A pull request should normally change one capability. A cross-capability
contract change may include its consumers, but must explain:

- which capability owns the changed truth;
- why the published contract changed;
- which consumers are affected;
- how compatibility and versioning are handled;
- what proof demonstrates conformance.

## Validation

Run:

```text
npm test
```

Structural conformance is the minimum gate. An implemented capability also
needs scenario, execution, proof, idempotency, portability, and documentation
evidence described in `docs/engineering-standard.md`.
