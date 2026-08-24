# Plan: Phase 5.2 - Sites Operation 2.0 (Producão + Cliente + Aprovacão + Versões)

Evolve the site production ecosystem into a professional workflow connecting Admin (Operations) and Client (Approval & Maintenance).

## User Review Required

> [!IMPORTANT]
> - **Simulation vs Real Notifications**: All WhatsApp and Email notifications will be implemented with a "Simulated" status by default. They will only be marked as "Sent" once a real provider (Twilio/Resend) is connected. A `NotificationPreview` will allow manual verification before "sending".
> - **Token-Based Access**: The client portal will use secure, expiring tokens linked to each order for access, serving as a bridge to a full Auth system (Phase 6).
> - **Structured Editor**: The initial editor for clients will focus on structured data (Name, Contact, Services, Logo, Photos) with a real-time preview, rather than arbitrary code editing.

## Proposed Changes

### 1. Database & Server Logic (TanStack Start & Prisma)
- **Schema Enhancements**: 
    - Update `SiteOrder` to include `responsibleUserId` and `slaDeadline`.
    - Enhance `SiteOrderVersion` to be immutable, storing full content snapshots (Json `contentSnapshot`).
    - Expand `SiteOrderHistory` to log every status change with actor details and `responsibleUserId`.
    - Implement `ApprovalRequest` with hashed tokens (SHA-256) and expiration.
- **Server Functions (`src/lib/`)**:
    - `sites-operation.functions.ts`: Detailed status management, version creation, and approval processing.
    - `notifications.functions.ts`: Logic for simulating/sending notifications with template support and manual preview logging.
    - `sites-editor.functions.ts`: Handle "Draft -> Preview -> Published" workflow for site content.

### 2. Admin Operations (`/admin/sites`)
- **Order Modal (`OrderModal.tsx`)**:
    - Central management hub for each order with tabs:
        - **Resumo**: Quick status, SLA, and business basics.
        - **Dados/Conteúdo**: View/Edit client-provided information.
        - **Arquivos**: Asset management (Logos, Photos).
        - **Preview & Versões**: Version history, generate preview links, and trigger approval requests.
        - **Histórico**: Full audit trail of the order.
        - **Comunicações**: Manual notification preview before simulated delivery.
- **Kanban Board**: Maintain existing board but integrate the new modal and status update flow.

### 3. Client Portal (`/cliente/sites/$orderId`)
- **Secure Dashboard**:
    - Visual **Status Timeline** (Submitted -> Review -> Production -> Approval -> Published).
    - **Integrated Preview**: Live view of the current site version.
    - **Approval Action**: Modal for "Approve" or "Request Changes" (with mandatory feedback).
- **Client Editor (`/cliente/sites/$orderId/editor`)**:
    - Dual-pane interface: Structured fields on the left, real-time preview on the right.
    - Workflow: Save Draft -> Visualize -> Publish (creates new version).
    - Restricted fields: Content-only, no code editing.

### 4. Cross-Sell & Upsell
- **RelatedSolutions Component**: Contextual recommendations for other ecosystem products (e.g., Automatiza, Media Indoor) based on the current site status and niche.

## Technical Strategy
- **Z-Index Hierarchy**: Header (1000), Mega Menu (1100), Modal (2000), Toast (3000).
- **Stack**: React 19, TanStack Router/Start, Tailwind CSS v4, Framer Motion for smooth modal/timeline transitions.
- **Modularity**: Prepare the editor architecture for future inline editing without rebuilding the core logic.

## Next Steps
1. Create `src/components/admin/sites/OrderModal.tsx` and sub-components.
2. Build the `/cliente/sites/$orderId` route and dashboard.
3. Implement the `NotificationPreview` logic in the admin flow.
4. Develop the structured content editor for clients.
