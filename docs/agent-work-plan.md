# Agent Work Plan

These packets are designed to be assigned independently after the published
contract at each packet boundary is agreed.

## Recommended first vertical slice

Outcome:

> Given a repository reference, an ordered list of README headings, and a
> recording profile, produce a proven video that visits each heading in order.

| Order | Work packet | Deliverable | Depends on |
| ---: | --- | --- | --- |
| 1 | Repository source | Resolve one immutable local or GitHub source | None |
| 2 | README inspection | Inventory presentable README headings | Source contract |
| 3 | Manual scene plan | Project submitted headings into semantic scenes | Inspection contract |
| 4 | Browser authority | Resolve scenes into ordered browser operations | Scene-plan contract |
| 5 | Browser execution | Execute resolved operations and emit testimony | Browser-plan contract |
| 6 | Recording | Capture the authorized visual session | Recording request contract |
| 7 | Scene observation | Observe target visibility and settlement | Scene and browser contracts |
| 8 | Recording proof | Establish artifact and scene conformance | Recording and observation contracts |
| 9 | Harness | Compose providers without importing internals | All published contracts |

The complete `walkthrough-story-resolver` can follow the first slice; the first
slice may accept a manually authored story or heading order.

## Packet completion checklist

- Intent and scenarios are accepted.
- Domain vocabulary and exclusions remain intact.
- Decisions, mappings, ordering, failure, and proof are semantic declarations.
- Schemas reject malformed input rather than silently defaulting it.
- Runtime files contain only resolved mechanics.
- Adapter effects are declared through ports.
- Proof fixtures cover success, rejection before effect, and observed failure.
- The package passes root conformance.
- The handoff states which gates remain.

## Coordination rule

If two packets need the same concept, publish it from the capability that owns
the truth. Do not create a shared convenience DTO until ownership is explicit.
