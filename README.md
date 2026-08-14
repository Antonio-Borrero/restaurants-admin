# Restaurants Admin

Admin panel for [restaurants-api](restaurants-api-github-url) — consumes its protected routes to manage a restaurant's categories and dishes. Built as a portfolio project, to give restaurants-api something visible and interactive beyond a Postman collection.

## Status

🚧 Early development, following a 5-phase roadmap:

- [ ] Phase 1 — Project setup
- [ ] Phase 2 — Authentication
- [ ] Phase 3 — Restaurant listing
- [ ] Phase 4 — Categories & dishes CRUD
- [ ] Phase 5 — Deployment

Deploying a live demo (Phase 5) is what unblocks replacing an older entry in the portfolio with this project.

## Tech stack

- Angular (standalone components)
- TypeScript
- Consumes [restaurants-api](restaurants-api-github-url): Node 24, PostgreSQL, JWT auth, layered architecture (routes → controllers → services)

## Getting started

### Prerequisites

- Node.js 24+
- [restaurants-api](restaurants-api-github-url) running locally (see its own README) — this app has nothing to talk to without it

### Installation

```bash
git clone <repo-url>
cd restaurants-admin
npm install
```

### Configuration

Set the backend URL in `src/environments/environment.development.ts` (used automatically by `ng serve`):

```ts
export const environment = {
  apiUrl: 'http://localhost:3000',
};
```

### Run locally

```bash
ng serve
```

Runs at `http://localhost:4200`.

## Conventions

Architecture, naming, and commit conventions live in [CLAUDE.md](./CLAUDE.md) — check it before adding a new feature or component.
