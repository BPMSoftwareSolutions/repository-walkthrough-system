# Repository Presentation Inspection Flow

```text
resolved immutable local source
              |
              v
validate request and resolve repository-overview.v1 authority
              |
              v
list authorized-root artifacts through a read-only port
              |
              v
classify artifacts and preserve unsupported findings
              |
              v
read supported text through a read-only port
              |
              v
observe Markdown | Gherkin | JSON | TypeScript units
              |
              v
resolve kind | anchor | presentability | significance | readiness
              |
              v
apply canonical ordering
              |
              v
inventory + content hash + inspection receipt
```
