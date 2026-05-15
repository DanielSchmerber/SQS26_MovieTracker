\# Title

Decision to Choose the System's Frontend Technology



\## Status

accepted



\## Context

We need a frontend framework to build the user interface for the MovieTracker application.

The frontend must:

\- provide a responsive UI for browsing and managing a movie watchlist

\- integrate cleanly with the REST backend, including async data fetching

\- enable rapid iteration within a small team

\- support a scalable component-based architecture



Alternatives considered included:

\- Vue.js (smaller ecosystem and less industry adoption)

\- Angular (heavyweight and steep learning curve for this project size)

\- Svelte (limited ecosystem maturity)



\## Decision

We chose React with Vite and TypeScript. Its declarative, component-based model, large ecosystem,

and strong community support make it a pragmatic and future-proof choice.



\## Consequences

\*\*Easier:\*\*

\- Fast development with reusable components and a rich library ecosystem

\- Clean REST integration via fetch/axios and React Query for async state

\- TypeScript support improves code quality and reduces runtime errors



\*\*More difficult:\*\*

\- Architectural decisions (state management, routing) must be made explicitly and kept consistent

\- JSX may require ramp-up time for developers new to React

\- Bundle size must be actively managed through code splitting and lazy loading

