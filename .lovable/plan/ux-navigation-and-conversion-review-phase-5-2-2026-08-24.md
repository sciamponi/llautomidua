# UX, Navigation, and Conversion Review (Phase 5.2)

Comprehensive overhaul of the application's architecture to eliminate "dead ends" and establish consistent layouts across public, customer, member, and admin zones.

## 1. Architectural Layout Overhaul (VOIDPRO-19)

### Public Layout (Header + Footer)
Applied to: Home, Solutions, Sites, Media Indoor, Diagnostic, Partners.
- **Header**: Sticky, neon-navy themed with Mega Menu.
- **Footer**: Full site map, social, and company info.
- **Implementation**: Move to `src/routes/__root.tsx` wrapping general routes.

### Specialized Layouts (Isolated)
- **Customer Approval**: Clean, mobile-first preview for sites (`/sites/aprovacao/$token`).
- **Members Area**: Dashboard layout with sidebar navigation (`/membros/*`).
- **Admin Panel**: Kanban and management view (`/admin/*`).

## 2. Navigation & Conversion Rules (VOIDPRO-18)

### Mega Menu & Mobile Navigation
- **Solutions Hub**: Categorized dropdown for SaaS (Automatiza, BarberIA, etc.) and Services (Sites, Media).
- **Mobile Hamburger**: Full-screen overlay for consistent mobile UX.
- **Brand Consistency**: Logo always returns to `/`.

### "No Dead Ends" Policy
- **Breadcrumbs**: Implement a `Breadcrumbs` component for all internal pages.
- **Back-links**: Every sub-page (product, template, or form) must have a clear "Back to [Category]" link.
- **Contextual CTAs**: Final section of every page must drive to the next step in the funnel (e.g., Diagnostic Quiz or Order Form).

## 3. Implementation Steps

1. **Global Components**:
   - Create `src/components/automatiza/Footer.tsx`.
   - Overhaul `src/components/automatiza/Header.tsx` with Mega Menu and Mobile Menu.
   - Create `src/components/automatiza/Breadcrumbs.tsx`.
2. **Layout Routing**:
   - Refactor `src/routes/__root.tsx` to handle layout switching (Public vs. App zones).
3. **Route Cleanup**:
   - Remove duplicate Header/Footer calls from leaf routes.
   - Inject Breadcrumbs into `src/routes/solucoes/$productSlug.tsx` and `src/routes/sites/$templateSlug.tsx`.
4. **Partner Separation**:
   - Ensure `/parceiros` leads to a unique journey distinct from the consumer SaaS catalog.

## Technical Details

- **Tech Stack**: TanStack Start, Tailwind CSS v4, Framer Motion for animations.
- **State**: Use `products.functions.ts` to populate menus dynamically based on database/mock status.
- **Styling**: Unified Navy (#071A2F) / Electric Blue (#1E8CFF) / Technical Gray palette.
