# TodoApp

A comprehensive full-stack ToDo application.

## Overview

The system consists of a monolithic API server that follows the MVC + service layer (business logic) pattern, a relational database for persistence, a key-value store for session management, and a single-page application (SPA) monolithic front-end. The system also features a large suite of automated tests (unit, integration, end-to-end + mutation), basic security, pre-commit hooks, code formatting and linting and a CI/CD pipeline.

Main technologies used:

- Back-end: Sails (Node.js), PostgreSQL, Redis.
- Front-end: React, Redux, Redux-saga, Webpack.
- Testing: Mocha, Sinon, Chai, Supertest, Proxyquire, Faker, Nyc, Stryker, Playwright.
- CI/CD: Husky, GitHub Actions, Docker, Docker Compose.
- Deployment: AWS (WIP).
- Others: ESLint, Prettier.

Key features include:

- User sign up, authentication and authorization.
- CRUD + state management (pending, completed) operations for ToDo items.

Production link: WIP

## Quickstart

1. Create a Docker network and start the services:

    ```bash
    docker network create todo-net
    docker compose -f back-end/docker-compose.yaml up -d
    docker compose -f front-end/docker-compose.yaml up -d
    ```

2. Configure certificates locally. See [back-end/config/ssl/readme.md](back-end/config/ssl/readme.md) for details.

3. Access from the browser: <https://localhost:3000>.

## Back-end

### Architecture

The application follows a closed "layered" / MVC + service architecture:

- **Controllers**: Handle incoming HTTP requests, invoke services, and send responses.
- **Services**: Contain the business logic and interact with models' functions and the ORM (Waterline) to perform operations.
- **Models**: Represent the domain entities, with their attributes and relationships.

Controllers do NOT interact directly with models or the database, nor contain significant business logic.
Recurring to a repository/database layer was deemed unnecessary for the scope of this project.

### Data model

The system has only two entities with the following corresponding attributes:

- User: id, name, password (hashed), createdAt, updatedAt.
- ToDo: id, text, state (pending, completed), owner (foreign key), createdAt, updatedAt.

### API

The application server exposes the following RESTful API endpoints:

```text
GET /api/todo
GET /api/todo/:id
POST /api/todo
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

Components cover behavior for two main views: authentication (login, signup) and ToDo list management (view, search, create, delete, change state). React Router is used to handle routing between the authentication and main ToDo views.

### Styles

SASS is used, having files for common styles, mixins and variables, as well as component-specific styles.

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

Updates to the store are handled through predefined actions, action functions, reducers and sagas generator functions for API calls.

### Bundling

Webpack is used to bundle the application, with separate configurations for development, CI and production environments.

## Testing

The project includes a suite of:

- 51 unit tests covering controller and service layers, with a coverage of >90% for statements, branches, functions and lines.

```bash
cd back-end
npm run unit-test:coverage
```

- 12 integration tests covering individual API ToDo endpoints as well as a complete user flow (require previously lifted services).

```bash
cd back-end
npm run integration-test  
```

- 5 end-to-end tests covering complete user flows from the front-end (require previously lifted services).

```bash
cd front-end
npm run e2e-test
```

- Mutation tests reports to apply mutations to source code and verify the robustness of the unit tests.

```bash
cd back-end
npm run unit-test:mutate
```

## CI / CD

Husky is used to apply format and lint changes to code before committing locally. Later, when pushing to remote, there are three main workflows that run on GitHub Actions:

- CI-Development: runs on pushes and pull requests to the development branch. Builds a node instance, checkouts the code, performs linting and formatting checks, runs the full unit test suite and updates individual tests and code coverage reports.
- CI-Production: runs on pushes and pull requests to the main branch. Runs the same steps as the development workflow, as well as building and starting the back-end and front-end services using Docker Compose, runs integration and end-to-end tests and uploads their reports. On failures, it tests connectivity between services and displays services' logs.
- CD-Production: WIP

## Deployment / Production

WIP
