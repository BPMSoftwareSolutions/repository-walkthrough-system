Feature: Walkthrough Story Resolver

  Scenario: Produce the owned outcome from authorized input
    Given an authorized walkthrough story resolver request
    And the required observed facts are available
    When the capability resolves and executes its authority
    Then an audience-appropriate ordered walkthrough story is resolved
    And a conformance receipt is produced

  Scenario: Reject unresolved authority before effects
    Given a request that cannot be completely authorized
    When the capability resolves its authority
    Then no external effect occurs
    And the blocking finding is recorded
