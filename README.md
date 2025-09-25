## Dev setup

1. `cp .env.example .env` (create one if missing)
2. `npm install`
3. `npm run prisma:generate`
4. Start DB + API: `docker compose up --build`

# Assessment Backend API

- Runtime: Node.js + TypeScript
- Framework: Express
- DB: PostgreSQL via Prisma
- Testing: Jest

## Quickstart

```bash
npm install
# Create .env
# NODE_ENV=development
# PORT=4000
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app_dev?schema=public"
# JWT_SECRET="replace-with-a-long-random-string"

Minimal skeleton with Prisma + Postgres. Add your own models, routes, and migrations.
```

## Auth (JWT) and RBAC

This service supports simple JWT-based authentication and role checks.

### Environment

- Set `JWT_SECRET` to a strong random string.

### Migrations

After updating env and dependencies, run:

```bash
npm run prisma:generate
npm run prisma:migrate
```

## Scripts

- `npm run dev` - start dev server (tsx watch)
- `npm run build` - compile TS to dist/
- `npm test` - run tests

## Notes

- No classes: functional modules + factories only.
- HTTP validation with Zod.
