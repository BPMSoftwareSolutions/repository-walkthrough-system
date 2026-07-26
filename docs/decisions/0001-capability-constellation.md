# ADR 0001: Use a capability constellation

Status: Accepted for scaffold

## Context

Repository navigation, educational storytelling, browser presentation,
browser mechanics, recording, observation, and proof answer different domain
questions and have independently meaningful proof obligations.

## Decision

Model the system as nine independently governed provider capabilities and one
composition-only harness. Each provider publishes a versioned contract. The
system root and harness may compose those contracts but may not import provider
internals.

## Consequences

- Agents can work within explicit semantic ownership.
- Provider implementations can evolve independently.
- Contract changes require explicit coordination.
- Some concepts that look convenient to share must remain translated at
  boundaries.
- The root cannot become an application-layer dumping ground.
