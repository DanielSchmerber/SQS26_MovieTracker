# 11 - Risks and Technical Debt

## 11.1 Technical risks

| ID | Risk | Description |
|----|--------------|---------------|
| TR1 | External API Dependency | The system depends on the TMDB API for movie information |
| TR2 | External API Data Changes |   TMDB API response formats may change over time |
| TR3 | Integration Complexity |  Integrating TanStack components with backend APIs and state management may become complex |
| TR4 | Supply chain attack | The project depends on external Python (pip) and JavaScript (npm) packages, which are common targets for supply chain attacks |                                                                        



## 11.2 Business/domain risks

| ID | Risk | Description |
|----|--------------|---------------|
| BR1 |   API Policy Changes   |  TMDB may change pricing, authentication methods, or API usage policies |
| BR2 |   TMDB Service Availability  |  The functionality relies heavily on TMDB services  |


## 11.3 Technical debt


| ID | Technical debt | Description |
|----|--------------|---------------|
| TD1 | Monolithic Backend Structure | The MVC backend may become difficult to maintain as features grow |
| TD2 | Tight Coupling to TanStack APIs and Fast API |  Frontend implementation may become strongly dependent on TanStack-specific patterns and backend on Fast API |
