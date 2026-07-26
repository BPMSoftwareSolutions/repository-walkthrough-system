# Browser Presentation Resolver

```text
Walkthrough Scene Plan
        │
        ▼
┌──────────────────────────────┐
│ Validate request contract    │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Resolve presentation surface │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Resolve semantic target      │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Resolve operation authority  │
│                              │
│ navigate                     │
│ bring-target-into-view       │
│ focus-target                 │
│ await-settlement             │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Order operations             │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Project resolved plan        │
└──────────────┬───────────────┘
               ▼
Resolved Browser Presentation
```

## Projection boundary

```text
Browser Presentation Resolver             Browser Walkthrough Executor
──────────────────────────────             ────────────────────────────
semantic target                            platform locator
surface identity                           CSS/XPath/accessibility query
navigation intent                          Playwright/Puppeteer call
scroll intent                              physical scrolling
focus intent                               DOM highlighting
settlement condition                       browser wait implementation
```
