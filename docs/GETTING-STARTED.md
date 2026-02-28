# Getting Started with the Catto App Template

## Prerequisites

- **Node.js**: >= 20.19.0 or >= 22.12.0 or >= 24.0.0
- **Yarn**: 1.22.22 (do NOT use npm — it corrupts the lockfile)
- **PostgreSQL**: 15+ (local or hosted, e.g., Neon)
- **Git**: Latest

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/your-org/your-app.git
cd your-app
yarn install
```

### 2. Set Up Environment Variables

```bash
# Frontend
cp apps/frontend/.env.example apps/frontend/.env.local

# Backend
cp apps/backend/.env.example apps/backend/.env
```

Edit both `.env` files with your database URL, auth secrets, etc.

### 3. Set Up the Database

```bash
# Push the Prisma schema to your database
yarn db:push

# (Optional) Seed with a sample admin user
yarn db:seed

# Open Prisma Studio to inspect data
yarn db:studio
```

### 4. Run Dev Servers

```bash
# Run everything (frontend + backend)
yarn dev

# Or run individually:
yarn dev:frontend    # http://localhost:3000
yarn dev:backend     # http://localhost:4000/graphql
```

## Project Structure

```
your-app/
├── apps/
│   ├── frontend/     # Next.js 16 (web + mobile UI)
│   ├── backend/      # NestJS (GraphQL API)
│   ├── database/     # Prisma ORM
│   └── mobile/       # Capacitor (iOS/Android wrapper)
├── packages/         # Shared @catto/* packages
├── docs/             # Documentation
├── turbo.json        # TurboRepo config
└── package.json      # Root workspace
```

## How To...

### Add a New Feature (Full Stack)

1. **Database**: Add your model to `apps/database/prisma/schema.prisma`, then run `yarn db:push && yarn prisma:generate`
2. **Backend**: Create a new module in `apps/backend/src/modules/your-feature/` with resolver, service, entity, and DTOs
3. **Frontend**: Create pages in `apps/frontend/app/[locale]/...`, add GraphQL queries in `lib/graphql/`, create components in `app/components/`
4. **i18n**: Add translation keys to `messages/en.json` and `messages/es.json`

### Add a New @catto/* Package

1. Create the package in `packages/your-package/`
2. Follow the pattern from existing packages (tsup build, vitest tests)
3. Add it to `apps/frontend/package.json` or `apps/backend/package.json`
4. Run `yarn install` to link the workspace

### Add a New Language

1. Create `apps/frontend/messages/XX.json` (copy from `en.json`)
2. Add the locale to `apps/frontend/i18n.ts` (locales array, localeNames, localeFlags)
3. Translate the keys

### Deploy to Fly.io

See the deployment section in CLAUDE.md for commands. General flow:

1. Update version in `package.json`
2. Deploy backend: `fly deploy --config apps/backend/fly.toml`
3. Deploy frontend: `fly deploy` (from root)
4. Run migrations: `npx prisma migrate deploy`

## Key Commands

| Command | Description |
|---------|-------------|
| `yarn dev` | Run all apps in development |
| `yarn dev:frontend` | Frontend only |
| `yarn dev:backend` | Backend only |
| `yarn build` | Build everything |
| `yarn db:push` | Push Prisma schema to DB |
| `yarn db:studio` | Open Prisma Studio |
| `yarn prisma:generate` | Generate Prisma client |
| `yarn test` | Run all tests |
| `yarn prettier` | Format all code |
| `yarn lint` | Lint all packages |

## Packages Included

| Package | Purpose |
|---------|---------|
| `@catto/ui` | Component library (ButtonCatto, CardCatto, etc.) |
| `@catto/logger` | Pino logger interface |
| `@catto/react-auth` | Frontend auth hooks |
| `@catto/react-contact` | Contact form hooks |
| `@catto/react-mobile` | Capacitor mobile hooks |
| `@catto/react-push` | Push notification hooks |
| `@catto/profanity` | Content moderation |
| `@catto/shared` | Shared types/utils |
| `@catto/nest-auth` | Backend auth module |
| `@catto/nest-email` | SendGrid email |
| `@catto/nest-payments` | Stripe payments |
| `@catto/nest-push` | Firebase push |
| `@catto/nest-recaptcha` | reCAPTCHA verification |
| `@catto/nest-sms` | Telnyx SMS |

> **Note**: These packages are currently copied into the `packages/` directory. In a future phase, they will be published to npm and referenced as external dependencies.

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS v4, Apollo Client
- **Backend**: NestJS 11, Apollo Server 4, GraphQL
- **Database**: PostgreSQL + Prisma 7
- **Auth**: Better Auth + JWT (dual-auth system)
- **Mobile**: Capacitor 8 (iOS/Android)
- **Monorepo**: Yarn Workspaces + TurboRepo
- **Testing**: Vitest (frontend), Jest (backend)
