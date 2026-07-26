```text
Walkthrough Scene Planner
  owns: visual scene meaning
              │
              │ walkthrough-scene-plan.v1
              ▼
Browser Presentation Resolver
  owns: platform-neutral browser authority
              │
              │ resolved-browser-presentation.v1
              ▼
Browser Walkthrough Executor
  owns: browser-engine mechanics and testimony
```

The resolver MUST NOT know Playwright, GitHub DOM classes, CSS selectors, recording, or proof evaluation.
