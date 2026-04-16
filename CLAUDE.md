# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Type-check (no emit)
npx tsc --noEmit

# Build (bundles to build/index.js)
npm run build
```

There is no test runner configured.

## Runtime & Deployment

This is a **`@chayns-codes/http` API** — a proprietary serverless runtime. It is not a standard Node.js HTTP server. Two globals are provided by the runtime and declared in [src/utils/runtime.d.ts](src/utils/runtime.d.ts):

- **`chayns.storage`** — key-value store used as the database. Handles JSON serialization automatically; never stringify/parse manually.
- **`@chayns-codes/http`** — `Api` builder for routing, used in [src/index.ts](src/index.ts).

The build bundles all source into `build/index.js` with `@chayns-codes/http` marked as external (provided by the runtime).

## Architecture

The codebase follows a strict three-layer pattern for each resource:

```
src/
  index.ts                  — Route registration only (Api builder chain)
  api/{resource}/
    *.controller.ts         — Input validation + returns ApiResponse objects
    *.handler.ts            — Business logic, orchestrates repositories
    *.types.ts              — Input types (request bodies) and DTOs (response shapes)
  resources/{resource}/
    *.model.ts              — TypeScript type for the stored shape (Resource)
    *.repository.ts         — CRUD via Storage class
  utils/
    storage.ts              — Storage class wrapping chayns.storage (typed list ops)
    storageKeys.ts          — STORAGE_KEYS constants (single source of truth for keys)
    api.types.ts            — ApiRequest / ApiResponse generic types
    runtime.d.ts            — Ambient declarations for chayns.* and @chayns-codes/http
```

### Type conventions

Three distinct type shapes per resource:
- **`*Resource`** — the stored shape (e.g., `PersonResource`). Contains foreign key IDs (e.g., `birthDateId`, `userKeyId`).
- **`*Dto`** — the API response shape. Foreign keys are expanded to full nested objects.
- **`Create*Input`** — the request body shape. Mirrors Dto but without `id`.

### Storage layer

`Storage` in [src/utils/storage.ts](src/utils/storage.ts) provides generic typed list operations (`get`, `set`, `add`, `remove`, `update`) on top of `chayns.storage`. All resources are stored as arrays under keys defined in `STORAGE_KEYS`. Every stored item must have an `id: string` field.

**Sequential writes are required.** The storage behaves like `localStorage` — every write operation reads the current list, modifies it, and writes the entire list back. Running multiple write operations in parallel (e.g. via `Promise.all`) can cause race conditions where an older read overwrites a newer write. Always use a `for...of` loop with `await` when performing multiple writes to the same storage key.

### Auth / multi-tenancy

There is no session auth. A `userKey` (UUID) is generated via `POST /auth/user-key` and passed as a query parameter (`?userKey=...`) on all subsequent requests. All person data is scoped to this key via `userKeyId` on the `PersonResource`.

`userKeyId` is an internal field and must **never** appear in API responses. Always strip it when constructing DTOs (via destructuring or `Omit`).

### Extending an existing resource vs. adding a new resource

- **Extend an existing resource** (add fields to the model) when the data is a 1:1 property of that resource — it always exists once, belongs to exactly one instance, and has no independent lifecycle. Example: adding a `nickname` field to `PersonResource`.
- **Create a new resource** when the data is a 1:N collection, can exist multiple times per parent, or needs independent CRUD operations. Example: `residences` — a person can have many, and each residence is created/deleted individually.

As a rule of thumb: if you'd model it as an array on the parent, it belongs in its own resource with a `parentId` foreign key.

### Naming conventions

- **Folders**: kebab-case (e.g., `fuzzy-dates/`, `user-keys/`)
- **Files**: camelCase base name + dot-separated suffix (e.g., `personResource.model.ts`, `userKey.repository.ts`, `apiError.ts`)
- Suffixes by layer: `.model.ts`, `.repository.ts`, `.handler.ts`, `.controller.ts`, `.types.ts`

### Adding a new resource

1. Add a model type in `src/resources/{resource}/{resourceName}.model.ts`
2. Add a repository class in `src/resources/{resource}/{resourceName}.repository.ts` using `Storage` + a new `STORAGE_KEYS` entry
3. Add handler + controller + types under `src/api/{resource}/`
4. Register routes in `src/index.ts`
5. Update [api.md](api.md) — add the new routes and DTOs

### Modifying existing routes or types

Whenever routes, request bodies, response shapes, or models change, update [api.md](api.md) to reflect the new contract. The file is the source of truth for frontend consumers and AI agents implementing the API.
