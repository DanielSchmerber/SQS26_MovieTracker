# ADR07 - Conatainerization Platform
## Title

Decision to Choose the System's Containerization Platform



### Status

accepted



### Context

We require a containerization solution to ensure consistent development, testing, and deployment environments.



The container platform must:

- provide reproducible environments for frontend and backend services

- integrate well with local development workflows and CI/CD pipelines

- support multi-container orchestration during development

- offer strong ecosystem support and broad industry adoption



Alternatives considered included:

- Podman (daemonless architecture and strong security model, but lower adoption in Windows Systems)

- Native host deployments (harder to reproduce consistently across environments)


### Decision

We propose using Docker as the primary containerization platform.

Docker provides a mature ecosystem, and broad community adoption. Its integration with Docker Compose simplifies local multi-service development, while compatibility with common CI/CD platforms is high. It is also more open to Windows based Users via Docker Desktop.



### Consequences

**Easier:**

- Simplified setup through Docker Compose

- Large ecosystem of tooling, documentation, and community support

- Easier integration with CI/CD pipelines and cloud platforms



**More difficult:**

- Docker daemon introduces additional resource overhead

- Security considerations around daemon-based container management

