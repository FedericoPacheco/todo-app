# ADR-5: Choose AWS as Cloud Provider

## Status

Accepted

## Date

2025/10/20

## Context

I'm a junior developer looking to deploy my ToDo application to the cloud. I don't have
any prior experience with cloud providers. I want to maximize my learning, as well as improve my resume for job hunting.
I conducted a brief research on the top three cloud providers:

- AWS:
  - Most established cloud provider with biggest market share, and presumably most job postings
  - Offers the most comprehensive suite of services
  - Steepest learning curve
  - Complex cost structure
  - Offers deep customization and control

- GCP:
  - Best developer experience and easiest to learn
  - Apparently, has the most generous free tier
  - Smallest pool or service offerings
  - Less prevalent in job market of the three
  - Simpler cost structure

- Azure:
  - Strong presence in enterprise sector
  - Strong integration with Microsoft products
  - Good service offerings
  - Simpler cost structure
  - Good developer experience

There are other cloud providers like Oracle, DigitalOcean, Alibaba Cloud, but they have significantly smaller market share.

Sources:

- <https://www.youtube.com/watch?v=4AVQchL9tTo>
- <https://www.youtube.com/watch?v=KF0h215vSUU>
- Claude 4.5

## Decision

Prefer AWS as my cloud provider because it has the better employment prospects and presumably the biggest community and learning resources. Skills learned on AWS can transfer to other cloud providers as well.

## Consequences

### Positive

- I begin acquiring fundamental devops / cloud skills that are widely applicable.

### Negative

- Some lock-in to AWS ecosystem.
- Steeper learning curve compared to GCP and Azure.
