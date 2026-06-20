# ADR01 - Architecture Pattern

## Title

Decision to Choose the Architecture Pattern


### Status

accepted


### Context

The architecture pattern must:

- support clear separation of concerns
- support simple development workflows
- easy integration between frontend, backend, and database components


Alternatives considered included:

- Hexagonal Architecture


### Decision


We chose Model-View-Controller (MVC) architecture pattern, because the project has limited complexity and a relatively small domain scope.


### Consequences

**Easier:**

- Simpler project structure and organization
- Faster development and implementation
- Easier onboarding for new developers
- Clear separation between models, controllers, and views
- Lower architectural complexity
- Easier debugging and maintenance for a small project



**More difficult:**

- Scaling the application for large and complex business domains
- Replacing infrastructure components independently
- Enforcing strict separation between domain and infrastructure logic
- Testing isolated business logic compared to more decoupled architectures

