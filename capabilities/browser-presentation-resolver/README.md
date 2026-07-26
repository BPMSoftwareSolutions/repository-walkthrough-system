# Browser Presentation Resolver

Resolves a semantic walkthrough scene plan into an ordered, platform-neutral browser presentation plan.

## Owned meaning

- presentation surface
- semantic target reference
- navigation operation
- viewport profile
- scroll intent
- focus intent
- settlement condition
- ordered browser operation authority

## Explicit exclusions

- CSS/XPath selectors
- GitHub/GitLab DOM knowledge
- Playwright/Puppeteer calls
- browser launch/session mechanics
- screen recording
- scene-story generation
- visual proof evaluation

## Public operation

```ts
resolvesBrowserPresentation(context)
```

The runtime body is deliberately collapsed:

```text
resolve authority
      ↓
execute declared resolution
      ↓
project result
```

The semantic catalogs own decisions, projections, ordering, and proof requirements.
