Feature: Canonical ordering

  Scenario: Ignore enumeration order
    Given artifacts in an arbitrary physical order
    Then assets use canonical order
