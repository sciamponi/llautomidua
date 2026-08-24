# Plan: Fix Header Z-Index and Layout Conflicts

The goal is to fix the header menu appearing behind page content and ensure proper visual hierarchy across all layouts.

## Proposed Changes

### 1. Global Styles and Layout Constants
- Add a CSS utility for `z-index` management to ensure consistency across components.
- Standardize the `pt-20` (header offset) across all public pages to prevent overlapping issues.

### 2. Header Component Fixes
- Update `src/components/automatiza/Header.tsx`:
    - Ensure the header container has `z-[1000]`.
    - Fix the Mega Menu (Solutions dropdown) to have a higher `z-index` than the header background but still below any potential global overlays (like modals).
    - Refine the mobile menu overlay to use `z-[1500]`.

### 3. Root Layout Refinement
- Update `src/routes/__root.tsx`:
    - Ensure the global `Header` is correctly layered within the main application tree.
    - Check and fix any `overflow` settings that might be clipping the header dropdowns.

### 4. Component Hierarchy Review
- Review `Hero.tsx` and `DiagnosisSection.tsx` for any absolute/relative positioning that might be fighting for the same `z-index` space.

## Technical Details
- Use `z-1000` for the fixed header.
- Use `z-[1100]` for the Mega Menu dropdown.
- Use `z-[1500]` for the Mobile Menu overlay.
- Ensure `body` and `main` don't have conflicting `overflow` or `transform` properties that create new stacking contexts.

## Verification
- Open the "Soluções" menu on desktop and verify it displays above the Hero section.
- Open the mobile menu and verify it covers the entire screen.
- Verify that other sections (Diagnosis, Partners) do not overlap the header when scrolling.
