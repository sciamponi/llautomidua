# Plan: Phase 5.2 - Sites Operation 2.0 (Producão + Portal Cliente + Aprovacão + Versões)

Evolve the site production ecosystem into a professional workflow connecting Admin (Operations) and Client (Portal & Maintenance).

## User Review Required

> [!IMPORTANT]
> - **Dedicated Client Portal**: A new layout will be implemented for `/cliente/*` routes, separate from the public site header. It will include a specific navigation: Meu Site, Soluções (Cross-sell), Suporte, and Logout.
> - **Immutable Versions**: Published versions will be immutable snapshots. A `contentSnapshot` (JSON) will be added to `SiteOrderVersion` to store the state of the site at the time of publication.
> - **Notification Strategy**: All communications (WhatsApp/Email) will follow the "Simulated" (Mock) vs "Sent" (Real) logic, with mandatory `NotificationPreview` in the Admin panel.
> - **Transition to Auth**: Token-based access for `/cliente/*` serves as a bridge to Phase 6 (full Authentication).

## Proposed Changes

### 1. Database & Server Logic (TanStack Start & Prisma)
- **Schema Enhancements**:
    - `SiteOrder`: Add `responsibleUserId` (UUID/String) and `slaDeadline` (DateTime).
    - `SiteOrderVersion`: Add `versionNumber` (Int), `contentSnapshot` (Json), and `publishedAt` (DateTime).
    - `SiteOrderHistory`: Ensure every update logs `actor` (responsibleUserId), `action`, and status transition.
    - `ApprovalRequest`: Standardize on SHA-256 hashed tokens with expiration.
- **Server Functions (`src/lib/`)**:
    - `sites-operation.functions.ts`: Detailed lifecycle management (Status transitions, history creation, versioning).
    - `notifications.functions.ts`: Logic for simulating notifications, template rendering, and preview generation.
    - `sites-portal.functions.ts`: (New) Fetching data for the client portal via secure tokens.

### 2. Layout & Navigation Architecture
- **Root Layout (`src/routes/__root.tsx`)**:
    - Add `/cliente` to `isIsolatedPath`.
    - Plan for a `ClientLayout` component that wraps all client-facing dashboard routes.
- **Client Portal Header (`ClientHeader.tsx`)**:
    - Dedicated nav for logged-in (token-verified) clients.

### 3. Admin Operations (`/admin/sites`)
- **Enhanced Order Modal**: Implement the multi-tab modal (Resumo, Dados, Conteúdo, Arquivos, Preview, Versões, Histórico, Comunicações).
- **Communication Flow**: Manual review and trigger of "Simulated" notifications.

### 4. Client Portal & Maintenance (`/cliente/sites/$orderId`)
- **Dashboard**: Status timeline, current version preview, and direct approval/feedback actions.
- **Structured Editor**: Client-facing tool to update basic business data (Phone, WhatsApp, Services, Logo) which triggers new version drafts.

### 5. Cross-Sell / Soluções
- **RelatedSolutions**: An upsell section within the client portal suggesting other Automatiza products (BarberIA, Media Indoor, etc.) based on the client's niche.

## Technical Strategy
- **Z-Index Tokens**: Header (1000), Mega Menu (1100), Portal Nav (1200), Modal (2000), Toast (3000).
- **Persistence**: Use `Json` field in Prisma for flexible content snapshots until the structured editor fields are finalized.
- **Security**: Token validation in server route loaders for `/cliente` until full Auth is implemented.

## Next Steps
1. Update `prisma/schema.prisma` with the new fields and run migration.
2. Create `src/components/cliente/ClientHeader.tsx` and the `/cliente` route structure.
3. Build the `OrderModal.tsx` for Admin with the 8 tabs.
4. Implement the status update logic with history and notification simulation hooks.
