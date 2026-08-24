# Plan: Phase 5.2 - Sites Operation 2.0 (Producão + Portal Cliente + Aprovacão + Versões)

Evolve the site production ecosystem into a professional workflow connecting Admin (Operations) and Client (Portal & Maintenance).

## User Review Required

> [!IMPORTANT]
> - **Isolated Client Portal (`/cliente/*`)**: A new dedicated layout and header will be implemented for all client-facing dashboard routes, completely separate from the public site navigation.
> - **Secure Token Transition**: Initial access will use SHA-256 hashed tokens linked to specific orders and versions. This serves as a secure bridge to full authentication in Phase 6.
> - **Immutable Publishing**: Every publication action will create a new immutable `SiteOrderVersion` with a `contentSnapshot` (Json), ensuring a full audit trail and easy rollbacks.
> - **Template-Oriented Editor**: The client-facing editor will be structured and driven by the template's schema (Name, Contacts, Services, Assets), preventing arbitrary code or layout changes.
> - **Notification Simulation**: All automated communications (WhatsApp/Email) will require a manual `NotificationPreview` in the Admin panel and will follow the "Simulated" vs "Sent" logic.

## Proposed Changes

### 1. Database & Server Logic (TanStack Start & Prisma)
- **Schema Enhancements**:
    - `SiteOrder`: Add `responsibleUserId` and `slaDeadline`.
    - `SiteOrderVersion`: Add `versionNumber`, `contentSnapshot` (Json), and `publishedAt`.
    - `SiteOrderHistory`: Enforce logging of `actor`, `action`, and status transitions.
    - `ApprovalRequest`: Standardize on SHA-256 tokens with expiration and link to order + version.
- **Server Functions (`src/lib/`)**:
    - `sites-operation.functions.ts`: Manage status transitions, immutable versioning, and history logging.
    - `notifications.functions.ts`: Logic for simulating/sending notifications with template support and manual preview verification.
    - `sites-portal.functions.ts`: Secure fetching of site data for the client portal using validated tokens.

### 2. Layout & Navigation Architecture
- **Root Layout (`src/routes/__root.tsx`)**:
    - Isolate `/cliente` routes from the global public header/footer.
- **Client Components (`src/components/cliente/`)**:
    - `ClientLayout`: Wrapper for portal routes.
    - `ClientHeader`: Specific navigation (Meu Site, Soluções, Suporte, Sair).

### 3. Admin Operations (`/admin/sites`)
- **Order Modal (`OrderModal.tsx`)**:
    - Multi-tab management: Resumo, Dados, Conteúdo, Arquivos, Preview, Versões, Histórico, Comunicações.
    - Status update flow with mandatory historical logging.
    - Notification simulation/preview before "sending".

### 4. Client Portal & Maintenance (`/cliente/sites/$orderId`)
- **Secure Dashboard**: Status timeline (Submitted -> Review -> Production -> Approval -> Published) and current version preview.
- **Approval Flow**: One-click approval or "Changes Requested" with mandatory feedback.
- **Structured Editor**: Client-facing tool to update content (Phone, WhatsApp, Services, Logo) based on template schema.

### 5. Cross-Sell / Soluções
- **RelatedSolutions**: Recommend Automatiza products (BarberIA, Media Indoor, etc.) based on the client's niche and current solutions.

## Technical Strategy
- **Z-Index Tokens**: Header (1000), Mega Menu (1100), Client Header (1200), Modal (2000), Toast (3000).
- **Security**: Server-side token validation for all `/cliente` routes.
- **Modularity**: Editor fields are defined by the `SiteTemplate` to support different content structures.

## Next Steps
1. Update `prisma/schema.prisma` with the new fields and run migration.
2. Create `src/components/cliente/ClientHeader.tsx` and the `/cliente` layout structure.
3. Build the `OrderModal.tsx` for Admin with the 8 specific tabs.
4. Implement the immutable versioning and status history logic in server functions.
