\# Title

Decision to Choose the System's Backend Technology



\## Status

accepted



\## Context

We need a backend framework to implement a REST API for the MovieTracker application.



The backend must:

\- expose a clean and well-documented API for the frontend

\- be fast to develop with (small team / rapid iteration)

\- integrate well with Python-based tools (e.g. SQLAlchemy, testing)

\- provide good support for async operations (e.g. external API calls to TMDB)



Alternatives considered included:

\- Flask (minimal, but offers less type verification)



\## Decision

We chose Python with FastAPI. FastAPI is modern, light-weight webframework for Python.



\## Consequences

\*\*Easier:\*\*

\- Fast development due to existing Python experience

\- Clean and straightforward API definitions

\- Free API documentation via FastAPI's built-in OpenAPI support



\*\*More difficult:\*\*

\- Scaling to a large userbase could become a challenge,

&#x20; as Python is slower than compiled languages

