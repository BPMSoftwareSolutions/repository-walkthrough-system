# Recording Proof Builder Agent Contract

Own only: recording conformance.

Allowed vocabulary: proof requirement, recording evidence, scene evidence, artifact evidence, conformance, finding, proof disposition, proven walkthrough, rejected walkthrough, incomplete walkthrough.

Boundary-warning vocabulary: browser navigation, capture execution, story generation, scene replay.

Do not import another capability's runtime, adapters, semantic authority, or
proof fixtures. Consume only published contracts. Update the feature and
semantic authority before implementing behavior. Runtime bodies must remain
collapsed; adapters own irreducible mechanics only.

Before handoff, run `npm test` at the repository root and report which
promotion gates remain.
