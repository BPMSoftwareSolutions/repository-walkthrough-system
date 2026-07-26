Feature: Resolve browser presentation authority
  As a repository walkthrough harness
  I want semantic walkthrough scenes resolved into browser presentation authority
  So that a browser executor can perform mechanics without inventing presentation meaning

  Scenario: Resolve a repository document fragment into ordered browser operations
    Given an authorized repository document scene
    And the scene identifies a stable presentation asset and semantic target
    And a supported browser presentation surface is requested
    When browser presentation authority is resolved
    Then the plan navigates to the presentation asset
    And the plan brings the semantic target into view
    And the plan focuses the semantic target
    And the plan waits for the target to become stable and visible
    And every operation has a deterministic sequence
    And no browser-engine selector is projected

  Scenario: Reject an unsupported presentation surface before execution
    Given an authorized walkthrough scene
    And the requested presentation surface is not declared in the surface catalog
    When browser presentation authority is resolved
    Then the request is rejected
    And no browser presentation operations are authorized
    And an unsupported-surface finding is projected

  Scenario: Reject a scene without a stable semantic target
    Given an authorized walkthrough scene
    And the scene has no presentation asset identity
    When browser presentation authority is resolved
    Then the request is rejected
    And no browser presentation operations are authorized
    And a missing-presentation-target finding is projected
