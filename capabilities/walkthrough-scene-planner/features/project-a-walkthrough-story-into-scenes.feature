Feature: Project a walkthrough story into scenes

  Background:
    Given a resolved repository walkthrough story
    And a repository presentation inventory
    And an authorized scene-planning policy

  Scenario: Project each required story beat into an ordered visual scene
    Given every required story beat has at least one admitted presentation asset
    When repository walkthrough scenes are planned
    Then every required story beat is represented by one scene
    And every scene references an admitted presentation asset
    And every scene declares a semantic visual subject
    And every scene declares a presentation intent
    And the scenes are returned in resolved narrative order
    And a scene-planning receipt proves complete coverage

  Scenario: Reject a story beat with no admitted presentation asset
    Given a required story beat has no admitted presentation asset
    When repository walkthrough scenes are planned
    Then the scene plan is rejected
    And the unsupported story beat is identified
    And no browser presentation authority is produced
    And a scene-planning receipt proves the rejection

  Scenario: Preserve semantic targeting without browser contamination
    Given a story beat references a document section
    When its scene is planned
    Then the scene identifies the presentation asset and semantic anchor
    And the scene contains no browser-specific mechanics

  Scenario: Reuse one presentation asset for distinct story purposes
    Given two required story beats match the same admitted presentation asset
    When repository walkthrough scenes are planned
    Then two distinct scenes may reference the same asset
    And each scene declares its own purpose
    And each scene declares its own semantic focus

  Scenario: Reject incomplete required story coverage
    Given at least one required story beat has no resolved scene
    When scene coverage is evaluated
    Then the walkthrough scene plan is rejected
    And the missing story coverage is reported

  Scenario: Repeated planning is deterministic
    Given the same story, presentation inventory, and planning policy
    When repository walkthrough scenes are planned twice
    Then both scene plans are equivalent
    And both authority hashes are equivalent
