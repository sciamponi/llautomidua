# Plan - Remove Branding Badge

Add CSS rules to the global stylesheet to hide the branding badge and associated links/iframes.

## User Review Required

> [!IMPORTANT]
> This change strictly follows the provided CSS block to hide the "lovable-badge" and related elements.

## Proposed Changes

### Styles

#### [src/styles.css](src/styles.css)

- Append the brand-hiding CSS block to the end of the file.

```css
#lovable-badge,
aside#lovable-badge,
[id*="lovable-badge"],
[class*="lovable-badge"],
a[href*="lovable.app"],
iframe[src*="lovable.app"],
a[href*="lovable.dev"],
iframe[src*="lovable.dev"] {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
  position: absolute !important;
  z-index: -9999 !important;
}
```

## Technical Details

- **Target File**: `src/styles.css` (identified as the active global CSS).
- **Selectors**: Targeted by ID, class, and attribute (`href`/`src`) patterns matching "lovable-badge", "lovable.app", and "lovable.dev".
- **Method**: Using `!important` to ensure the elements are hidden regardless of other styles or scripts.
