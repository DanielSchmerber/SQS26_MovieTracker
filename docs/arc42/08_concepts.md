# 8 - Crosscutting Concepts

## 8.1 Domain Model

The domain model is centered around movies and the user-specific information managed by MovieTracker.

| Core entity | Definition |
|----|--------------|
| User | A registered person identified by a unique username and email address |
| Movie | Movie metadata retrieved from TMDB, including title, description, release date, images, and rating |
| Watchlist Entry | A reference connecting a user to a movie in their personal watchlist |
| Review | A rating and optional comment written by a user for a movie on their watchlist |

## 8.2 Authentication

During registration, the backend validates the user data and stores the password as a hash. After registration or login, it creates a signed JWT and sends it in a secure HTTP-only cookie. The browser includes this cookie automatically with later requests.

Protected endpoints validate the token and load the corresponding user before accessing watchlists or modifying reviews. Logging out removes the authentication cookie.

## 8.3 External API Communication

TMDB requests use timeouts, rate limiting, caching, and automatic retries. This reduces external traffic and improves behavior during temporary failures.

## 8.4 Testing Strategy

MovieTracker uses several test levels to cover individual components as well as complete user flows.

| Test level | Tools and purpose |
|----|--------------|
| Backend unit and integration tests | Pytest verifies services, API endpoints, authentication, watchlists, reviews, and TMDB integration |
| Frontend tests | Vitest and Testing Library verify components, queries, validation, and selected interaction flows |
| Architecture tests | PytestArch and custom tests check the boundaries between backend layers |
| End-to-end tests | Playwright tests the running Docker application through the browser |

The tests run in GitHub Actions together with linting, builds, and SonarQube analysis before container images are published.

