# Title

Decision to Choose the Architecture Testing Framework



## Status

accepted


## Context

We need a testing tool to verify architecture rules in the MovieTracker backend.



The architecture testing framework should:

- work well with Python

- integrate with pytest

- allow tests for layer and dependency rules

- support automated execution in CI/CD pipelines

- help detect architecture violations early



Alternatives considered included:

- manual code reviews

- custom import checks



## Decision

We chose pytestarch. Pytestarch is a pytest-compatible tool for defining and checking architecture constraints in Python projects.

Pytestarch fits our project because our backend tests already use pytest. It allows us to express architecture rules as automated tests, for example to check that service, repository and API layers stay separated and do not depend on each other in the wrong direction.



## Consequences

**Easier:**

- Automated validation of architecture rules

- Early detection of unwanted dependencies between layers

- Integration with the existing pytest-based test setup

- Consistent execution together with unit and integration tests

- Better maintainability as the codebase grows



**More difficult:**

- Architecture rules must be defined and maintained carefully

- Some violations may require refactoring existing code

- Developers need to understand the intended layer boundaries
