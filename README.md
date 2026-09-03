# Crescent International

Industrial machinery catalogue. Public pages and `/admin` read **Postgres only**. Copy lives in Neon; media in the `c1-media` bucket.

## Setup

```bash
pnpm install
cp .env.example .env.local
```

Set `DATABASE_URL`, Better Auth, and object-storage keys in `.env.local`. Apply migrations, seed the catalogue, then create an admin:

```bash
pnpm db:migrate
SEED_CONFIRM=replace-catalogue pnpm db:seed
pnpm dlx auth@latest create-admin --email you@crescentinternational.com --name "Admin" --role admin
pnpm dev
```

`pnpm db:seed` replaces category, product, and site-setting rows (not auth users), so it requires the explicit `SEED_CONFIRM=replace-catalogue` confirmation. Edit afterwards in `/admin`.

## Stack

Next.js App Router, Better Auth, Drizzle, Neon Postgres, React Hook Form on admin forms.
