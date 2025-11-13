# ADR-2: Outline Unit and Integration Testing Strategy

## Status

Accepted

## Date

2024/12 - 2025/01

## Context

I made progress on my ToDo App project as outlined in ADR-1, but there was at least one significant gap in my process: debugging and testing. On my regular work tasks there were times where I simply could not figure out why something wasn't working as expected, and only relied on manual testing and console logs.
Later, I discovered that my Project Manager had previously proposed a testing initiative for the Bluejacketeer project to address regressions and flaky e2e tests, but it had stalled before I joined. When I expressed interest in learning testing, I was assigned tickets from that unfinished subproject, including researching libraries, creating a prototype, and writing a testing plan.

## Decision

I decided to learn about the following tools:

- Chrome DevTools
- React DevTools
- Redux DevTools
- VSCode Debugger
- React Native Debugger

As well as reading the docs of the following testing libraries, after deciding which ones to choose based on talking with AI and searching online:

- Mocha (test runner)
- Chai (assertions)
- Sinon (test doubles)

Later, when I began writing some tests on the ToDoApp I found out I actually needed more:

- Chai as Promised (async assertions)
- Proxyquire (mocking requires)

Lastly, I added the following to create reports, try writing some integration tests, and improve my practice:

- Supertest (hitting the API endpoints)
- Nyc (code coverage)
- Stryker (mutation testing)
- Mochawesome, mocha-multi-reporters (test reports)

My ToDoApp would serve me as a big kata as well as the project's prototype.
On the sidelines, I also researched about testing books, and found these two:

- Lessons Learned in Software Testing, by Kaner, Bach, Pettichord
- The art of software testing, by Myers
I ended up reading both of them.

## Consequences

### Positive

- I improved my debugging skills significantly.
- I learned how to write unit and integration tests for the backend.
- I laid a foundation to practice test-driven development (TDD), which I indeed ended up doing in later tasks at work.

### Negative

- The new Project Manager that followed deprioritized testing work, causing the initiative to stall.
