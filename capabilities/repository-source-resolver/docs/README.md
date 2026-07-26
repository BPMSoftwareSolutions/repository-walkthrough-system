# Repository Source Resolver

The **Repository Source Resolver** owns one outcome:

> **Produce one immutable, authorized, inspectable repository source from a submitted repository reference.**

It does not clone repositories, inspect source files, generate walkthroughs, choose presentation content, or launch browsers.

Its responsibility ends when the caller receives a canonical repository identity pinned to an exact revision.

That boundary follows the larger repository-walkthrough architecture, where repository identity truth is established before presentation inspection or storytelling begins. 

## Implemented first slice

The executable projection currently supports public `github.com` HTTPS repository references, provider-default branches, explicit branches, explicit tags, full commit identities, and README/repository-root/repository-relative entrypoints. Every successful result is pinned to a 40-character commit identity and carries deterministic request, observation, and authority hashes.

The implementation fails closed for unsupported or ambiguous references, inaccessible repositories, missing or non-immutable revisions, and entrypoints outside the repository. Provider access is read-only and credentials are neither accepted nor recorded in this first slice.

GitLab, Bitbucket, Azure DevOps, local Git repositories, private repositories, credential brokerage, and repository materialization remain deferred as described in [Minimal First Slice](#20-minimal-first-slice).

---

# 1. Capability Boundary

```text
Repository reference
        │
        ▼
Repository Source Resolver
        │
        ├── recognizes the reference dialect
        ├── resolves the provider
        ├── resolves repository identity
        ├── resolves revision authority
        ├── verifies accessibility
        ├── resolves presentation entrypoint
        └── projects immutable repository source
        │
        ▼
Resolved Repository Source
```

## It owns

```text
Repository reference
Repository provider
Repository owner
Repository name
Repository identity
Repository visibility
Revision request
Branch
Tag
Commit
Default revision
Resolved commit
Source location
Presentation entrypoint
Authorization disposition
Resolution testimony
```

## It must not own

```text
Repository cloning
Workspace materialization
README parsing
Source-code inspection
Presentation asset classification
Story generation
Scene planning
Browser navigation
Recording
Repository modification
Dependency installation
```

The distinction is especially important:

```text
Repository Source Resolver
    resolves what repository source is authorized.

Repository Materializer
    may later obtain a local physical copy.

Repository Presentation Inspector
    determines what material is presentable.
```

---

# 2. Core Domain Question

Every internal responsibility should contribute to answering one question:

> **Which exact repository revision is the authorized source for this execution?**

The answer cannot merely be:

```text
main
```

because branches move.

It should ultimately become:

```text
provider: github
repository: deterministic-solutions/file-system-shaper
requested revision: main
resolved revision type: branch
resolved commit: 8f4d31c...
canonical source identity:
github:deterministic-solutions/file-system-shaper@8f4d31c...
```

The immutable commit identity becomes the source of truth for downstream capabilities.

---

# 3. C4 Component View

```text
┌──────────────────── REPOSITORY SOURCE RESOLVER ────────────────────┐
│                                                                   │
│  Repository Source Request                                        │
│              │                                                    │
│              ▼                                                    │
│  ┌──────────────────────────────┐                                 │
│  │ Request Contract Validator   │                                 │
│  └──────────────┬───────────────┘                                 │
│                 ▼                                                 │
│  ┌──────────────────────────────┐                                 │
│  │ Repository Reference         │                                 │
│  │ Recognizer                   │                                 │
│  └──────────────┬───────────────┘                                 │
│                 ▼                                                 │
│  ┌──────────────────────────────┐                                 │
│  │ Repository Provider Resolver │                                 │
│  └──────────────┬───────────────┘                                 │
│                 ▼                                                 │
│  ┌──────────────────────────────┐                                 │
│  │ Repository Identity Resolver │                                 │
│  └──────────────┬───────────────┘                                 │
│                 ▼                                                 │
│  ┌──────────────────────────────┐                                 │
│  │ Repository Access Observer   │                                 │
│  └──────────────┬───────────────┘                                 │
│                 ▼                                                 │
│  ┌──────────────────────────────┐                                 │
│  │ Repository Revision Resolver │                                 │
│  └──────────────┬───────────────┘                                 │
│                 ▼                                                 │
│  ┌──────────────────────────────┐                                 │
│  │ Presentation Entrypoint      │                                 │
│  │ Resolver                     │                                 │
│  └──────────────┬───────────────┘                                 │
│                 ▼                                                 │
│  ┌──────────────────────────────┐                                 │
│  │ Resolved Source Projector    │                                 │
│  └──────────────┬───────────────┘                                 │
│                 ▼                                                 │
│  ┌──────────────────────────────┐                                 │
│  │ Resolution Proof Projector   │                                 │
│  └──────────────┬───────────────┘                                 │
│                 ▼                                                 │
│       Resolved Repository Source                                 │
│       + Resolution Receipt                                        │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

# 4. The Eight Semantic Micro-Components

I would establish **eight bounded semantic components**.

## 1. Repository Source Request Validator

Answers:

> Is the submitted request structurally admissible?

It validates:

```text
reference exists
requested revision is syntactically valid
provider hint is recognized when present
required authorization reference is available
entrypoint policy is recognized
resolution policy version is supported
```

It does not contact GitHub or inspect a local directory.

---

## 2. Repository Reference Recognizer

Answers:

> What kind of repository reference was submitted?

Supported reference dialects might include:

```text
GitHub HTTPS URL
GitHub SSH URL
GitLab HTTPS URL
Local repository path
Provider-qualified repository slug
Canonical repository identity
```

Examples:

```text
https://github.com/acme/payments
git@github.com:acme/payments.git
github:acme/payments
C:\workspaces\payments
/workspaces/payments
```

Recognition is semantic authority, not a chain of capability-specific `if` statements.

```json
{
  "recognitionCatalogId": "repository-reference-dialects.v1",
  "recognizers": [
    {
      "recognizerId": "recognize-github-https-reference",
      "pattern": "^https://github\\.com/(?<owner>[^/]+)/(?<repository>[^/#]+?)(?:\\.git)?/?$",
      "providerId": "github",
      "referenceKind": "remote-repository"
    },
    {
      "recognizerId": "recognize-github-qualified-slug",
      "pattern": "^github:(?<owner>[^/]+)/(?<repository>[^@]+)(?:@(?<revision>.+))?$",
      "providerId": "github",
      "referenceKind": "provider-qualified-repository"
    }
  ]
}
```

---

## 3. Repository Provider Resolver

Answers:

> Which provider authority applies to this reference?

Possible dispositions:

```text
github
gitlab
azure-devops
bitbucket
local-git-workspace
unsupported-provider
ambiguous-provider
```

The provider resolver selects the semantic provider pack and mechanical observation port.

It does not directly call provider APIs.

---

## 4. Repository Identity Resolver

Answers:

> What stable repository identity does this reference denote?

It resolves:

```text
provider identity
provider host
owner or namespace
repository name
canonical repository slug
repository provider identifier
visibility testimony
archival testimony
default branch testimony
```

Canonical identity example:

```json
{
  "providerId": "github",
  "providerHost": "github.com",
  "owner": "deterministic-solutions",
  "repository": "file-system-shaper",
  "canonicalSlug": "deterministic-solutions/file-system-shaper",
  "providerRepositoryId": "R_kgDO...",
  "repositoryState": "active",
  "visibility": "public"
}
```

---

## 5. Repository Access Observer

Answers:

> Can the current caller observe the repository under the declared authorization policy?

Possible results:

```text
accessible-publicly
accessible-with-declared-credential
not-found
access-denied
credential-unavailable
provider-unreachable
repository-archived
```

This component reports observed facts.

A separate decision catalog resolves those facts into authorization disposition.

```text
Observation:
HTTP 404 returned.

Decision authority:
Treat as not-found or concealed-private-repository
according to declared provider policy.
```

---

## 6. Repository Revision Resolver

Answers:

> Which immutable commit satisfies the submitted revision request?

It resolves revision requests such as:

```text
explicit commit
branch
tag
default revision
provider release
local HEAD
```

The critical output is always an immutable revision identity.

```text
Requested revision
        │
        ├── main
        ├── v1.2.0
        ├── release/2026-07
        ├── 8f4d31c...
        └── default
        │
        ▼
Resolved full commit SHA
```

Example:

```json
{
  "requestedRevision": {
    "value": "main",
    "kind": "unspecified"
  },
  "resolvedRevision": {
    "kind": "branch",
    "name": "main",
    "commit": "8f4d31c5c3dd4f6c127d6d41a8de65477d5037e1"
  }
}
```

Downstream execution must use the resolved commit, not re-resolve `main`.

---

## 7. Presentation Entrypoint Resolver

Answers:

> Where should a downstream presentation capability begin observing this repository?

This is deliberately narrow. It does not inspect or interpret repository content.

Possible entrypoints:

```text
repository root
README.md
declared documentation index
declared source file
provider repository landing page
local workspace root
```

Resolution policy:

```json
{
  "decisionId": "resolve-repository-presentation-entrypoint",
  "rules": [
    {
      "when": {
        "request.explicitEntrypoint.present": true,
        "observedEntrypoint.exists": true
      },
      "then": "use-explicit-entrypoint"
    },
    {
      "when": {
        "repository.readme.present": true
      },
      "then": "use-readme"
    },
    {
      "when": {
        "repository.root.observable": true
      },
      "then": "use-repository-root"
    },
    {
      "when": {
        "*": true
      },
      "then": "reject-entrypoint-unavailable"
    }
  ]
}
```

It identifies the starting location. It does not decide what sections are educationally valuable.

---

## 8. Resolved Repository Source Projector

Answers:

> How are all resolved facts represented as one immutable public source contract?

This component projects:

```text
canonical source ID
provider identity
repository identity
requested revision
resolved immutable revision
access disposition
presentation entrypoint
observation references
source hash
authority hash
```

DTO assembly belongs in the semantic projection, not in an authored TypeScript object.

---

# 5. Public Operation

The capability exposes one primary operation:

```text
resolveRepositorySource(request)
        ↓
RepositorySourceResolutionResult
```

Semantic operation ID:

```text
resolve-an-authorized-repository-source
```

TypeScript projection:

```typescript
export async function resolvesAuthorizedRepositorySource(
  context: RepositorySourceResolutionContext
): Promise<RepositorySourceResolutionResult> {
  const authority = await edges.invokes(
    "resolve-repository-source-authority",
    context
  );

  const execution = await edges.invokes(
    "execute-resolved-repository-source-resolution",
    authority
  );

  return edges.projects(
    "project-repository-source-resolution-result",
    execution
  );
}
```

The body contains no:

```text
provider switch
URL parsing
revision fallback
DTO construction
access-policy decisions
entrypoint fallback
GitHub API calls
local Git commands
```

The engineering standard requires semantic authority to own decisions, projections, ports, execution models, and proof while code bodies remain mechanical projections. 

---

# 6. Intent IR

```json
{
  "$schema": "./repository-source-resolver.intent-ir.schema.v1.json",
  "capabilityId": "repository-source-resolver",
  "title": "Resolve an authorized repository source",
  "purpose": "Produce one immutable and authorized repository source from a submitted repository reference.",
  "actor": "authorized-caller",
  "trigger": "a repository source request is submitted",
  "desiredOutcome": "the caller receives a canonical repository identity pinned to an immutable revision",
  "constraints": [
    "a movable branch or tag must not be returned as the final source identity",
    "provider access must be observed before the source is authorized",
    "repository content must not be modified",
    "credentials must never appear in the resolved source or receipt",
    "the provider-specific reference must be preserved as testimony",
    "the resolved commit must be recorded",
    "unsupported or ambiguous references must fail closed"
  ],
  "featureIds": [
    "resolve-an-authorized-repository-source"
  ]
}
```

---

# 7. Gherkin Feature

```gherkin
Feature: Resolve an authorized repository source

  Scenario: Resolve a public GitHub repository at its default branch
    Given a valid GitHub repository reference
    And no revision is explicitly requested
    And the repository is publicly accessible
    When the repository source is resolved
    Then the GitHub repository identity is recorded
    And the default branch is resolved
    And the default branch is pinned to its current commit
    And an immutable repository source is produced
    And a repository source resolution receipt is produced

  Scenario: Resolve an explicitly requested branch
    Given a valid repository reference
    And an existing branch is explicitly requested
    When the repository source is resolved
    Then the requested branch is preserved as testimony
    And the branch is resolved to its current commit
    And the immutable commit is used as the source revision

  Scenario: Resolve an explicitly requested tag
    Given a valid repository reference
    And an existing tag is explicitly requested
    When the repository source is resolved
    Then the requested tag is preserved as testimony
    And the tag is resolved to its target commit
    And the immutable commit is used as the source revision

  Scenario: Preserve an explicitly requested commit
    Given a valid repository reference
    And a full commit identity is explicitly requested
    And the commit exists in the repository
    When the repository source is resolved
    Then the requested commit is used as the immutable source revision

  Scenario: Reject an unknown repository reference dialect
    Given a repository reference that matches no supported dialect
    When the repository source is resolved
    Then the request is rejected as unsupported
    And no provider operation is invoked
    And no resolved repository source is produced

  Scenario: Reject an ambiguous repository reference
    Given a repository reference recognized by more than one reference authority
    When the repository source is resolved
    Then the request is rejected as ambiguous
    And no provider operation is invoked

  Scenario: Reject a missing revision
    Given a valid repository reference
    And a revision is explicitly requested
    And the revision does not exist
    When the repository source is resolved
    Then the request is rejected as revision not found
    And no fallback revision is selected

  Scenario: Reject inaccessible repository source
    Given a valid private repository reference
    And no authorized credential can access the repository
    When the repository source is resolved
    Then the source is rejected as inaccessible
    And no repository content is disclosed

  Scenario: Resolve a local Git repository
    Given a valid local repository path
    And the directory is a Git repository
    And the current commit can be observed
    When the repository source is resolved
    Then the canonical local repository identity is recorded
    And the current commit is recorded
    And the local workspace root is recorded as the source location

  Scenario: Reject a local directory that is not a repository
    Given a valid local path
    And the directory is not a Git repository
    When the repository source is resolved
    Then the request is rejected as not a repository

  Scenario: Resolve the declared presentation entrypoint
    Given an authorized repository source
    And an existing entrypoint is explicitly requested
    When the repository source is resolved
    Then the requested entrypoint is recorded
    And the entrypoint is constrained to the resolved repository source

  Scenario: Declare repeated resolution against the same commit
    Given a repository source was previously resolved
    And the repository reference resolves to the same immutable commit
    When the repository source is resolved again
    Then an equivalent canonical source identity is produced
    And the resolution is declared idempotent
```

---

# 8. Request Contract

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "repository-source-request.schema.v1.json",
  "title": "Repository Source Request",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "requestId",
    "reference",
    "resolutionPolicy"
  ],
  "properties": {
    "requestId": {
      "type": "string",
      "minLength": 1
    },
    "reference": {
      "type": "string",
      "minLength": 1
    },
    "providerHint": {
      "type": "string"
    },
    "revision": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "value"
      ],
      "properties": {
        "value": {
          "type": "string",
          "minLength": 1
        },
        "kindHint": {
          "enum": [
            "branch",
            "tag",
            "commit",
            "default"
          ]
        }
      }
    },
    "presentationEntrypoint": {
      "type": "string"
    },
    "authorizationReference": {
      "type": "string",
      "description": "Opaque reference to authorization material. Never contains the credential itself."
    },
    "resolutionPolicy": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "unknownProvider",
        "missingRevision",
        "ambiguousReference",
        "inaccessibleRepository"
      ],
      "properties": {
        "unknownProvider": {
          "const": "reject"
        },
        "missingRevision": {
          "const": "reject"
        },
        "ambiguousReference": {
          "const": "reject"
        },
        "inaccessibleRepository": {
          "const": "reject"
        },
        "missingEntrypoint": {
          "enum": [
            "use-readme",
            "use-repository-root",
            "reject"
          ]
        }
      }
    }
  }
}
```

---

# 9. Resolved Repository Source Contract

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "resolved-repository-source.schema.v1.json",
  "title": "Resolved Repository Source",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "sourceId",
    "provider",
    "repository",
    "requestedRevision",
    "resolvedRevision",
    "sourceLocation",
    "access",
    "presentationEntrypoint",
    "authority"
  ],
  "properties": {
    "sourceId": {
      "type": "string"
    },
    "provider": {
      "type": "object",
      "required": [
        "providerId",
        "host"
      ],
      "properties": {
        "providerId": {
          "type": "string"
        },
        "host": {
          "type": "string"
        },
        "referenceDialect": {
          "type": "string"
        }
      }
    },
    "repository": {
      "type": "object",
      "required": [
        "canonicalSlug",
        "repositoryName"
      ],
      "properties": {
        "providerRepositoryId": {
          "type": [
            "string",
            "null"
          ]
        },
        "owner": {
          "type": [
            "string",
            "null"
          ]
        },
        "repositoryName": {
          "type": "string"
        },
        "canonicalSlug": {
          "type": "string"
        },
        "visibility": {
          "enum": [
            "public",
            "private",
            "internal",
            "unknown"
          ]
        }
      }
    },
    "requestedRevision": {
      "type": "object",
      "required": [
        "value",
        "disposition"
      ],
      "properties": {
        "value": {
          "type": [
            "string",
            "null"
          ]
        },
        "kindHint": {
          "type": [
            "string",
            "null"
          ]
        },
        "disposition": {
          "enum": [
            "explicit",
            "provider-default",
            "local-head"
          ]
        }
      }
    },
    "resolvedRevision": {
      "type": "object",
      "required": [
        "kind",
        "commit"
      ],
      "properties": {
        "kind": {
          "enum": [
            "branch",
            "tag",
            "commit",
            "local-head"
          ]
        },
        "name": {
          "type": [
            "string",
            "null"
          ]
        },
        "commit": {
          "type": "string",
          "minLength": 7
        }
      }
    },
    "sourceLocation": {
      "type": "object",
      "required": [
        "kind",
        "canonicalReference"
      ],
      "properties": {
        "kind": {
          "enum": [
            "remote",
            "local"
          ]
        },
        "canonicalReference": {
          "type": "string"
        },
        "browseReference": {
          "type": [
            "string",
            "null"
          ]
        },
        "localRoot": {
          "type": [
            "string",
            "null"
          ]
        }
      }
    },
    "access": {
      "type": "object",
      "required": [
        "disposition"
      ],
      "properties": {
        "disposition": {
          "enum": [
            "authorized-public",
            "authorized-declared-credential",
            "authorized-local"
          ]
        },
        "authorizationReference": {
          "type": [
            "string",
            "null"
          ]
        }
      }
    },
    "presentationEntrypoint": {
      "type": "object",
      "required": [
        "kind",
        "path"
      ],
      "properties": {
        "kind": {
          "enum": [
            "repository-root",
            "readme",
            "repository-path"
          ]
        },
        "path": {
          "type": "string"
        }
      }
    },
    "authority": {
      "type": "object",
      "required": [
        "requestHash",
        "observationHash",
        "authorityHash"
      ],
      "properties": {
        "requestHash": {
          "type": "string"
        },
        "observationHash": {
          "type": "string"
        },
        "authorityHash": {
          "type": "string"
        }
      }
    }
  }
}
```

---

# 10. Example Resolved Source

```json
{
  "sourceId": "github:deterministic-solutions/file-system-shaper@8f4d31c5c3dd4f6c127d6d41a8de65477d5037e1",
  "provider": {
    "providerId": "github",
    "host": "github.com",
    "referenceDialect": "github-https"
  },
  "repository": {
    "providerRepositoryId": "R_kgDOExample",
    "owner": "deterministic-solutions",
    "repositoryName": "file-system-shaper",
    "canonicalSlug": "deterministic-solutions/file-system-shaper",
    "visibility": "public"
  },
  "requestedRevision": {
    "value": null,
    "kindHint": null,
    "disposition": "provider-default"
  },
  "resolvedRevision": {
    "kind": "branch",
    "name": "main",
    "commit": "8f4d31c5c3dd4f6c127d6d41a8de65477d5037e1"
  },
  "sourceLocation": {
    "kind": "remote",
    "canonicalReference": "github:deterministic-solutions/file-system-shaper",
    "browseReference": "https://github.com/deterministic-solutions/file-system-shaper/tree/8f4d31c5c3dd4f6c127d6d41a8de65477d5037e1",
    "localRoot": null
  },
  "access": {
    "disposition": "authorized-public",
    "authorizationReference": null
  },
  "presentationEntrypoint": {
    "kind": "readme",
    "path": "README.md"
  },
  "authority": {
    "requestHash": "sha256:request...",
    "observationHash": "sha256:observation...",
    "authorityHash": "sha256:authority..."
  }
}
```

---

# 11. Revision Resolution Decision Catalog

```json
{
  "decisionId": "resolve-repository-revision-disposition",
  "inputs": [
    "request.revision.present",
    "request.revision.kindHint",
    "observed.exactCommit.exists",
    "observed.branch.exists",
    "observed.tag.exists",
    "observed.defaultBranch.exists"
  ],
  "rules": [
    {
      "when": {
        "request.revision.present": true,
        "request.revision.kindHint": "commit",
        "observed.exactCommit.exists": true
      },
      "then": "authorize-explicit-commit"
    },
    {
      "when": {
        "request.revision.present": true,
        "request.revision.kindHint": "branch",
        "observed.branch.exists": true
      },
      "then": "resolve-branch-to-commit"
    },
    {
      "when": {
        "request.revision.present": true,
        "request.revision.kindHint": "tag",
        "observed.tag.exists": true
      },
      "then": "resolve-tag-to-commit"
    },
    {
      "when": {
        "request.revision.present": false,
        "observed.defaultBranch.exists": true
      },
      "then": "resolve-default-branch-to-commit"
    },
    {
      "when": {
        "request.revision.present": true
      },
      "then": "reject-revision-not-found"
    },
    {
      "when": {
        "*": true
      },
      "then": "reject-revision-unresolvable"
    }
  ]
}
```

No hidden behavior such as:

```text
branch missing → quietly try tag
tag missing → quietly use default branch
commit missing → quietly use HEAD
```

The resolver must fail closed.

---

# 12. Ports

Ports expose only mechanical observation capabilities.

```json
{
  "portCatalogId": "repository-source-resolution-ports.v1",
  "ports": [
    {
      "portId": "observes-remote-repository",
      "inputContract": "observe-remote-repository-request.v1",
      "outputContract": "observed-remote-repository.v1",
      "effect": "read-remote-repository-metadata"
    },
    {
      "portId": "observes-remote-revision",
      "inputContract": "observe-remote-revision-request.v1",
      "outputContract": "observed-remote-revision.v1",
      "effect": "read-remote-repository-metadata"
    },
    {
      "portId": "observes-local-git-repository",
      "inputContract": "observe-local-git-repository-request.v1",
      "outputContract": "observed-local-git-repository.v1",
      "effect": "read-local-file-system"
    },
    {
      "portId": "observes-local-git-revision",
      "inputContract": "observe-local-git-revision-request.v1",
      "outputContract": "observed-local-git-revision.v1",
      "effect": "read-local-process"
    },
    {
      "portId": "calculates-canonical-content-hash",
      "inputContract": "calculate-canonical-hash-request.v1",
      "outputContract": "canonical-hash-result.v1",
      "effect": "calculate"
    }
  ]
}
```

Adapters may use:

```text
GitHub API
GitLab API
git ls-remote
git rev-parse
file-system stat
provider SDKs
```

They must not decide which revision is acceptable.

---

# 13. Repository File-System Body

```text
repository-source-resolver/
├── README.md
│
├── intent/
│   ├── resolve-an-authorized-repository-source.intent-ir.v1.json
│   └── repository-source-resolver.intent-ir.schema.v1.json
│
├── features/
│   └── resolve-an-authorized-repository-source.feature
│
├── architecture/
│   ├── repository-source-resolver.context.ascii.md
│   ├── repository-source-resolution-flow.ascii.md
│   ├── repository-source-resolver.boundary.ascii.md
│   └── provider-adapter-context-map.ascii.md
│
├── semantic-authority/
│   ├── recognize-repository-reference/
│   │   └── recognizes-repository-reference.sej.v1.json
│   │
│   ├── resolve-repository-provider/
│   │   └── resolves-repository-provider.sej.v1.json
│   │
│   ├── resolve-repository-identity/
│   │   └── resolves-repository-identity.sej.v1.json
│   │
│   ├── resolve-repository-access/
│   │   └── resolves-repository-access-disposition.sej.v1.json
│   │
│   ├── resolve-repository-revision/
│   │   └── resolves-repository-revision.sej.v1.json
│   │
│   ├── resolve-presentation-entrypoint/
│   │   └── resolves-presentation-entrypoint.sej.v1.json
│   │
│   ├── project-resolved-repository-source/
│   │   └── projects-resolved-repository-source.sej.v1.json
│   │
│   ├── execution/
│   │   └── repository-source-resolution-execution-model.sej.v1.json
│   │
│   ├── failures/
│   │   └── repository-source-resolution-failure-policy.sej.v1.json
│   │
│   └── proof/
│       └── repository-source-resolution-proof.sej.v1.json
│
├── contracts/
│   ├── repository-source-request.schema.v1.json
│   ├── recognized-repository-reference.schema.v1.json
│   ├── observed-repository-source.schema.v1.json
│   ├── resolved-repository-source-authority.schema.v1.json
│   ├── resolved-repository-source.schema.v1.json
│   ├── repository-source-resolution-result.schema.v1.json
│   └── repository-source-resolution-receipt.schema.v1.json
│
├── adapters/
│   ├── github/
│   │   ├── observes-github-repository.ts
│   │   ├── observes-github-default-branch.ts
│   │   ├── observes-github-branch.ts
│   │   ├── observes-github-tag.ts
│   │   └── observes-github-commit.ts
│   │
│   ├── gitlab/
│   │   ├── observes-gitlab-repository.ts
│   │   └── observes-gitlab-revision.ts
│   │
│   └── local-git/
│       ├── observes-local-git-repository.ts
│       ├── observes-local-git-head.ts
│       └── observes-local-git-revision.ts
│
├── runtime/
│   ├── observes-repository-source.ts
│   ├── resolves-repository-source-authority.ts
│   ├── executes-resolved-repository-source-resolution.ts
│   └── projects-repository-source-resolution-result.ts
│
├── application/
│   └── resolves-authorized-repository-source.ts
│
├── entrypoints/
│   └── cli/
│       └── resolves-repository-source-command.ts
│
└── proof/
    ├── fixtures/
    │   ├── github-public-repository/
    │   ├── local-git-repository/
    │   ├── ambiguous-reference/
    │   └── missing-revision/
    │
    ├── scenarios/
    │   ├── resolves-public-github-repository/
    │   ├── resolves-explicit-branch/
    │   ├── resolves-explicit-tag/
    │   ├── resolves-explicit-commit/
    │   ├── resolves-local-repository/
    │   ├── rejects-unknown-reference/
    │   ├── rejects-inaccessible-repository/
    │   └── rejects-missing-revision/
    │
    └── conformance/
        ├── enforces-linear-capability-bodies.ts
        ├── enforces-no-credential-testimony.ts
        ├── enforces-immutable-revision-output.ts
        └── enforces-source-contract-completeness.ts
```

---

# 14. Execution Authority

The semantic resolver should produce a complete ordered plan.

```json
{
  "authorityType": "resolved-repository-source-resolution-authority.v1",
  "resolutionId": "repository-source-resolution-01",
  "operations": [
    {
      "sequence": 1,
      "operationId": "recognize-submitted-repository-reference",
      "invocation": "recognize-repository-reference"
    },
    {
      "sequence": 2,
      "operationId": "resolve-repository-provider",
      "invocation": "resolve-repository-provider"
    },
    {
      "sequence": 3,
      "operationId": "observe-repository-identity",
      "portId": "observes-remote-repository"
    },
    {
      "sequence": 4,
      "operationId": "resolve-repository-access",
      "invocation": "resolve-repository-access-disposition"
    },
    {
      "sequence": 5,
      "operationId": "observe-requested-revision",
      "portId": "observes-remote-revision"
    },
    {
      "sequence": 6,
      "operationId": "resolve-immutable-revision",
      "invocation": "resolve-repository-revision"
    },
    {
      "sequence": 7,
      "operationId": "resolve-presentation-entrypoint",
      "invocation": "resolve-presentation-entrypoint"
    },
    {
      "sequence": 8,
      "operationId": "project-resolved-source",
      "projectionId": "project-resolved-repository-source"
    },
    {
      "sequence": 9,
      "operationId": "project-resolution-receipt",
      "projectionId": "project-repository-source-resolution-receipt"
    }
  ],
  "failurePolicyId": "repository-source-resolution-failure-policy.v1",
  "proofContractId": "repository-source-resolution-proof.v1"
}
```

By execution time, the code does not decide operation order or fallback behavior.

---

# 15. Receipt Shape

```json
{
  "receiptType": "repository-source-resolution-receipt.v1",
  "runId": "run-01J...",
  "requestId": "resolve-source-01",
  "requestHash": "sha256:...",
  "recognizedReference": {
    "recognizerId": "recognize-github-https-reference",
    "providerId": "github",
    "referenceKind": "remote-repository"
  },
  "repository": {
    "canonicalSlug": "deterministic-solutions/file-system-shaper",
    "providerRepositoryId": "R_kgDOExample"
  },
  "requestedRevision": {
    "value": "main",
    "kindHint": "branch"
  },
  "resolvedRevision": {
    "kind": "branch",
    "name": "main",
    "commit": "8f4d31c5c3dd4f6c127d6d41a8de65477d5037e1"
  },
  "accessDisposition": "authorized-public",
  "presentationEntrypoint": {
    "kind": "readme",
    "path": "README.md"
  },
  "observations": [
    {
      "assertionId": "repository-identity-observed",
      "disposition": "satisfied"
    },
    {
      "assertionId": "immutable-revision-recorded",
      "disposition": "satisfied"
    },
    {
      "assertionId": "repository-access-authorized",
      "disposition": "satisfied"
    },
    {
      "assertionId": "credential-material-not-recorded",
      "disposition": "satisfied"
    }
  ],
  "sourceAuthorityHash": "sha256:...",
  "disposition": "REPOSITORY_SOURCE_RESOLVED"
}
```

---

# 16. Proof Contract

```json
{
  "proofContractId": "repository-source-resolution-proof.v1",
  "requiredAssertions": [
    "submitted-reference-recorded",
    "recognition-authority-recorded",
    "repository-provider-recorded",
    "canonical-repository-identity-recorded",
    "repository-access-observed",
    "requested-revision-preserved",
    "immutable-commit-recorded",
    "presentation-entrypoint-recorded",
    "credential-material-not-recorded",
    "resolved-source-contract-valid",
    "source-authority-hash-recorded",
    "final-disposition-recorded"
  ],
  "blockingFindings": [
    "unsupported-reference",
    "ambiguous-reference",
    "repository-not-found",
    "repository-access-denied",
    "revision-not-found",
    "revision-not-immutable",
    "presentation-entrypoint-outside-repository",
    "credential-material-exposed",
    "resolved-source-contract-invalid"
  ]
}
```

A URL alone is not proof.

A successful provider request alone is not proof.

The proof is:

```text
Reference recognized
        +
Repository identity observed
        +
Access authorized
        +
Revision resolved to immutable commit
        +
Entrypoint constrained to repository
        +
Canonical source projected
        +
Receipt complete
        =
Repository source resolved
```

---

# 17. Failure Dispositions

```text
REPOSITORY_SOURCE_RESOLVED
REPOSITORY_SOURCE_ALREADY_RESOLVED
INVALID_SOURCE_REQUEST
UNSUPPORTED_REFERENCE
AMBIGUOUS_REFERENCE
UNSUPPORTED_PROVIDER
REPOSITORY_NOT_FOUND
REPOSITORY_ACCESS_DENIED
AUTHORIZATION_UNAVAILABLE
PROVIDER_UNREACHABLE
REVISION_NOT_FOUND
REVISION_AMBIGUOUS
REVISION_NOT_IMMUTABLE
LOCAL_PATH_NOT_FOUND
LOCAL_PATH_NOT_REPOSITORY
PRESENTATION_ENTRYPOINT_NOT_FOUND
PRESENTATION_ENTRYPOINT_OUTSIDE_REPOSITORY
SOURCE_RESOLUTION_FAILED
```

There should be no generic fallback such as:

```text
Could not resolve remote repository,
so interpret the value as a local path.
```

That would be hidden semantic behavior. The reference dialect must explicitly authorize the interpretation.

---

# 18. CLI Boundary

```text
repository-source resolve <reference>
```

Example:

```bash
repository-source resolve \
  https://github.com/deterministic-solutions/file-system-shaper \
  --revision main \
  --entrypoint README.md \
  --output json
```

Result:

```json
{
  "disposition": "REPOSITORY_SOURCE_RESOLVED",
  "source": {
    "sourceId": "github:deterministic-solutions/file-system-shaper@8f4d31c5...",
    "resolvedRevision": {
      "kind": "branch",
      "name": "main",
      "commit": "8f4d31c5c3dd4f6c127d6d41a8de65477d5037e1"
    }
  },
  "receiptReference": "machine-local-evidence-reference"
}
```

The CLI must:

```text
parse transport arguments
project the request contract
invoke resolve-an-authorized-repository-source exactly once
render the canonical result
map disposition to stable exit code
```

It must not:

```text
call GitHub directly
run Git commands directly
select revision fallback
inspect README content
clone the repository
construct proof testimony
```

---

# 19. Relationship to the Walkthrough System

```text
Repository Walkthrough Harness
        │
        │ repository source request
        ▼
Repository Source Resolver
        │
        │ resolved-repository-source.v1
        ▼
Repository Presentation Inspector
```

The inspector receives:

```text
exact provider
exact repository
exact commit
exact source location
authorized access posture
presentation entrypoint
```

It must not receive merely:

```text
https://github.com/org/repo
```

Otherwise the inspector could observe a different commit than the story planner, browser executor, or proof builder.

The immutable source contract keeps the whole walkthrough tied to one repository truth.

```text
Source resolved at commit A
        ↓
Presentation inspected at commit A
        ↓
Scenes planned from commit A
        ↓
Browser presents commit A
        ↓
Recording proof cites commit A
```

---

# 20. Minimal First Slice

The first implementation only needs to support:

```text
GitHub public repository
GitHub HTTPS reference
default branch
explicit branch
explicit tag
explicit commit
README or repository-root entrypoint
immutable commit resolution
canonical source projection
resolution receipt
```

Defer:

```text
private repositories
GitLab
Bitbucket
Azure DevOps
local repositories
submodules
monorepo subworkspace resolution
GitHub Enterprise
release assets
credential brokerage
repository materialization
```

## First acceptance target

> Given a public GitHub repository URL and an optional revision, produce a canonical repository source pinned to a full commit SHA, or fail closed with a deterministic disposition.

That is a complete, useful micro-capability.

---

# Final Capability Shape

```text
Repository Source Resolver
├── 1 canonical feature
├── 12 acceptance scenarios
├── 8 semantic micro-components
├── 1 public operation
├── 3–4 collapsed responsibility bodies
├── provider observation adapters
├── immutable resolved-source contract
└── repository source resolution proof
```

The north-star rule is:

> **A repository reference is human-friendly intent. A resolved repository source is immutable execution authority.**

Once this resolver has produced that authority, every downstream capability can operate against the same repository identity without independently interpreting URLs, branches, tags, credentials, defaults, or revisions.
