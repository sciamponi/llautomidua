# Plan: Definitive Header and Mega Menu Correction (VOIDPRO-38)

Fix the header menu visibility (stacking context issue) and standardize the layout height management across the application, moving away from hardcoded top padding.

## Proposed Changes

### 1. Global CSS & Design Tokens
- Update `src/styles.css`:
    - Define CSS variables for header height: `--header-height: 80px` (desktop) and `--header-height-mobile: 72px`.
    - Create semantic z-index tokens:
        ```css
        --z-header: 1000;
        --z-mega-menu: 1100;
        --z-mobile-menu: 1500;
        --z-modal: 2000;
        --z-toast: 3000;
        ```
    - Add a reset/normalization for stacking contexts on `body` and `#root` to ensure fixed elements behave predictably.

### 2. Global Layout Refactoring
- Update `src/routes/__root.tsx`:
    - Wrap the `main` content in a container that automatically applies the header offset using `padding-top: var(--header-height)`.
    - Ensure only one instance of `Header` and `Footer` exists in the public layout.
- Clean up `src/routes/index.tsx`, `src/routes/solucoes/$productSlug.tsx`, and other public routes:
    - Remove hardcoded `pt-20`, `mt-20`, etc., from `<main>` or root divs.

### 3. Header & Mega Menu Stacking Fixes
- Update `src/components/automatiza/Header.tsx`:
    - Apply `z-[var(--z-header)]` to the `<header>` tag.
    - Apply `z-[var(--z-mega-menu)]` to the solutions dropdown container.
    - Refactor the backdrop to use `fixed` positioning with `z-[-1]` relative to the dropdown, or a global backdrop if necessary.
    - Ensure the mobile menu uses `fixed` with `z-[var(--z-mobile-menu)]` and occupies `100vh`.
    - Audit and remove any `overflow-hidden` or `transform` properties on parent elements that might be clipping the dropdown.

### 4. Component Audit (Hero & Sections)
- Update `src/components/automatiza/Hero.tsx` and `src/components/automatiza/DiagnosisSection.tsx`:
    - Ensure no element within these sections has a `z-index` higher than `1000`.
    - Check for `isolation: isolate` if specific sections need their own stacking context without affecting the global header.

## Technical Details
- **Stacking Context**: We will avoid using `transform` or `filter` on the `Header` or its immediate parents unless necessary, as these create new stacking contexts that can trap `z-index`.
- **Backdrop**: Implement a proper backdrop for the Mega Menu that prevents interaction with the background while open.

## Verification
- **Visual Audit**: Open the "Soluções" menu on Home and Product pages; verify it is 100% visible and above all Hero content.
- **Mobile Audit**: Verify the mobile menu covers the entire screen (tested at 375px, 768px).
- **Functional Audit**: Verify "Click outside", "Escape key", and "Route change" all close the menu.
