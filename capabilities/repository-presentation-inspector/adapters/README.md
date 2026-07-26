# Adapters

Place irreducible platform mechanics here. Adapters may observe or perform
declared effects; they may not authorize an effect, choose fallback, retry, or
classify domain success.

The first slice provides read-only filesystem list/read ports and mechanical
observers for Markdown, Gherkin, JSON, and TypeScript. Dispatch to those
observers is declared by `dispatch-supported-artifact-inspection`.
