# 10 - Quality Requirements

## 10.1 Quality Requirements Overview

#### Quality Requirements

- **Usability**
  - Simple movie search
  - Easy navigation
  - Public access without login

- **Reliability**
  - Stable TMDB API communication
  - Retry mechanism for failed requests
  - Consistent movie data retrieval

- **Maintainability**

- **Security**
  - User authentication
  - Protected watchlist access
  - Token-based authentication


## 10.2 Quality scenarios

#### [Reliability]

**Scenario ID :** SC1
**Scenario Name :** Reliable Communication with External TMDB API

**Stimulus :** The TMDB API temporarily fails or becomes unreachable
**Source :**	External TMDB API
**Environment :** Runtime communication with external services
**Response :** The backend retries failed API requests automatically
**Response Measure :** The system retries communication up to 3 times before returning an error

#### [Security]
**Scenario ID:** SC2
**Scenario Name :** Protected Access to Watchlist
**Stimulus:** An unauthenticated user attempts to access protected watchlist functionality
**Source:** External user
**Environment	:** Runtime application access
**Response :** The system denies access and requires authentication
**Response Measure :** Only authenticated users can modify or access personal watchlists