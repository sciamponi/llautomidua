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
  - Update `UserRole` enum: `MASTER_ADMIN`, `ADMIN`, `OPERATOR`, `CUSTOMER`, `PARTNER`.
  - Add `Session` model: `id`, `userId`, `tokenHash` (unique), `expiresAt`, `createdAt`, `lastUsedAt`, `ipAddress`, `userAgent`.
  - Add `AuditLog` model: `id`, `actorId`, `action` (Enum: LOGIN, LOGOUT, CREATE_USER, etc.), `targetId`, `metadata` (Json), `ipAddress`, `createdAt`.
- **Security Middleware**:
  - Implement `requireAuth(roles?: UserRole[])` and `requirePermission(permission: string)` using `tanstack-start` middleware.
  - Implement route-level guards in `src/router.tsx` to handle redirects.

### 2. Authentication System
- **Backend Logic (`src/lib/auth.functions.ts`)**:
  - `login`: Validates credentials, creates a session in DB, and sets an `auth_token` HttpOnly cookie.
  - `logout`: Deletes the session from DB and clears the cookie.
  - `getSession`: Server function to retrieve the current user and roles from the token.
  - **Password Hashing**: Implement secure hashing using `crypto` (Web Crypto API) for edge compatibility.
- **Login Flow (`/login`)**:
  - Create a premium login interface following the brand identity.
  - Automatic redirection: `MASTER_ADMIN/ADMIN/OPERATOR` -> `/admin`, `CUSTOMER` -> `/cliente`, `PARTNER` -> `/membros`.

### 3. Centralized Admin Panel (`/admin`)
- **New Layout**:
  - Dedicated layout for `/admin` routes with a sidebar.
  - Remove public Header/Footer from this zone.
- **User Management (`/admin/usuarios`)**:
  - CRUD for users, roles, and status.
  - Strict rule: Only `MASTER_ADMIN` can manage other `MASTER_ADMIN`s.

### 4. Zone Isolation & Refinement
- **Root Layout (`src/routes/__root.tsx`)**: Update `isIsolatedPath` logic and integrate `useAuth` to handle conditional rendering and zone protection.
- **Client Portal & Members Area**: Refactor to use the real session instead of any remaining mock/local storage state.

## Technical Details

- **Technology**: TanStack Start `createServerFn` and `middleware`.
- **Hashing**: PBKDF2 or similar secure algorithm implemented via `crypto`.
- **Session**: UUID-based tokens hashed in the database.
- **Cookie Policy**: `HttpOnly`, `Secure` (in prod), `SameSite=Lax`, `Path=/`.

## Steps to Execute
1. Update `prisma/schema.prisma` with new models and enum values.
2. Implement `src/lib/auth.functions.ts` core logic and password utility.
3. Create the `/login` route and the `/admin` layout wrapper.
4. Implement the `MASTER_ADMIN` bootstrap tool.
5. Refactor existing modules (Kanban, Client Portal) to enforce real auth.


