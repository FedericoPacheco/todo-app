# ADR-4: Choose Playwright as E2E Testing Library

## Status

Accepted

## Date

2025/09

## Context

I no longer worked at Serfe. There were some e2e tests in Bluejacketeer written with CodeceptJS, but I had no obligation to follow the strategy outlined in ADR-1 anymore.
After research it seemed that most popular libraries were Playwright, Cypress and Selenium.
Features of each:

- Playwright:

  - Supports multiple browsers (Chromium, Firefox, WebKit + mobile emulation) + parallel execution
  - Good for new projects / modern applications
  - Rising in popularity
  - Very fast execution time
  - Supports multiple languages (JavaScript, Python, C#, Java)

- Cypress:

  - Supports multiple browsers (Chromium, Firefox, WebKit, Electron)
  - Slow execution time
  - Easy to set up and use
  - JavaScript only

- Selenium:

  - Supports multiple languages (JavaScript, Java, Ruby, others)
  - Long-established and widely used
  - Supports multiple browsers
  - Seems more complex overall

Source: <https://dev.to/mteheran/comparison-of-automation-frameworks-selenium-playwright-and-cypress-3h8i>

## Decision

Preferred Playwright as my project was greenfield and I wanted to learn e2e testing with a modern library and a good dev experience.

## Consequences

### Positive

- Introduced myself successfully to e2e testing with relatively low friction.
- Gained experience is transferable to other libraries.

### Negative

- I may miss job opportunities on older projects that use Selenium.
