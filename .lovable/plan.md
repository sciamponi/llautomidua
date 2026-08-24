# Plan: Vitrine Interativa de Produtos + Demo com Lead

This plan focuses on evolving the product cards into a premium interactive showcase, featuring a standardized card system, an immersive presentation modal with a photo gallery, and a lead capture flow for accessing demonstrations.

## User-facing changes

- **Interactive Showcase**: A new visual layout for product cards on the solutions page and homepage.
- **Product Details Modal**: Clicking "Conhecer" will open a premium modal with detailed information ("For whom it is", "How it works", "Key benefits") instead of immediate navigation.
- **Photo Gallery**: An interactive gallery within the modal to browse product screenshots.
- **Lead Capture for Demo**: Accessing product demonstrations will now require a briefly submitted lead form (name, WhatsApp) to unlock the link.

## Technical details

- **Data Model**:
  - Update `prisma/schema.prisma` to add `ProductImage` model (url, alt, order, productId) and fields to `Product` (audience, howItWorks, benefits).
  - Seed initial product data with these new fields.
- **Components**:
  - `src/components/automatiza/catalog/ProductCard.tsx`: Standardized card with hover effects and availability indicators.
  - `src/components/automatiza/catalog/ProductModal.tsx`: Comprehensive modal using `Dialog` from shadcn/ui.
  - `src/components/automatiza/catalog/Gallery.tsx`: Image slider/carousel with thumbnails.
  - `src/components/automatiza/catalog/DemoLeadForm.tsx`: Specialized lead capture component.
- **Server Logic**:
  - Update `src/lib/products.functions.ts` to fetch images and the new descriptive fields.
  - Update `src/lib/leads.functions.ts` to support 'DEMO' lead types and handle demonstration link unlocking logic.
- **Routing**:
  - Refactor `src/routes/solucoes/index.tsx` to use the new `ProductCard` and manage modal state.
  - Keep `src/routes/solucoes/$productSlug.tsx` as a fallback or deep-link "Sales Page", but prioritize the modal for the initial discovery.

## Strategy

1.  **Phase 1: Database & Seed**: Update Prisma schema and migration to support rich product content (images, benefits).
2.  **Phase 2: Core Components**: Build the `ProductCard` and the base `ProductModal`.
3.  **Phase 3: Interactive Gallery**: Implement the photo gallery within the modal.
4.  **Phase 4: Lead/Demo Flow**: Connect the "Acessar Demo" button to a lead capture form that unlocks the URL upon submission.
5.  **Phase 5: Integration**: Refactor the main solutions page and home page to use this new architecture.
