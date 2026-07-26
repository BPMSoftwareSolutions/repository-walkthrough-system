# Repository Source Resolution Flow

```text
repository-source-request.v1
        |
        v
recognize reference + constrain entrypoint
        |
        +-- rejected --> deterministic finding (no provider effect)
        |
        v
resolved-repository-source-resolution-authority.v1
        |
        v
observe GitHub repository identity and public access
        |
        v
observe declared revision kind (no fallback)
        |
        v
resolve full immutable commit
        |
        v
observe and constrain presentation entrypoint
        |
        v
project source + credential-free receipt + canonical hashes
        |
        v
repository-source-resolution-result.v1
```
