# Capability Dependency Map

```text
source
  |
  v
inspection
  |
  v
story
  |
  v
scenes
  |
  v
browser resolution
  |
  v
browser execution --------> scene observation
  |                               |
  +--------> recording            |
                 |                |
                 +--------+-------+
                          v
                         proof

harness --> contracts at every boundary
harness -X-> capability internals
```
