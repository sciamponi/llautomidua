# VPS Preparation Execution Plan - Automatiza Solução

This plan implements the technical foundation for self-hosting the Automatiza Solução ecosystem on a VPS using Docker and PostgreSQL, following the instructions in `VOIDPRO-28.md` and `VOIDPRO-29.md`.

## Technical Objectives
- **Infrastructure**: Dockerize the application and database.
- **Data Persistence**: Configure PostgreSQL with internal networking.
- **Storage Abstraction**: Implement a `StorageProvider` pattern for local-first storage with future S3 compatibility.
- **Health Check**: Add `/api/public/health` for monitoring.
- **Documentation**: Provide a clear `DEPLOY-VPS.md` guide.

## Proposed Changes

### 1. Infrastructure (Docker)
- **Dockerfile**:
  - Multi-stage build (Node 22-alpine).
  - Install dependencies, build the application, and prune dev dependencies.
  - Set production environment.
- **docker-compose.yml**:
  - `app`: TanStack Start app, depends on `db`, restarts on failure.
  - `db`: PostgreSQL 16-alpine with healthcheck and persistent volume at `./data/postgres`.
  - Private network for app-db communication.
- **.env.example**:
  - Document all required variables: `DATABASE_URL`, `APP_URL`, `NODE_ENV`, `WHATSAPP_API_TOKEN`, etc.

### 2. Storage System (Phase 1: Local)
- **Storage Abstraction**:
  - Create `src/lib/storage/types.ts` defining the `StorageProvider` interface.
  - Create `src/lib/storage/local.server.ts` implementing the interface using `fs/promises`.
  - Create `src/lib/storage/index.server.ts` to export the active provider based on environment variables.
- **Directory Structure**:
  - Prepare `/data/storage` with subdirectories: `logos`, `previews`, `uploads`, `documents`.

### 3. Monitoring (Health Check)
- **Route**: `src/routes/api/public/health.ts`.
- **Logic**:
  - Return JSON: `{ status: "ok", database: "ok" }`.
  - Check database connectivity using `prisma.$queryRaw` or similar light check.
  - Return `503 Service Unavailable` if the database is down.

### 4. Integration Audit & Preparation
- **Auth**: Audit current mock auth in `/admin` and `/membros` to ensure it uses `process.env` for any future logic.
- **WhatsApp**: Audit `notifications.functions.ts` to ensure it's ready for real provider keys via `process.env`.
- **Database**: Ensure `prisma/schema.prisma` is ready for the production PostgreSQL connection string.

### 5. Documentation
- **DEPLOY-VPS.md**:
  - Server requirements (2 vCPU, 4GB RAM recommended).
  - Docker & Docker Compose setup.
  - Environment configuration.
  - Reverse Proxy (Nginx/Caddy) and SSL instructions.

## Verification Plan
- **Build Test**: Run `npm run build` to ensure the project bundles correctly for production.
- **Health Check**: Verify the new endpoint locally.
- **Docker Validation**: Run `docker-compose config` (via shell) to validate syntax.
