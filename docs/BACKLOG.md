# Catto App Template — Backlog

> Tactical to-do list for getting the template to a known-good baseline before it's forked into product apps (PicklePaddleReviews, etc.). Strategy lives in `PICKLE-PADDLE-REVIEWS-PLAN.md`; this is the punch list.

## Status snapshot

- `chore/template-audit` audit branch committed (525 files: `@catto/*` → `@ccatto/*`, in-tree `packages/ui` removed, workspaces narrowed to `apps/*`).
- `yarn install` ran on the audit branch.
- **Not yet verified that `yarn dev` boots end-to-end.** That's the next gate.

## Verify the template boots (current focus)

Goal: prove the template runs cleanly against the published `@ccatto/*@1.x` packages before anyone forks it.

### Pre-boot checklist

- [ ] `apps/frontend/.env.local` exists (copy from `apps/frontend/.env.example`)
- [ ] `apps/backend/.env` exists (copy from `apps/backend/.env.example`)
- [ ] Postgres reachable (local instance or Neon URL set in backend `.env`)
- [ ] `yarn prisma:generate` runs without errors
- [ ] `yarn db:push` succeeds against the target DB
- [ ] Review `yarn install` output for peer-dep warnings — note any Capacitor 7 vs 8 or Next 15 vs 16 complaints

### Boot test

- [ ] `yarn dev` starts both apps without crashing
- [ ] Frontend loads at `http://localhost:3000`
- [ ] Backend GraphQL playground loads at `http://localhost:4000/graphql`
- [ ] Sign-in flow works (Better Auth OAuth path AND JWT email/password path)
- [ ] At least one `@ccatto/ui` component renders on the home page (proves the package is wired up)
- [ ] No console errors related to `@ccatto/*` imports

### Likely failure modes to watch for

- **Missing export from `@ccatto/ui`** — something the in-tree `packages/ui` exported that the published `1.1.0` doesn't. Symptom: `Module '"@ccatto/ui"' has no exported member 'X'`.
- **Peer-dep runtime mismatch** — Capacitor 8 in template vs Capacitor 7 in package peerDeps. Symptom: mobile hook errors, React rendering twice.
- **Type errors in `apps/backend`** — auth decorators/guards were heavily modified during the rewrite.
- **Missing env vars** — published packages may expect SendGrid / Telnyx / Stripe / FCM / reCAPTCHA keys that aren't in `.env.example`.

## After boot is green

- [ ] Update `README.md` to reflect npm-only flow (no more in-tree `packages/ui`)
- [ ] Confirm `.env.example` files cover everything the published packages need
- [ ] Decide whether `apps/mobile` stays in the default template or becomes opt-in
- [ ] Open PR for `chore/template-audit` → merge to `main`
- [ ] Tag `v0.1.0-baseline` on `main` so PPR can fork from a known-good commit

## Sister-repo work (`catto-packages`)

Tracked here because the template can't ship until these are resolved.

- [ ] Commit the untracked `CLAUDE.md` in `catto-packages`
- [ ] Patch peer-dep drift: bump Capacitor 7 → 8, Next 15 → 16 in package devDeps/peerDeps
- [ ] Republish anything affected (likely `@ccatto/ui`, `@ccatto/react-mobile`, `@ccatto/react-push`)
- [ ] Bump versions in template `apps/*/package.json` once republished

## Pre-scaffold decisions (before PPR repo is created)

- [ ] **Final app name** — `PicklePaddleReviews` / `PaddleRater` / `PicklePulse` / `DinkReviews` / `PickleHub`
- [ ] **Repo strategy** — fork template per app vs single mono with multiple `apps/*`

## Out of scope for this backlog

- Storybook coverage audit on `@ccatto/ui` (nice-to-have, not blocking PPR)
- Sanity-pass of each package README (do as packages are touched)
- Domain layer for PPR (Prisma models, resolvers, review UI) — starts only after baseline tag is cut
