Feature: Resolve an authorized repository source

  Scenario: Resolve a public GitHub repository at its default branch
    Given a valid public GitHub HTTPS repository reference
    And no revision is explicitly requested
    When the repository source is resolved
    Then the default branch is pinned to its current full commit identity
    And an immutable repository source and complete receipt are produced

  Scenario: Resolve an explicitly requested branch
    Given a valid public GitHub HTTPS repository reference
    And an existing branch is explicitly requested
    When the repository source is resolved
    Then the requested branch is preserved as testimony
    And its current full commit identity is the source revision

  Scenario: Resolve an explicitly requested tag
    Given a valid public GitHub HTTPS repository reference
    And an existing tag is explicitly requested
    When the repository source is resolved
    Then the requested tag is preserved as testimony
    And its target full commit identity is the source revision

  Scenario: Preserve an explicitly requested commit
    Given a valid public GitHub HTTPS repository reference
    And an existing full commit identity is explicitly requested
    When the repository source is resolved
    Then that full commit identity is the immutable source revision

  Scenario: Reject an unknown repository reference dialect
    Given a repository reference that matches no supported dialect
    When the repository source is resolved
    Then the disposition is UNSUPPORTED_REFERENCE
    And no provider operation is invoked

  Scenario: Reject an ambiguous repository reference
    Given a repository reference recognized by more than one supplied recognition authority
    When the repository source is resolved
    Then the disposition is AMBIGUOUS_REFERENCE
    And no provider operation is invoked

  Scenario: Reject a missing revision
    Given a valid public GitHub HTTPS repository reference
    And a revision is explicitly requested but does not exist
    When the repository source is resolved
    Then the disposition is REVISION_NOT_FOUND
    And no fallback revision is selected

  Scenario: Reject an inaccessible repository source
    Given a syntactically valid GitHub HTTPS repository reference
    And public access cannot observe the repository
    When the repository source is resolved
    Then the source is rejected without disclosing repository content

  Scenario: Resolve the declared presentation entrypoint
    Given an authorized repository source
    And an existing repository-relative entrypoint is explicitly requested
    When the repository source is resolved
    Then the entrypoint is recorded and constrained to the repository

  Scenario: Reject an entrypoint outside the repository
    Given a valid public GitHub HTTPS repository reference
    And the requested entrypoint traverses outside the repository
    When the repository source is resolved
    Then the disposition is PRESENTATION_ENTRYPOINT_OUTSIDE_REPOSITORY
    And no provider operation is invoked

  Scenario: Declare repeated resolution against the same commit
    Given the same request and provider observations
    When the repository source is resolved more than once
    Then an equivalent canonical source identity and authority hash are produced
    And the resolution is declared idempotent
