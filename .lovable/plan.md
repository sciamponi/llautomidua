# UX, Navigation, and Conversion Review (Phase 5.2)

Complete overhaul of the navigation system and user experience to eliminate "dead ends" and ensure a consistent, professional journey across the entire application.

## 1. Global Navigation Infrastructure

### Global Header (`src/components/automatiza/Header.tsx`)
- **New Structure**:
    - **Logo**: Always leads to `/`.
    - **Mega Menu (Soluções)**:
        - **SaaS**: Automatiza, BarberIA, Esmaltter-IA, PetFlow, Solução Oficinas.
        - **Serviços**: Sites Profissionais, Media Indoor.
    - **Direct Links**: Sites, Media Indoor, Parceiros.
    - **Primary CTA**: "ENCONTRAR MINHA SOLUÇÃO".
- **Mobile Experience**: Implement a full-screen hamburger menu for consistent navigation on smaller devices.
- **Visual Style**: Sticky navy background (#071A2F) with glassmorphism, white/ice text, and high-contrast blue CTAs.

### Global Footer (`src/components/automatiza/Footer.tsx`)
- **Sections**:
    - **Sobre**: Brief bio and logo.
    - **Soluções**: Links to all SaaS products and services.
    - **Empresa**: About, Partners, Contact.
    - **Legal**: Privacy policy and terms (placeholders).
- **Branding**: Dark navy background with technical gray accents.

### Root Layout Integration (`src/routes/__root.tsx`)
- Move `Header` and `Footer` to the root route to ensure they wrap every page automatically.
- Implement a logic to conditionally exclude them from specific routes if necessary (e.g., admin area, though the plan emphasizes consistency).

## 2. Journey Separation & Flow Improvements

### Client vs. Partner Journeys
- **Client Path**: Focused on identifying problems and finding the right SaaS/Service solution.
- **Partner Path**: A dedicated landing page (`/parceiros`) and membership area (`/membros`) with its own context.
- **Isolation**: Ensure the navigation menu doesn't mix "Partner" tools within the buyer's product funnel.

### "No Dead Ends" Policy
- **Breadcrumbs/Back Links**: Add consistent "Back to Catalog" or "Back to Home" links to all internal pages:
    - `src/routes/solucoes/$productSlug.tsx`
    - `src/routes/sites/$templateSlug.tsx`
    - `src/routes/media-indoor/index.tsx`
    - `src/routes/diagnostico/index.tsx`
- **CTA Context**: Ensure every page ends with a clear call to action (Diagnostic Quiz, Specialist Contact, or Purchase).

## 3. Implementation Plan

1. **Create Footer**: Implement `src/components/automatiza/Footer.tsx`.
2. **Update Header**: Redesign `src/components/automatiza/Header.tsx` with Mega Menu and mobile menu.
3. **Refactor Root**: Wrap `<Outlet />` in `src/routes/__root.tsx` with the new Header and Footer.
4. **Cleanup Routes**: Remove manual Header/Footer imports from all existing route files.
5. **Enhanced Sub-pages**: Add breadcrumbs and consistent back-navigation to all product and service detail pages.
6. **Conversion Optimization**: Update `FinalCTA` and all page footers to drive users towards the "Cérebro Comercial" (Diagnostic Quiz).

## Technical Details

- **Components**: `Header`, `Footer`, `MegaMenu`, `Breadcrumbs`.
- **Framework**: TanStack Start + Tailwind CSS + Framer Motion.
- **Data Source**: Uses `src/lib/products.functions.ts` to dynamically populate the solutions menu.
