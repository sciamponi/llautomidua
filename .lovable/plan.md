# Plan: Phase 5.2 - Sites Operation 2.0

Evolve the current site production operation into a complete system with an admin order manager, client portal, automated notifications, and version control.

## User Review Required

> [!IMPORTANT]
> - **Authentication**: The plan includes a secure token-based access mechanism for clients. Full user account integration will be prepared but marked as pending (Phase 6).
> - **Automation**: Notifications will be logged and simulated. Real WhatsApp/Email delivery requires external API integration (e.g., Twilio/Resend) in a future step.
> - **Editor**: The first stage of the editor will focus on structured data (texts, images, links) rather than direct visual manipulation of the code.

## Proposed Changes

### 1. Database & Backend (Server-Side)
- **Schema Update**: Enhance `SiteOrder`, `SiteOrderVersion`, and `SiteOrderHistory` models to support more granular statuses and metadata.
- **Server Functions**:
    - Update `src/lib/sites-operation.functions.ts` to include detailed status history and responsible user tracking.
    - Expand `src/lib/notifications.functions.ts` with template support for WhatsApp/Email previews.
    - Implement `src/lib/sites-editor.functions.ts` for managing site content rascunhos and versions.

### 2. Admin Interface (`/admin/sites`)
- **Order Modal**: Create `OrderModal.tsx` in `src/components/admin/sites/` with tabs:
    - **Summary**: Key business info, status, and SLA.
    - **Content**: Data provided by the client.
    - **Preview & Versions**: Version history with "visualize" and "request approval" actions.
    - **History**: Detailed audit log of every status change and internal note.
    - **Communications**: Log of sent notifications and manual preview before sending.
- **Kanban Evolution**: Enhance the board with drag-and-drop feedback and quick status updates.

### 3. Client Portal (`/cliente/sites/$orderId`)
- **Secure Access**: Implement token-based authentication for specific orders.
- **Dashboard**:
    - **Status Timeline**: Visual progress tracker (Submitted -> Analysis -> Production -> Approval -> Published).
    - **Approval Center**: Improved interface to approve or request changes with detailed feedback.
    - **Site Preview**: Integrated preview of the current version.
- **Content Editor (Post-Launch)**:
    - Dedicated interface to edit business name, contact info, services, and logo once the site is `PUBLISHED`.

### 4. Site Architecture (Versioning)
- Implement a "Draft -> Preview -> Published" workflow.
- Ensure every publication creates a new immutable version in the database.

## Technical Details
- **Stack**: TanStack Start (Router + Server Functions), Prisma (Postgres), Tailwind CSS v4, Framer Motion.
- **Z-Index**: Header (1000), Order Modal (2000), Toasts (3000).
- **Security**: Token hashes stored using SHA-256 for secure approval links.
- **Environment**: Environment-aware logic for Health Checks (already implemented).

## Next Steps
1. Create directories for Admin and Client components.
2. Implement the `OrderModal` base structure.
3. Build the Client Dashboard and Approval interface.
4. Integrate the notification preview system.
