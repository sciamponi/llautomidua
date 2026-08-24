# Plan: FASE 7 — CONEXÃO REAL COM VPS / POSTGRESQL

This plan prepares the application for production deployment on a VPS with a real PostgreSQL database, ensuring all persistent data (Leads, Products, Sites, Auth) is correctly handled and an automated migration strategy is in place.

## User Review Required

> [!IMPORTANT]
> - **Production Data**: This phase assumes a clean database or one where existing data follows the current schema. `prisma migrate deploy` will be used to ensure no data loss.
> - **Secrets**: You will need to provide `DATABASE_URL`, `MASTER_ADMIN_EMAIL`, and `MASTER_ADMIN_PASSWORD` in your VPS `.env` file.
> - **Preview Mode**: The local preview will continue to work without a database (using mocks) to avoid breaking the development workflow.

## Proposed Changes

### Infrastructure & Deployment
- **Database Migrations**: Initialize the first migration to establish the baseline for the production schema.
- **Docker Entrypoint**: Ensure the `docker-entrypoint.sh` correctly waits for PostgreSQL and applies migrations before starting the app.
- **Backup Strategy**: Create an automated backup script for the PostgreSQL volume.

### Server Logic (Production Ready)
- **Master Admin Bootstrap**: Update the auth logic to automatically create the Master Admin if it doesn't exist, using environment variables.
- **Mock Fallback**: Standardize the "Environment Aware" pattern across all server functions:
  - If `DATABASE_URL` is present: Use PostgreSQL (strict).
  - If `DATABASE_URL` is missing: Use Mocks (only for preview).
- **Storage Persistence**: Verify the `LocalStorageProvider` correctly uses the mounted `/data/storage` volume for all file categories.

### Security
- **Sensitive Variables**: Ensure constants like `JWT_SECRET` and `BOOTSTRAP_SECRET` are strictly server-side.
- **Production Audit**: Final verification of the Health Check contract.

## Technical Details

### 1. Database
- **Baseline Migration**: Run `npx prisma migrate dev --name init` (locally) to generate the migration files required for `prisma migrate deploy` on the VPS.
- **Prisma Client**: Ensure `npx prisma generate` is part of the build step.

### 2. Authentication
- **Initial User**: The `bootstrapMaster` function will be invoked (or automated) to ensure the first `MASTER_ADMIN` exists in the real database without manual SQL injection.

### 3. Storage
- **Directory Structure**: Ensure the Dockerfile creates the necessary sub-folders in `/data/storage` (`logos`, `previews`, `uploads`, `documents`, `proofs`).

### 4. Scripts
- `scripts/backup-db.sh`: A shell script to perform `pg_dump` from the host or within the container to a mounted backup folder.

## Conclusion Criteria
- [ ] `prisma/migrations` folder exists and contains the current schema.
- [ ] `/api/public/health` returns `database: "ok"` when connected to a real Postgres.
- [ ] Admin login works against real database records.
- [ ] Leads and Site Orders are successfully saved to the database.
- [ ] `DEPLOY-VPS.md` is updated with exact commands for the operator.
