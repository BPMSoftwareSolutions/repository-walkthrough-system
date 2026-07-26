# Repository Walkthrough System

```text
Repository Source Resolver
          |
          v
Repository Presentation Inspector
          |
          v
Walkthrough Story Resolver
          |
          v
Walkthrough Scene Planner
          |
          v
Browser Presentation Resolver
          |
          v
Browser Walkthrough Executor
          |
          +--------------------+
          v                    v
Screen Recording       Walkthrough Scene
Controller              Observer
          |                    |
          +----------+---------+
                     v
          Recording Proof Builder

Repository Walkthrough Harness:
composes every arrow through published contracts only.
```
