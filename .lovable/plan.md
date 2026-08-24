# VPS Preparation Plan - Automatiza Solução

This plan prepares the project for future hosting on a private VPS (Virtual Private Server) using Docker and PostgreSQL, ensuring independence from the Lovable environment while maintaining full compatibility with the current stack (TanStack Start + React 19).

## Technical Objectives
- **Independent Infrastructure**: Create Docker configuration for the application and database.
- **Data Persistence**: Configure PostgreSQL with Prisma for production environments.
- **Environment Management**: Define necessary environment variables for external hosting.
- **Health Monitoring**: Add a `/health` endpoint for monitoring and uptime checks.
- **Documentation**: Provide a comprehensive guide for manual deployment on a VPS.

## Proposed Changes

### 1. Infrastructure (Docker)
- Create `Dockerfile` using a multi-stage build (Node 22 + Alpine) for a lightweight production image.
- Create `docker-compose.yml` defining two services:
  - `app`: The TanStack Start application.
  - `db`: PostgreSQL 16 with a persistent volume (`/var/lib/postgresql/data`).
- Ensure the database is not exposed to the public internet by using internal Docker networking.

### 2. Database & Prisma
- Review `prisma/schema.prisma` to ensure compatibility with standard PostgreSQL.
- Verify `DATABASE_URL` usage throughout the application.
- Create an `.env.example` file listing all required environment variables (without real values):
  - `DATABASE_URL`
  - `APP_URL`
  - `NODE_ENV`
  - `BETTER_AUTH_SECRET` (if applicable)
  - Integration keys (WhatsApp, Email, etc.)

### 3. Monitoring (Health Check)
- Create a new public API route `src/routes/api/public/health.ts`:
  - Returns `200 OK` if the application is running.
  - Attempts a simple database query (e.g., `prisma.$queryRaw` or counting a table) to verify DB connectivity.
  - Returns JSON with basic status information.

### 4. Documentation
- Create `DEPLOY-VPS.md` with step-by-step instructions:
  - Minimum server requirements (CPU/RAM).
  - Installing Docker & Docker Compose.
  - Configuring `.env`.
  - Running migrations and starting the services.
  - Setting up a Reverse Proxy (Nginx/Caddy) with SSL (Certbot).

### 5. Deployment Preparation Script
- Add a `deploy:prepare` script in `package.json` to handle Prisma generation and build optimization if needed.

## User Review Required

> [!IMPORTANT]
> This preparation does **not** perform an actual migration. The app will continue to work perfectly on Lovable Cloud.

1. **Storage Strategy**: Currently, the project uses local assets or external links. For a VPS, do you prefer using a Local Volume (easier but harder to scale) or an S3-compatible service (AWS/Cloudflare R2)?
2. **Auth & Secrets**: The project uses TanStack Start. We will ensure all secrets are read from `process.env` in server functions. Are there any specific external service tokens you'd like to document now?
