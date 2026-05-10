\# Title

Decision to Choose the System's Database Technology



\## Status

accepted



\## Context

We need a database to persist data for the MovieTracker application.

The database must:

\- store and query user movie data reliably

\- integrate cleanly with the backend

\- be simple to set up and operate within a small team



Alternatives considered included:

\- PostgreSQL (powerful, but requires a separate running process and more operational overhead)

\- MySQL (similar drawbacks to PostgreSQL for a project of this scale)



\## Decision

We chose SQLite. It is a lightweight, file-based database that requires no additional

infrastructure and integrates well with Python-based backends via SQLAlchemy.



\## Consequences

\*\*Easier:\*\*

\- No additional service or process required — the database is a single file

\- Simple setup and zero configuration overhead

\- Integrates seamlessly with the backend through standard Python tooling



\*\*More difficult:\*\*

\- Not suited for high concurrency or large-scale multi-user workloads

\- Migration to a client-server database (e.g. PostgreSQL) would be required if the application scales significantly

