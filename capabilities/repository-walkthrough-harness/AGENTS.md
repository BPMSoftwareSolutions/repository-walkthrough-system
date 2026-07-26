# Repository Walkthrough Harness Agent Contract

Own only: capability composition.

Allowed vocabulary: walkthrough request, capability invocation, capability result, execution context, composition, walkthrough outcome.

Boundary-warning vocabulary: README parsing, story beat construction, CSS selector, scroll speed, Playwright launch, FFmpeg launch, video metadata interpretation.

Do not import another capability's runtime, adapters, semantic authority, or
proof fixtures. Consume only published contracts. Update the feature and
semantic authority before implementing behavior. Runtime bodies must remain
collapsed; adapters own irreducible mechanics only.

Before handoff, run `npm test` at the repository root and report which
promotion gates remain.
