# Presentation Asset Model

```text
observed repository artifact
  artifactId
  relativePath
  contentHash
       |
       +-- observed presentation unit
             source identity
             line range
             semantic identity
                    |
                    v
             presentation asset
               kind
               semantic anchor
               presentability
               significance
               readiness
               supported surfaces
```

Every asset retains the observed artifact identity, repository-relative path,
source range, and content hash from which it was projected.
