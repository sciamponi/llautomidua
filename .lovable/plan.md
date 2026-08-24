# Plan - Fase 6: Master Admin, Real Auth & Permissions

Implement real server-side authentication and a centralized permission system for the Automatiza ecosystem, replacing all mock logic and isolating Admin, Client, and Partner zones.

## User Review Required

> [!IMPORTANT]
> - This implementation requires a database (Lovable Cloud).
> - We will use a secure cookie-based session handled via `createServerFn` and TanStack Router's context.
> - The initial `MASTER_ADMIN` will be created via a dedicated server function (safe bootstrap).

## Proposed Changes

### 1. Database & Security
- **Prisma Schema Updates**:
  - Enhance `User` model with `UserRole` (MASTER_ADMIN, ADMIN, OPERATOR, CUSTOMER, PARTNER).
  - Add `Session` model for database-backed sessions (optional, can also use signed JWT in cookies).
  - Add `AuditLog` for tracking critical administrative actions.
- **Security Middleware**:
  - Implement `requireAuth(roles?: UserRole[])` middleware to protect server functions.
  - Implement route-level guards in `src/router.tsx` and route files.

### 2. Authentication System
- **Login Flow**:
  - Create `/login` route with the official brand identity.
  - Implement `login.functions.ts` using `bcrypt` (or similar via nodejs_compat) for password hashing.
  - Set `HttpOnly`, `Secure`, `SameSite=Strict` cookies for sessions.
- **Session Management**:
  - Global `useAuth()` hook to access current user and permissions.
  - Automatic redirection based on role after login.

### 3. Centralized Admin Panel (`/admin`)
- **New Layout**:
  - Isolated Sidebar navigation for Master/Admin users.
  - Dashboard with real indicators (Leads, Sites, Payments, Partners).
- **User Management (`/admin/usuarios`)**:
  - Full CRUD for users with role-based restriction (e.g., only MASTER_ADMIN can manage other MASTER_ADMINs).

### 4. Zone Isolation
- **Client Portal (`/cliente`)**: Fully isolated from public and admin headers.
- **Partner Area (`/membros`)**: Re-verify ownership and partner-specific data.
- **Root Layout (`src/routes/__root.tsx`)**: Refine `isIsolatedPath` logic to handle auth-state-based visibility.

## Technical Details

- **Technology**: TanStack Start `createServerFn` for all auth logic.
- **Password Hashing**: Using `crypto` (standard Web API) for secure hashing.
- **Session**: Signed cookies containing the user ID and session token.
- **Prisma**: Migrations will be generated and applied.

## Steps to Execute
1. Update `prisma/schema.prisma` with expanded roles and relations.
2. Implement `src/lib/auth.functions.ts` (login, logout, getSession).
3. Create `/login` and `/admin` base layouts.
4. Refactor Kanban and Client Portal to use the new authenticated context.
5. Create the "Bootstrap Master" tool/function.
