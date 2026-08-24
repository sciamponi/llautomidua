# Plan: Final Health Check Simplification (VOIDPRO-35)

Objective: Strictly implement the mandatory minimal JSON structure for the health check endpoint as requested in the final approval (VOIDPRO-35).

## Changes

### 1. Minimal Health Check Endpoint
- Update `src/routes/api/public/health.ts`:
  - Remove `environment` and `timestamp` fields from all response branches.
  - Ensure the response only contains `status` and `database`.
  - Maintain the environment-aware logic (200 in preview without DB, 503 in production without DB).

### 2. Update Documentation
- Update `DEPLOY-VPS.md` and `docs/VPS-READINESS.md` to show the simplified JSON responses.

## Verification
- Run `npm run build`.
- Verify the endpoint returns exactly `{"status":"ok","database":"not_configured"}` in the preview environment.
