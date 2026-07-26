Feature: Inventory presentable repository material

  As an authorized repository walkthrough harness
  I want a deterministic inventory of presentable repository material
  So that downstream capabilities can construct stories and scenes
  without interpreting the repository independently

  Scenario: Inventory presentable material from a supported repository
    Given an immutable resolved repository source
    And the repository revision can be inspected
    And supported presentation artifact policies are declared
    When the repository presentation is inspected
    Then supported repository artifacts are observed
    And each presentable artifact is classified
    And semantic presentation anchors are recorded
    And presentation significance is resolved
    And a repository presentation inventory is produced
    And an inspection receipt identifies the inspected revision

  Scenario: Preserve unsupported material as an inspection finding
    Given an immutable resolved repository source
    And the repository contains an unsupported artifact
    When the repository presentation is inspected
    Then the unsupported artifact is not silently discarded
    And an unsupported-artifact finding is recorded
    And supported artifacts remain available in the inventory

  Scenario: Reject an unresolved repository source
    Given a repository request without a resolved revision identity
    When repository presentation inspection is requested
    Then inspection is rejected
    And no repository artifacts are read
    And a rejection receipt is produced

  Scenario: Produce byte-stable inventory ordering
    Given the same immutable repository revision
    And the same inspection authority
    When repository presentation inspection is repeated
    Then the presentation inventory entries appear in canonical order
    And the inventory hash remains unchanged

  Scenario: Report an empty presentable repository
    Given an immutable resolved repository source
    And no supported presentable artifacts are observed
    When the repository presentation is inspected
    Then an empty presentation inventory is produced
    And the disposition is NO_PRESENTABLE_MATERIAL
    And the inspection is not reported as a runtime failure
