# Plan: VPS Technical Preparation (FASE 6)

Objective: Complete the technical preparation of the "Automatiza Solução" project for self-hosting on a VPS, focusing on containerization, storage, health monitoring, and audit documentation as per VOIDPRO-31.md.

## Proposed Changes

### 1. Infrastructure (Docker & Environment)
- **Verified**: `Dockerfile` and `docker-compose.yml` exist with appropriate multi-stage builds and persistent volumes.
- **Action**: Add `prisma migrate deploy` to the `docker-compose.yml` command or as part of the `app` entrypoint to ensure the database schema is updated automatically on deployment.
- **Action**: Ensure `DATABASE_URL` in `docker-compose.yml` uses the internal Docker network name `db`.

### 2. Storage Abstraction
- **Verified**: `LocalStorageProvider` implemented in `src/lib/storage/local.server.ts`.
- **Action**: Ensure the storage directories (`/data/storage/logos`, etc.) are explicitly created in the `Dockerfile` (already present) and correctly mapped in `docker-compose.yml`.

### 3. Health Monitoring
- **Verified**: `/api/public/health` exists and handles the absence of `DATABASE_URL` (graceful degradation for preview environment).
- **Action**: Final verification of the health check logic against production requirements.

### 4. Audit & Documentation
- **Action**: Generate the final `docs/VPS-READINESS.md` report with the following specific statuses:
    - **BUILD**: OK (verified via `npm run build`)
    - **DOCKER**: OK
    - **POSTGRESQL**: OK
    - **PRISMA**: OK
    - **STORAGE**: OK
    - **HEALTH CHECK**: OK
    - **AUTH**: MOCK / NOT PRODUCTION READY (Admin/Members currently use local state/mocks)
    - **MASTER ADMIN**: NOT IMPLEMENTED
    - **WHATSAPP**: PARTIAL (Mocked in `src/lib/notifications.functions.ts`)
    - **EMAIL**: PARTIAL (Mocked)
- **Action**: Finalize `DEPLOY-VPS.md` with clear instructions for a fresh install.

## Technical Details
- **Node.js**: 22-alpine
- **PostgreSQL**: 16-alpine
- **Prisma**: v6.19.3
- **Networking**: Private Docker bridge network `internal-network`.
- **Storage**: Local filesystem abstraction at `/data/storage`.

## User Review Required
- **Auth**: The Admin and Members areas currently use mock data and local state. This is marked as "NOT PRODUCTION READY" for authentication. Do you want to proceed with this mock setup for now, or should we implement a real authentication provider (e.g., Supabase Auth or Better Auth) before finalizing the VPS prep?
