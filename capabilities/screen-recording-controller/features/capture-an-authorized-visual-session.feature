Feature: Screen Recording Controller

  Scenario: Produce the owned outcome from authorized input
    Given an authorized screen recording controller request
    And the required observed facts are available
    When the capability resolves and executes its authority
    Then the declared visual source is captured into a readable recording artifact
    And a conformance receipt is produced

  Scenario: Reject unresolved authority before effects
    Given a request that cannot be completely authorized
    When the capability resolves its authority
    Then no external effect occurs
    And the blocking finding is recorded
