# Restaurants-admin

## What this project is

Admin panel (Angular) that consumes restaurants-api's protected routes. Agreed minimum scope: login + managing (view/create/edit) a restaurant's categories and dishes. No need to cover the whole API yet.

## Language

- Code, comments, and project documentation (including this file) → English
- Commits: Conventional Commits with scope, in English. Format: `type(scope): message` — e.g. `feat(login): add auth guard`, `fix(menu): correct validation on create form`
- Scope = the feature folder the change touches: `login`, `register`, `restaurants`, `menu`. Use `core` or `shared` when the change isn't feature-specific, or `app` for the root app shell (`src/app/app.*`)
- Scope is optional: omit it for repo-level files not tied to any folder (this file, README, CI config) — e.g. `docs: add CLAUDE.md with project conventions`
- UI text → Spanish only for now: `DEFAULT_LOCALE` is fixed to `'es'` and the forms create a single translation. ES/EN internationalization is planned (language switcher, initial locale from the browser, translation tabs in the forms, fallback when a translation is missing: the API returns `name: null`). Do it before building new screens

## Architecture

```
src/app/
├── core/
│   ├── auth.ts
│   ├── auth-interceptor.ts
│   ├── auth-guard.ts
│   ├── error-interceptor.ts
│   └── default-locale.ts
├── features/
│   ├── login/
│   │   └── login.ts
│   ├── register/
│   │   └── register.ts
│   ├── restaurants/
│   │   ├── restaurants.ts            (orchestrates the page)
│   │   ├── restaurants-service.ts
│   │   ├── restaurant-interface.ts
│   │   └── restaurant-form/          (reused for create and edit)
│   └── menu/
│       ├── menu.ts                   (categories + dishes for one restaurant)
│       ├── menu-service.ts           (covers both category and dish endpoints)
│       ├── allergens.ts
│       ├── menu-desktop/
│       ├── menu-mobile/
│       ├── category-form/            (reused for create and edit)
│       ├── dish-form/                (reused for create and edit; modal-based)
│       └── dish/                     (standalone detail/edit page, route: /dishes/:id)
└── shared/
    ├── components/                   (danger-icon, layout, logo, modal)
    ├── pipes/
    ├── services/
    ├── interfaces/
    ├── utils/
    └── constants/
```

- No subfolders by file type **inside `features/`** (`services/`, `guards/`, `interceptors/`, `components/`) — current official Angular style guide advises against this for feature code (angular.dev/style-guide). Group only by feature/theme there; only add a sub-directory if a feature grows too large, and split by sub-theme, not by type
- `shared/` is the deliberate exception: it has no "feature" of its own, so it's organized by type (`components/`, `pipes/`, `services/`, `interfaces/`, `utils/`, `constants/`) instead
- Non-component styling infrastructure (SCSS variables/breakpoints meant to be `@use`d across the app) lives in `src/styles/`, a sibling of `src/app/` — it's build-time style infrastructure, not application code, so it doesn't belong under `shared/`
- A component's TS, HTML, and style files share the same base name and sit as siblings (`restaurants.ts`, `.html`, `.scss`). Test files (`.spec.ts`) do too — never a separate `tests/` folder
- Each folder under `features/` = one screen or flow, with standalone components as sibling files inside (no NgModules)
- **Rule for splitting a feature into multiple files**: split when the page has pieces with their own logic or state that can be isolated (whether reused or not — a table, a search bar, a form). Keep a single component when the flow is simple with no natural parts to separate (e.g. login). The goal is keeping each component to a single responsibility (SOLID) and not duplicating logic across screens (DRY), not splitting for its own sake
- Components: no `Component`/`.component` suffix on files or classes: `restaurants.ts` → `class Restaurants`, not `restaurants.component.ts` → `RestaurantsComponent`
- Guards/interceptors: keep a hyphenated suffix — dropping it would make the file too generic to identify at a glance: `auth-interceptor.ts` → `const authInterceptor`, `auth-guard.ts` → `const authGuard`
- Always name by feature, never generic: `Restaurants`/`MenuDesktop`, not `List`/`Desktop`. This also avoids name collisions across folders

## Imports

- Path aliases, configured in `tsconfig.json` (`compilerOptions.paths`, no `baseUrl` — deprecated as of TS 6.0): `@core/*`, `@features/*`, `@shared/*`, `@environments/*`. Use them instead of long relative (`../../../`) chains
- SCSS equivalent: `angular.json`'s `stylePreprocessorOptions.includePaths` includes `src/styles`, so partials there (e.g. `_breakpoints.scss`) can be `@use`d by short path from anywhere

## Backend (restaurants-api)

- Base URL in `environment.ts` (production) / `environment.development.ts` (local dev), never hardcoded in components
- JWT in the `Authorization: Bearer <token>` header, handled by a central interceptor, not manually on each call
- Same layered pattern as the backend: component → service → HTTP call, with centralized error handling

## Commands

- `ng serve` — local development
- `ng test` — unit tests
- `ng build` — production build

## Conventions

- No `any` in TypeScript unless explicitly justified in a comment
- Reactive Forms
