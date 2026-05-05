# Title

Decision to Choose the External Service

## Status

accepted

## Context

We need a external service (API) that can be integrated to the MovieTracker application.

The external service (API) must:

- expose a clean and well-documented API 

- be ease of integration

- be available and reliable 

- have large database

- have clear terms of use

Alternatives considered included:

- IMDb (large database, has extra cost)

## Decision

We chose TMDB. TMDB is data-rich, reliable, well-documented, easy to integrate, and scalable, with clear usage and licensing rules.

## Consequences

**Easier:**

- API is free to use
- Faster onboarding for developers
- well documented

**More difficult:**

- Ratelimited to 40 requests per second
- less credibility
- less feature rich
