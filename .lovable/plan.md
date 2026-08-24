# Plan - Fase 6: Master Admin, Real Auth & Permissions

Implement real server-side authentication and a centralized permission system for the Automatiza ecosystem, replacing all mock logic and isolating Admin, Client, and Partner zones.

## User Review Required

> [!IMPORTANT]
> - This implementation requires a database (Lovable Cloud).
> - We will use a secure session persisted in PostgreSQL and handled via HttpOnly cookies.
> - The initial `MASTER_ADMIN` will be created via a dedicated secure server function (bootstrap) to avoid hardcoded credentials.

## Proposed Changes

### 1. Database & Security
- **Prisma Schema Updates**:
  - Enhance `User` model with `UserRole` (MASTER_ADMIN, ADMIN, OPERATOR, CUSTOMER, PARTNER).
  - Add `Session` model for database-backed session tracking (id, userId, tokenHash, expiresAt, ipAddress, userAgent).
  - Add `AuditLog` for tracking critical administrative actions (LOGIN, LOGOUT, CREATE_USER, CHANGE_ROLE, etc.).
- **Security Middleware**:
  - Implement `requireAuth(roles?: UserRole[])` and `requirePermission(permission: string)` to protect server functions.
  - Implement route-level guards in `src/router.tsx` to handle redirects (e.g., non-admin trying to access `/admin`).

### 2. Authentication System
- **Login Flow (`/login`)**:
  - Create a premium login interface following the brand identity.
  - Implement `auth.functions.ts` for `login`, `logout`, and `getSession`.
  - Use `crypto.subtle` or `node:crypto` for secure password hashing (PBKDF2 or similar compatible with the runtime).
  - Set secure HttpOnly cookies for session management.
- **Hierarchical Access**:
  - Redirect users to their specific zones based on roles after login.
  - Strict isolation: Customers and Partners can never access Admin areas.

### 3. Centralized Admin Panel (`/admin`)
- **New Layout**:
  - Isolated Sidebar navigation for Master/Admin/Operator users.
  - Real-time Dashboard with indicators from Prisma (Leads, Sites, Payments, Partners).
- **User Management (`/admin/usuarios`)**:
  - Interface for MASTER_ADMIN to manage users, roles, and status.
  - Only MASTER_ADMIN can manage other MASTER_ADMINs.

### 4. System Refinement
- **Root Layout (`src/routes/__root.tsx`)**: Refactor to dynamically wrap components based on authentication state and route zone.
- **Zone Isolation**: Remove public headers/footers from `/admin`, `/cliente`, and `/membros` completely.
- **Audit Logging**: Persist all sensitive operations in `AuditLog`.

## Technical Details

- **Technology**: TanStack Start `createServerFn` for all server-side logic.
- **Hashing**: Secure implementation using standard Web Crypto or Node.js `crypto`.
- **Session**: Database-backed sessions with rotation and expiration.
- **Roles**: Strong typing via Zod and Prisma Enums.

## Steps to Execute
1. Update `prisma/schema.prisma` with `Session`, `AuditLog`, and expanded `UserRole`.
2. Implement `src/lib/auth.functions.ts` and core security middleware.
3. Create the `/login` route and the centralized `/admin` layout.
4. Refactor existing zones (Admin Kanban, Client Portal) to use the new session context.
5. Implement the `MASTER_ADMIN` bootstrap mechanism.

