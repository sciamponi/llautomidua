# Plan: VPS Technical Infrastructure (FASE 6.1)

Objective: Finalize the infrastructure for self-hosting in a VPS, focusing on data persistence, safe Prisma migrations, and comprehensive documentation of production-readiness gaps (Auth, WhatsApp, Email).

## Infrastructure & Docker Enhancements

### 1. Production Entrypoint & Safe Migrations
- Create `docker-entrypoint.sh` to safely manage startup:
  - Wait for PostgreSQL availability using `pg_isready`.
  - Execute `npx prisma migrate deploy` only once during startup.
  - Start the application (`node .output/server/index.mjs`) only after successful migration.
- Update `Dockerfile` to include this entrypoint.
- Update `docker-compose.yml` to use the entrypoint.

### 2. Networking & Environment
- **Verified**: Internal network `internal-network` is configured.
- Ensure `DATABASE_URL` in `docker-compose.yml` points to `db:5432`.

### 3. Storage Persistence
- **Verified**: Volumes are mapped for `/data/storage`.
- Ensure all subdirectories (`logos`, `previews`, `uploads`, `documents`) are preserved via the single `storage-data` volume mapping.

## Monitoring & Health Check
- **Verified**: `/api/public/health` correctly handles preview vs production connectivity.
- No changes needed to the logic, but confirm it meets the HTTP 200/503 requirements for production monitoring.

## Documentation (Audit & Readiness)

### 1. VPS Readiness Report (`docs/VPS-READINESS.md`)
- Update statuses to reflect the current technical state:
  - `BUILD: OK`
  - `DOCKER: OK`
  - `POSTGRESQL: OK`
  - `PRISMA: OK`
  - `STORAGE: OK`
  - `HEALTH CHECK: OK`
  - `AUTH: NOT PRODUCTION READY` (Explicitly mention mock status)
  - `MASTER ADMIN: NOT IMPLEMENTED`
  - `WHATSAPP: PARTIAL` (Reference `src/lib/notifications.functions.ts`)
  - `EMAIL: PARTIAL`
- Add "Next Phase Recommendations" comparing **Better Auth** vs **Supabase Auth** for VPS.

### 2. Deploy Guide (`DEPLOY-VPS.md`)
- Update with the new entrypoint logic and final environment variable list.

## Verification
- Run `npm run build` to ensure no regressions.
- Validate `docker compose config` (if possible in sandbox, otherwise document as "Validation not executed").

## User Review Required
- **Auth Strategy**: We are documenting the current Auth as Mock/Not Ready. In the next phase, which provider do you prefer for VPS self-hosting: **Better Auth** (high TanStack Start compatibility) or a self-hosted **Supabase Auth** instance?
