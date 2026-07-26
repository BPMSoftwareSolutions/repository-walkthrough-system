# Capability Context Map

```text
[repository identity]
repository-source-resolver
  -- resolved repository source -->

[presentable material]
repository-presentation-inspector
  |-- presentation inventory --> walkthrough-story-resolver
  `-- presentation inventory --> walkthrough-scene-planner
                                  (admitted visual sources)

[educational narrative]
walkthrough-story-resolver
  -- walkthrough story -->

[visual story]
walkthrough-scene-planner
  -- scene plan -->

[browser presentation authority]
browser-presentation-resolver
  -- resolved browser walkthrough -->

[browser mechanics]
browser-walkthrough-executor
  -- browser testimony --> walkthrough-scene-observer
  -- visual session ----> screen-recording-controller

[visual observation]              [media capture]
walkthrough-scene-observer        screen-recording-controller
  -- scene evidence -->             -- recording artifact -->

[conformance truth]
recording-proof-builder
  -- proven or rejected walkthrough -->

[composition only]
repository-walkthrough-harness
```

Every arrow is a published JSON contract. No arrow authorizes access to a
provider's internal semantic authority, runtime, adapters, or proof fixtures.
