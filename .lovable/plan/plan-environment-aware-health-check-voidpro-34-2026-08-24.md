# Plan: Environment-Aware Health Check (VOIDPRO-34)

Objective: Implement environment-specific health check behavior to ensure that missing databases are tolerated in preview/dev but treated as critical errors in production.

## Changes

### 1. Refactor Health Check Logic
- Update `src/routes/api/public/health.ts` to implement the logic from `VOIDPRO-34.md`:
  - **Dev/Preview (`NODE_ENV !== 'production'`)**:
    - If `DATABASE_URL` is missing: HTTP 200, `database: "not_configured"`, `environment: "preview"`.
  - **Production (`NODE_ENV === 'production'`)**:
    - If `DATABASE_URL` is missing: HTTP 503, `status: "error"`, `database: "not_configured"`.
  - **Database Connection Check (if URL exists)**:
    - Success: HTTP 200, `status: "ok"`, `database: "ok"`.
    - Failure: HTTP 503, `status: "error"`, `database: "unavailable"`.
  - **Security**: Ensure no sensitive data or stack traces are leaked.

### 2. Update Documentation
- Update `DEPLOY-VPS.md` and `docs/VPS-READINESS.md` to describe this new environment-aware behavior.

## Verification
- Run `npm run build`.
- Verify in preview environment (should return `environment: "preview"`).
