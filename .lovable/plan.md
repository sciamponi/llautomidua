# Plan: Vitrine Interativa & DemoAccess Control (Fase 6 Final)

This plan integrates a premium interactive product showcase with a secure, controlled demonstration access system, fully managed through the Master Admin panel.

## User-facing changes
- **Interactive Showcase**: Premium product cards on `/solucoes` with "CONHECER" opening an immersive modal instead of navigating.
- **Dynamic Content**: Product details (audience, how it works, benefits) and photo galleries are fully database-driven.
- **Secure Demo Flow**: "ACESSAR DEMO" triggers a lead capture (Name, WhatsApp). Upon submission, a secure, temporary access link is generated.
- **Master Admin Integration**: Admins can manage all product commercial data, galleries, and monitor all demo access requests and usage stats.

## Technical details

### 1. Database Schema (`prisma/schema.prisma`)
- **Product Enhancement**: Add `audience`, `howItWorks`, `benefits` (Json), `coverImage`, `demoDurationHours`, and `demoActive`.
- **New Model: `ProductImage`**: `url`, `alt`, `sortOrder`, `productId`.
- **New Model: `DemoAccess`**: `tokenHash`, `leadId`, `productId`, `expiresAt`, `accessCount`, `status` (`ACTIVE`, `EXPIRED`, `REVOKED`).
- **Lead Enhancement**: Add `source` field and relationships to `DemoAccess` and `Product`.

### 2. Server Functions & Security
- **`src/lib/products.functions.ts`**: Update to support rich content and administrative CRUD.
- **`src/lib/demo.functions.ts` (New)**: 
  - `requestDemoAccess`: Captures lead, generates a cryptographically secure random token (Web Crypto API), hashes it (SHA-256), and stores the record.
  - `validateDemoAccess`: Middleware/helper to verify tokens without requiring user login.
  - `getDemoStats`: Aggregator for the Master Admin dashboard.

### 3. Frontend Architecture
- **Public Showcase**: 
  - `src/components/automatiza/catalog/ProductCard.tsx`
  - `src/components/automatiza/catalog/ProductModal.tsx`
  - `src/components/automatiza/catalog/DemoLeadModal.tsx`
- **Master Admin**:
  - `src/routes/admin/produtos/index.tsx`: Full catalog management.
  - `src/routes/admin/demos/index.tsx`: Access monitoring dashboard with stats (Total, Released, Accessed).
- **Public Routes**:
  - `src/routes/demo/$token.tsx`: Secure entry point that validates access before rendering the product demo.

## Strategy
1. **Infrastructure**: Apply Prisma migrations and seed products with initial commercial copy and images.
2. **Back-office**: Implement the `/admin/produtos` and `/admin/demos` management views.
3. **Auth/Security**: Develop the token generation and validation logic in server functions.
4. **Public UI**: Refactor the solutions page to use the new interactive modal and lead capture flow.
5. **Validation**: Ensure the demo context is automatically preserved (BarberIA leads to BarberIA demo) and tokens expire correctly.
