# Implementation Notes

## v0.1 admission

The first admitted slice supports:

1. repository web surfaces
2. documentation web surfaces
3. custom web viewers
4. desktop-standard, desktop-wide, and mobile-portrait viewports
5. semantic targets expressed as asset identity plus semantic anchor
6. four ordered operations per scene: navigate, bring into view, focus, settle

## Deliberately deferred

- physical URL construction
- surface-specific locator resolution
- DOM selector construction
- browser launch/session lifecycle
- scroll timing and easing mechanics
- focus rendering mechanics
- screenshots and visual observation
- screen recording

These belong to downstream capability providers.
