Feature: Repository Presentation Inspector

  Scenario: Produce the owned outcome from authorized input
    Given an authorized repository presentation inspector request
    And the required observed facts are available
    When the capability resolves and executes its authority
    Then presentable repository assets are inventoried without deciding their story
    And a conformance receipt is produced

  Scenario: Reject unresolved authority before effects
    Given a request that cannot be completely authorized
    When the capability resolves its authority
    Then no external effect occurs
    And the blocking finding is recorded
