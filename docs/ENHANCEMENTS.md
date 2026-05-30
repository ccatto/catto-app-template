# Template Enhancements Backlog

> Improvements identified for the `catto-app-template` repo itself (not for any app spawned from it).
> Captured 2026-05-30 on branch `feat-may-2026-updates`.

The template is in solid shape overall: clean git hygiene (no `node_modules`/`dist`/`.next`
tracked, `.env` examples only), tests across the stack (Jest + Vitest + Playwright), accurate
docs, and the GitHub "template repository" feature enabled. The items below are concrete
improvements found during a review, ranked by impact.

## High impact

### 1. Turbo is configured but never actually used
Root `package.json` scripts run `yarn workspaces run build/lint/test/dev`, which bypasses Turbo
entirely — so there is no caching and no parallelism despite shipping the `turbo` dependency and
maintaining `turbo.json`.

- **Fix:** switch root scripts to `turbo run build`, `turbo run lint`, `turbo run test`,
  `turbo run dev`.
- **Alternative:** drop Turbo if intentionally unused.

### 2. No CI/CD
There is no `.github/workflows/`. A single `ci.yml` running
`yarn install → lint → test → build` on every PR would catch breakage in the template and in
every app generated from it.

- **Fix:** add `.github/workflows/ci.yml`.

## Medium impact

### 3. `check-types` in `turbo.json` is dead config
`turbo.json` defines a `check-types` task, but no app defines a matching `check-types` script, so
it no-ops.

- **Fix:** add `"check-types": "tsc --noEmit"` to each app's `package.json`, **or** remove the
  task from `turbo.json`.

### 4. `.claude/settings.local.json` is committed
Machine-specific Claude settings ship in the template and propagate to every new app.

- **Fix:** add `.claude/settings.local.json` to `.gitignore` and `git rm --cached` it.

### 5. App name (`MyApp` / `com.example.myapp`) is hardcoded in ~8 scattered places
Found in: signin/register page titles, `apps/backend/src/auth/webauthn.service.ts`,
`apps/mobile/capacitor.config.ts` (`appId`/`appName`), `HeaderCatto`, `FooterCatto`. For a template
whose purpose is to be cloned, this is the biggest day-to-day friction.

- **Fix (centralize):** drive the app name from a single source (env var or `lib/constants.ts`
  `APP_NAME`) so a new app changes one place.
- **Fix (automate):** add `scripts/init-app.sh` that prompts for app name + bundle id and does the
  find-replace, including renaming the `@ccatto-app/*` workspace scope. Turns the manual rename
  checklist into one command.

## Already good — do not change
- Git hygiene and `.gitignore` `.env` coverage.
- Docs (`CLAUDE.md`, `GETTING-STARTED.md`) accurate and matching the code (Next 16, etc.).
- Test setup present across frontend, backend, and e2e.

## Per-new-app rename checklist (until #5 is automated)
| File | Current | Change to |
|---|---|---|
| `package.json` | `"name": "catto-app-template"` | new app slug |
| `apps/*/package.json` (×4) | `@ccatto-app/*` | optional: new scope |
| `apps/mobile/capacitor.config.ts` | `com.example.myapp`, `MyApp` | real bundle id + name |
| `apps/frontend/package.json` | `"description": "Catto App Template - Frontend"` | new description |
| `apps/frontend/messages/en.json` & `es.json` | "Built with the Catto App Template" | brand copy |
| signin/register pages, `webauthn.service.ts` | `MyApp` | app name |
| `README.md` / `CLAUDE.md` | template references | the app |
