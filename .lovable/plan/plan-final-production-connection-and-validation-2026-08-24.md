# Plan: Final Production Connection and Validation

Following the "Regra Final de Validação" from VOIDPRO-69.md, this plan outlines the remaining steps to ensure a successful and secure connection to the real VPS PostgreSQL instance.

## Technical Details

### 1. Database & Migrations
- Ensure `DATABASE_URL` is correctly set in the VPS environment.
- The `docker-entrypoint.sh` will automatically run `npx prisma migrate deploy` on startup.
- **Strict Rule**: No `migrate reset` or `db push` in production.

### 2. Master Admin Bootstrap
- Run the idempotent bootstrap process via `https://automatizasolucao.com.br/api/admin/bootstrap` using the `BOOTSTRAP_SECRET`.
- This creates the initial admin user with `MASTER_ADMIN` role if no admins exist.

### 3. Validation Sequence (Phase 7 Final)
We will perform the following 13 validation steps once the VPS is live:
1. **Health Check**: Verify `/api/public/health` returns `status: "ok"` and `database: "ok"`.
2. **Bootstrap**: Verify successful creation of the Master Admin.
3. **Login**: Verify session persistence in PostgreSQL (auth cookies `HttpOnly`/`Secure`).
4. **Product Catalog**: Verify data retrieval from real DB.
5. **Leads**: Submit a lead and verify persistence in `Lead` table.
6. **Demos**: Request a demo and verify `DemoAccess` creation.
7. **Site Orders**: Create a site order and verify `SiteOrder` and `SiteOrderVersion` records.
8. **Payments**: Generate a payment and verify `Payment` record status.
9. **Finance**: Verify kanban totals are derived from real DB payments.
10. **Notifications**: Verify `NotificationLog` entries are recorded.
11. **Storage**: Upload a logo/proof and verify it persists in the mapped volume.
12. **Backup**: Run `scripts/backup-db.sh` and verify the `.sql` artifact.
13. **Restore**: Test restoration of the backup in a staging environment (optional but recommended).

## User Review Required

> [!IMPORTANT]
> To proceed with the final connection, ensure the VPS is provisioned with PostgreSQL and the `DATABASE_URL` is configured. The application is ready to transition from simulated mode to production mode automatically upon detecting a valid database connection.

---
*Note: The visual text edit requested (changing invisible character to itself) was identified as a no-op and no code changes were made for it.*
