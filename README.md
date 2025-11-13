# TodoApp

A comprehensive full-stack ToDo application.

## Table of Contents

- [Overview](#overview)
- [Quickstart](#quickstart)
- [Back-end](#back-end)
  - [Architecture](#architecture)
  - [API](#api)
- [Front-end](#front-end)
  - [Components](#components)
  - [Styles](#styles)
  - [State management + async operations](#state-management--async-operations)
  - [Bundling](#bundling)
- [Testing](#testing)
- [Deployment / Production](#deployment--production)
- [CI / CD](#ci--cd)

## Overview

The system consists of a monolithic back-end API server, relational database, key-value store for sessions, and a single-page application front-end. Key features include:

- User sign up, authentication and authorization.
- CRUD + state management (pending, completed) operations for ToDo items.

Technologies used:

- Back-end: Sails (Node.js), PostgreSQL, Redis.
- Front-end: React, Redux, Redux-saga, Webpack, Axios.
- Testing: Mocha, Sinon, Chai, Supertest, Proxyquire, Faker, Nyc, Stryker, Playwright.
- CI/CD: Husky, GitHub Actions, Docker Compose.
- Deployment: AWS LightSail, Nginx, Docker Compose, acme.sh (Let's Encrypt).
- Others: ESLint, Prettier.

See [C4 Context Diagram](docs/diagrams/C4_Context.svg) and [C4 Container Diagram](docs/diagrams/C4_Containers.svg) for architecture overviews.

Key decisions and their rationale are documented in [Architecture Decision Records (ADRs)](docs/adrs/).

Production link: <https://todo.federicopacheco.dev>

## Quickstart

1. Create a Docker network and start the services:

    ```bash
    docker network create todo-net
    docker compose -f back-end/docker-compose.yaml up -d
    docker compose -f front-end/docker-compose.yaml up -d
    ```

2. Configure certificates locally. See [docs/certificates-config-dev.md](docs/certificates-config-dev.md) for details.

3. Access from the browser: <https://localhost:3000>.

## Back-end

### Architecture

The application follows a layered MVC + service architecture. Resorting to a repository/database layer was deemed unnecessary for the scope of this project. See [C4 Component Diagram](docs/diagrams/C4_Components.svg) for internal structure.

### API

The application server exposes the following RESTful API endpoints:

```text
GET /api/todo
GET /api/todo/:id
POST /api/todo
PUT /api/todo/:id
DELETE /api/todo/:id
PATCH /api/todo/:id
```

```text
POST /api/auth/signup
POST /api/auth/logout
POST /api/auth/login
GET /api/auth/status
GET /api/auth/csrf
```

```text
GET /api/health
```

## Front-end

### Components

Components implement behavior for two main views: authentication (login, signup) and ToDo list management (view, search, create, update, delete, change state). React Router is used to handle routing between the authentication and main ToDo views.

### Styles

SASS is used, with files for common styles, mixins and variables, as well as component-specific styles.

### State management + async operations

The redux store is structured as follows:

```text
{
  "app": {
    "apiStatus": "API_LOADING" | "API_SUCCESS" | "API_ERROR",
    "authStatus": "AUTH_REQUIRED" | "AUTH_SUCCESS" | "AUTH_ERROR",
  },
  "todos": {
    "list": {
      "<id>": {
        "id": <id>,
        "text": <string>,
        "state": "PENDING" | "COMPLETED",
        "createdAt": <timestamp>,
        "updatedAt": <timestamp>
      }
    },
    "nextSeq": <number>
  }
}
```

Updates to the store are handled through predefined actions, action creators, reducers, and sagas (generator functions) for API calls.

### Bundling

Webpack is used to bundle the application, with separate configurations for development, CI and production environments.

## Testing

The project includes a suite of:

- 51 unit tests covering controller and service layers, with a coverage of >90% for statements, branches, functions and lines.

```bash
cd back-end
npm run unit-test:coverage
```

- 12 integration tests covering individual API ToDo endpoints as well as a complete user flow (require services to be already running).

```bash
cd back-end
npm run integration-test  
```

- 5 end-to-end tests covering complete user flows from the front-end (require services to be already running).

```bash
cd front-end
npm run e2e-test
```

- Mutation tests (see: [Wikipedia](https://en.wikipedia.org/wiki/Mutation_testing), [Robert Martin's blog](https://blog.cleancoder.com/uncle-bob/2016/06/10/MutationTesting.html)) reports to apply mutations to source code and verify the robustness of the unit tests.

```bash
cd back-end
npm run unit-test:mutate path/to/file
```

Including React components tests was deemed unnecessary since they are covered indirectly through end-to-end tests.

## Deployment / Production

Deployed on AWS Lightsail with an Nginx reverse proxy and SSL. See [C4 Deployment Diagram](docs/diagrams/C4_Deployment.svg) and [deploy-notes.md](docs/deploy-notes.md) for details.

## CI / CD

Husky is used to apply format and lint changes to code before committing locally. Later, when pushing to remote, there are three main workflows that run on GitHub Actions:

- `CI-Development`: runs on push operations and pull requests to the development branch. Builds a Node.js environment, checks out the code, performs linting and formatting checks, runs the full unit test suite and updates individual tests and code coverage reports.
- `CI-Main`: runs on pull requests to the main branch. Runs the same steps as the development workflow, as well as building and starting the back-end and front-end services using Docker Compose, runs integration and end-to-end tests and uploads their reports. On failures, it tests connectivity between services and displays services' logs. Successful checks are a prerequisite for merging pull requests to main.
- `CD-Main`: runs on push operations to the main branch. It performs the following steps:
  - Front-end: checks out the code, installs front-end dependencies, builds static files through Webpack, connects to the server through SSH to delete stale files, uploads the new files through SCP to be served by Nginx.
  - Back-end: connects to the server through SSH, pulls the latest changes from the main branch, passes environment variables, makes a database backup, stops, rebuilds and restarts the services through Docker Compose, runs database migrations, and performs basic health checks.
  On healthcheck failures, it performs the same steps outlined above, rolling back one commit and restoring the database from the latest backup.
