# Restaurants-admin

## What this project is
Admin panel (Angular) that consumes restaurants-api's protected routes. Agreed minimum scope: login + managing (view/create/edit) a restaurant's categories and dishes. No need to cover the whole API yet.

## Language
- Code, comments, and project documentation (including this file) → English
- Commits: Conventional Commits with scope, in English. Format: `type(scope): message` — e.g. `feat(login): add auth guard`, `fix(dishes): correct validation on create form`
- Scope = the feature folder the change touches: `login`, `restaurants`, `categories`, `dishes`. Use `core` or `shared` when the change isn't feature-specific
- UI text → Spanish for now. Multi-language support (i18n) is planned for later, not a priority yet

## Architecture
```
src/app/
├── core/
│   ├── services/
│   ├── guards/
│   └── interceptors/
├── features/
│   ├── login/
│   │   └── login.ts
│   ├── restaurants/
│   │   ├── restaurant-list.ts        (orchestrates the page)
│   │   └── components/
│   │       ├── restaurant-table.ts
│   │       └── restaurant-search-bar.ts
│   ├── categories/
│   │   ├── category-list.ts
│   │   └── components/
│   │       └── category-form.ts      (reused for create and edit)
│   └── dishes/
│       ├── dish-list.ts
│       └── components/
│           └── dish-form.ts          (reused for create and edit)
└── shared/
```
- Each folder under `features/` = one screen or flow, with standalone components inside (no NgModules)
- **Rule for splitting a feature into subcomponents**: split when the page has pieces with their own logic or state that can be isolated (whether reused or not — a table, a search bar, a form). Keep a single component when the flow is simple with no natural parts to separate (e.g. login). The goal is keeping each component to a single responsibility (SOLID) and not duplicating logic across screens (DRY), not splitting for its own sake
- No `Component`/`.component` suffix on files or classes (current Angular style guide): `restaurant-list.ts` → `class RestaurantList`, not `restaurant-list.component.ts` → `RestaurantListComponent`
- Always name by feature, never generic: `RestaurantList`/`RestaurantTable`, not `List`/`Table`. Without the suffix, this also avoids name collisions across folders (two `list.ts` files in different features)

## Backend (restaurants-api)
- Base URL in `environment.ts` / `environment.prod.ts`, never hardcoded in components
- JWT in the `Authorization: Bearer <token>` header, handled by a central interceptor, not manually on each call
- Before building the listing view (Phase 3): confirm GET /restaurants tests pass locally (`npm run test` in restaurants-api, with the test DB synced via `npx dotenv -e .env.test -- npx prisma migrate deploy`)
- Same layered pattern as the backend: component → service → HTTP call, with centralized error handling

## Commands
- `ng serve` — local development
- `ng test` — unit tests
- `ng build` — production build

## Conventions
- No `any` in TypeScript unless explicitly justified in a comment
- Reactive Forms

## Roadmap context
- Phases and steps documented in Notion → "Restaurants-admin" page (5 phases, each with its own sub-items)
- This project is also referred to as "Dashboard" in the note about replacing Maps App in the portfolio: deploying a live demo (Phase 5) is what unblocks that replacement
