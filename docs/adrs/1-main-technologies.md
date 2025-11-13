# ADR-1: Use the same main technologies as in Bluejacketeer

## Status

Accepted

## Date

2024/10

## Context

When I entered Serfe as a junior developer, my first job ever, I was handed a list of online courses to complete and documentation to read about the following topics:

- JavaScript
- Git
- Docker
- Modern (functional) and legacy (classes) React
- Redux
- Webpack
- Sails.js
- React Native (didn't complete this one)

I could spend max 12 hours per week in training, alongside my regular work. These were focused on the main technologies used in the project I was assigned to, Bluejacketeer. As I was doing it, I noticed reading alone or watching a guy talking about some technical topic was not enough. I needed to practice what I learned somehow, and the project's codebase was intimidating at times (can't talk much, I signed a NDA `:(`).
After finishing the React courses, I ended up with a small and working ToDoApp GUI.

## Decision

I extended the GUI by adding:

- A redux store
- Webpack bundling and dev server
- A Sails.js backend with a REST API with hot-reloading
- A postgres database
- A redis session store
- PgAdmin for database management
- Docker compose files to containerize the whole application
- Other nice-to-haves like ESLint, Prettier, Husky, lint-staged.

I created a GitHub account with my work email (now defunct, but hopefully rescued this repo) and pushed the code there.
This way, I could practice all the main technologies used in Bluejacketeer in a smaller and more manageable codebase.

## Consequences

### Positive

I had a real proof of at least basic proficiency in the main technologies of the project, and could use it as a learning reference later on.

### Negative

I spent more time on this than what I think the company actually wanted me to do, but didn't get any wake-up calls.
