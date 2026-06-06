# Title

Decision to Choose the Unit and Integration Testing Framework



## Status

accepted


## Context

We need a testing framework for unit and integration tests in the MovieTracker backend.



The testing framework should:

- work well with Python and FastAPI

- support simple and readable test cases

- support fixtures for reusable test setup

- integrate well with GitHub CI/CD pipelines

- be suitable for both isolated unit tests and integration tests



Alternatives considered included:

- unittest

- nose2



## Decision

We chose pytest. Pytest is a widely used Python testing framework with concise test syntax, powerful fixtures and good support for test discovery.

Pytest fits our project because the backend is implemented with Python and FastAPI. It allows us to write small unit tests for service logic as well as integration tests for API behavior in a consistent way.



## Consequences

**Easier:**

- Readable and maintainable test cases

- Reusable setup through fixtures

- Consistent test execution for unit and integration tests

- Easy integration into CI/CD pipelines

- Large ecosystem with useful plugins



**More difficult:**

- Developers need to understand pytest-specific concepts such as fixtures and parametrization

- Poorly structured fixtures can make tests harder to understand
