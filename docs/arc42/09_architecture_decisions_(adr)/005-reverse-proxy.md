# ADR05 - Reverse Proxy
## Title

Decision to Choose the System's Reverse Proxy



### Status

accepted


### Context

We need a reverse proxy to consolidate the system to a single origin and to simplify data access.



The reverse proxy must:

- provide simple and reliable HTTP and HTTPS routing between services

- simplify production configuration

- support containerized deployments

- integrate well with Docker-based environments


Alternatives considered included:

- Nginx (powerful but requires more manual configuration and reload handling)
- Apache HTTP Server (feature-rich but comparatively heavyweight for this use case)



### Decision

We propose using Traefik as the reverse proxy.
Traefik provides automatic service discovery, native Docker integration, straightforward configuration through labels and built in support for TLS Certificates.



### Consequences

**Easier:**

- Minimal configuration routing for Docker containers

- Good scalability for future microservice extensions

- Simplified HTTPS and certificate management



**More difficult:**

- Team members need familiarity with Traefik

- Dependency on container-oriented workflows and conventions

