# Boundary Context

```text
walkthrough-story.v1 --------------------+
                                        |
repository-presentation-inventory.v1 ---+--> WALKTHROUGH SCENE PLANNER
                                        |      owns visual-story meaning
scene-planning-policy.v1 ---------------+               |
                                                        v
                                      walkthrough-scene-plan.v1

must not own:
  browser navigation, target locators, physical scrolling,
  recording mechanics, scene observation, recording proof
```
