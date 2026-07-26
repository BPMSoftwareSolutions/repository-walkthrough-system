# Engineering Standard

The governing standards are:

- `C:\source\repos\bpm\intelligence\standards\deterministic-micro-capability-engineering-standard.md`
- `C:\source\repos\bpm\intelligence\standards\The Four-layer Discipline.md`

This repository adopts them without weakening their source-of-truth order.

## Four-layer discipline

```text
canonical intent and scenarios
              |
              v
semantic authority
  decisions, projections, iteration, failure, ports, proof
              |
              v
resolved immutable execution authority
              |
              v
collapsed runtime and mechanical adapters
              |
              v
proof receipts and conformance
```

Capability-specific decisions must not be authored in runtime bodies. Runtime
conditionality is acceptable only inside a generic, domain-neutral semantic
kernel. Adapters may contain irreducible platform mechanics but may not decide
authorization, fallback, retry, or success.

## Promotion gates

A capability is not promotable until it has evidence for:

| Gate | Evidence |
| --- | --- |
| Intent | Purpose, actor, trigger, outcome, constraints |
| Scenario | Gherkin scenario coverage |
| Responsibility | One coherent responsibility per code body |
| Semantic | Decisions, projections, ports, effects, execution models |
| Contract | Valid request, context, authority, result, and receipt schemas |
| Projection | At least one executable language projection |
| Execution | Behavior conforms to resolved authority |
| Proof | Required observations and receipts are complete |
| Idempotency | Repeated execution has a declared disposition |
| Portability | Canonical authority has no language contamination |
| Documentation | Boundaries, flow, and examples are readable |
| Conformance | Automated checks pass |

## Scaffold status

Generated catalogs and schemas intentionally carry a `scaffold` status.
Structural conformance must never be presented as execution proof.
