Feature: Inspect a repository

  Scenario: Inventory supported material
    Given an immutable local repository
    When its presentation is inspected
    Then a presentation inventory is produced
