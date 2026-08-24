# Plan: Vitrine Interativa & Controle de Demo (Fase 6)

This plan implements a premium product showcase with an interactive gallery and a controlled demo access system, as specified in `VOIDPRO-58.md` and `VOIDPRO-59.md`.

## User-facing changes
- **Premium Product Cards**: Standardized cards on the solutions page and homepage featuring availability indicators and a "CONHECER" button.
- **Interactive Presentation Modal**: Instead of navigating away, "CONHECER" opens a modal with detailed product benefits, "how it works", and target audience info.
- **Photo Gallery**: A configurable image gallery within the modal to showcase product screenshots.
- **Controlled Demo Flow**: "ACESSAR DEMO" triggers a lead capture modal. After submission, the system generates a secure access token and unlocks the demo link.
- **Automatic Context**: The demo system automatically identifies the product being viewed, ensuring a seamless experience without asking the user to re-select.

## Technical details

### 1. Database Schema (`prisma/schema.prisma`)
- **Product Enhancement**: Add `howItWorks`, `benefits` (Json/String), and `coverImage` fields.
- **New Model: `ProductImage`**: For gallery management (url, alt, sortOrder).
- **New Model: `DemoAccess`**: To track and secure demo access (tokenHash, expiresAt, status).
- **Enum: `DemoAccessStatus`**: `ACTIVE`, `EXPIRED`, `REVOKED`.

### 2. Server Logic & API
- **`src/lib/products.functions.ts`**: Update `getProducts` and `getProductBySlug` to include gallery images and new commercial fields.
- **`src/lib/demo.functions.ts` (New)**:
  - `createDemoAccess`: Validates lead, generates a secure random token (Web Crypto API), hashes it, and saves it in `DemoAccess`.
  - `validateDemoToken`: Verifies token validity and updates `accessCount`/`lastAccessAt`.
- **Environment Variables**: Add `DEMO_ACCESS_EXPIRATION_HOURS` support.

### 3. Frontend Components
- **`src/components/automatiza/catalog/ProductCard.tsx`**: The new standardized card component.
- **`src/components/automatiza/catalog/ProductModal.tsx`**: Premium presentation modal using Radix UI (shadcn).
- **`src/components/automatiza/catalog/Gallery.tsx`**: Responsive image slider/viewer.
- **`src/components/automatiza/catalog/DemoRequestModal.tsx`**: Lead capture form integrated with the `DemoAccess` flow.

### 4. Integration & Routing
- **`src/routes/solucoes/index.tsx`**: Refactor to a state-managed gallery view using the new modals.
- **`src/routes/index.tsx`**: Update the homepage product section to use the new card architecture.
- **Demo Unlocking**: The UI will transition from "Solicitar Acesso" to "Acessar Demo" immediately after successful lead capture and token generation.

## Strategy
1. **Migrations & Seeding**: Update Prisma schema and seed the database with rich product content and images.
2. **Operational Infrastructure**: Implement the `DemoAccess` server functions and token logic.
3. **UI Foundations**: Build the `ProductCard` and `ProductModal` components.
4. **Interactive Features**: Implement the `Gallery` and `DemoRequestModal`.
5. **Final Hookup**: Wire the components into the solutions and home pages, ensuring the multi-step flow (Card -> Modal -> Lead -> Demo) works perfectly.
