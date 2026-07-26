Feature: Present a repository through a recorded walkthrough

  Scenario: Produce a proven walkthrough from conforming capability results
    Given an authorized repository walkthrough request
    And every required capability provider publishes a conforming contract
    When the repository walkthrough is composed and executed
    Then the declared scenes are presented in their authorized order
    And a readable recording artifact is produced
    And every required scene has conforming observation evidence
    And a repository walkthrough proof receipt is produced

  Scenario: Reject an incomplete walkthrough
    Given an authorized repository walkthrough request
    And one required scene has no conforming observation evidence
    When recording proof is evaluated
    Then the walkthrough is not declared proven
    And the missing evidence is reported
