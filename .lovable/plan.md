# Plan: Health Check Refinement (VOIDPRO-33)

Objective: Align the `/api/public/health` endpoint with the specific logic and terminology defined in `VOIDPRO-33.md` for better monitoring on VPS.

## Changes

### 1. Update Health Check Endpoint
- Modify `src/routes/api/public/health.ts`:
  - Change `unconfigured` to `not_configured` when `DATABASE_URL` is missing (Preview/Dev).
  - Change `error` to `unavailable` when the database connection fails (VPS/Production).
  - Ensure the JSON keys match the requirements precisely while maintaining `status: ok` for monitoring tools.

### 2. Update Documentation
- Update `DEPLOY-VPS.md` and `docs/VPS-READINESS.md` to reflect the updated health check response format.

## Verification
- Run `npm run build` to ensure no build errors.
- (Manual) Verify the endpoint returns the correct JSON structure in the preview environment (should show `not_configured`).
