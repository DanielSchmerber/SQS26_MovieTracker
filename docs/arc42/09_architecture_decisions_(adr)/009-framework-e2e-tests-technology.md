# ADR09 - Framework end-to-end tests
## Title

Decision to Choose the End-to-End Testing Framework



### Status

accepted


### Context


The testing framework should:

- work well with GitHub CI/CD pipelines
- provide reliable browser automation
- support multiple browsers


Alternatives considered included:

- Cypress
- Selenium
- Puppeteer



### Decision

We propose using Playwright. Playwright provides fast test execution and automatic waiting and synchronization.



### Consequences


**Easier:**

- Cross-browser testing support
- Integration with CI/CD pipelines
- Reliable synchronization and waiting behavior
- Easier maintenance of modern browser tests



**More difficult:**

- E2E tests may become fragile if UI changes frequently 
