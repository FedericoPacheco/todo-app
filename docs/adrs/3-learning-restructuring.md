# ADR-3: Restructure software engineering learning strategy

**Note**: copy-pasted from my own decision records (yes, I write decision records for my personal life, sue me).

## Status

Accepted

## Date

2025/08/30

## Context

My learning efforts have been focused on reading technical books about various topics: clean code, design patterns, testing, and architecture.
I'm looking for a job and haven't passed interviews for 3 roles so far. Recruiters didn't deem my efforts valuable, and rejected me due to "lack of experience".
I have two projects with different tech stacks and architectures:

- ToDo App (monolith): sailsjs/nodejs, postgres, reactjs, redux/redux-saga, etc.
- TP DAN (distributed, microservices): java/springboot, postgres/mysql/mongodb, rabbitmq, reactjs, nextjs, prometheus, graylog, etc.

## Decision

Adopt a bimodal learning strategy:

1. Theory: keep reading technical books (1/2 of my time):
    - Understanding distributed systems
    - Software architecture: the hard parts
    - Designing data-intensive applications
2. Practice: instead of starting a new project from scratch, "complete" my ToDo App and TP DAN projects and make them publicly accesible (1/2 of my time):
    - Write unit, integration and e2e tests
    - Implement basic security: https, jwt token, etc.
    - Implement CI/CD pipeline.
    - Deploy to cloud provider: aws, gcp, azure
    - Document project (changelog, architecture diagrams and decision records, links, readme).
Work first on the monolith, as it will be simpler. Later move to the distributed system.
Total learning time: ~4hs each day until landing a job.

## Consequences

### Positive

Personal projects act better as professional signaling compared to books, based on recruiter's behavioral tendencies (keyword matching, focus on specific technologies).

### Negative

Small risk of missing my goal of reading all the mentioned books before the end of 2025.
