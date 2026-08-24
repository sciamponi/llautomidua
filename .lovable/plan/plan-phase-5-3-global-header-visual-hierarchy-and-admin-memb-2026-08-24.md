# Plan - Phase 5.3: Global Header, Visual Hierarchy, and Admin/Members Audit

Transforming the UI into a consistent, premium commercial ecosystem by centralizing navigation, standardizing visual hierarchy, and auditing back-office areas.

## 1. Global Navigation & Layout Refactor
- Create `src/config/navigation.ts` to centralize all menu links (SaaS, Services, Partners).
- Refactor `src/components/automatiza/Header.tsx`:
    - Move local `SAAS_PRODUCTS` to the config or fetch from `products.functions.ts`.
    - Fix the stacking context and Z-index issues (ensure Mega Menu > Content).
    - Add a subtle backdrop when the Mega Menu is open.
- Refactor `src/routes/__root.tsx`:
    - Implement a layout strategy that wraps public routes with the global Header/Footer and keeps Admin/Members areas isolated.
    - Remove redundant Header/Footer imports from leaf routes (e.g., `src/routes/index.tsx`, `src/routes/membros/index.tsx`).

## 2. Visual Hierarchy & Spacing Audit
- Standardize spacing in `src/styles.css` using utility classes or CSS variables for common gaps (Section padding, Title gaps).
- Update Hero components to reflect the requested conciseness:
    - Headline: "Automatize. Cresça."
    - Subheadline focus: "Transformando problemas operacionais em soluções digitais."
- Apply `max-width` constraints to text blocks (800px for hero, 650px for body) to improve readability.

## 3. Back-office Audit (Admin & Members)
- **Audit Members Area**: Verify `src/routes/membros/index.tsx` functionality. Ensure it uses a dedicated layout (not the public header).
- **Audit Admin Panel**: Check `src/routes/admin/sites/index.tsx` and broaden the admin scope.
- **Report Status**: Create a report on the current state of authentication, role protection, and functional modules for both areas.

## Technical Details
- **Z-Index Scale**:
    - Header: `1000`
    - MegaMenu: `1100`
    - MobileMenu: `1500`
    - Modal/Toast: `2000`
- **Typographic Scaling**: Use `clamp()` for responsive fluid typography.
- **Dynamic Solutions**: Use `getProducts` server function to populate navigation links dynamically.
