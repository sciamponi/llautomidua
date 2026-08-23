# Plan - Institutional Landing Page for Automatiza Solução

Build a premium, high-converting institutional and commercial landing page for **Automatiza Solução** following the provided Brand Board and VOIDPRO instructions. The design will focus on transforming "WhatsApp Mess" into "Intelligent Operation," using a dark, professional aesthetic with the signature robot mascot.

## User Review Required

> [!IMPORTANT]
> The robot mascot is a central element. I will use the provided `logo.png` and `imagem-1_13.jpg` as the primary robot visuals. For the "Success/Warning/Danger" states of the robot, I will use AI-generated variations or stylized versions of these images if possible, or consistent thematic icons if new images aren't available.

- **Robot States**: The prompt mentions a reusable `RobotMessage` component with three states (Green/Success, Yellow/Warning, Red/Danger). I will implement these using the provided robot image as a base with colored neon glow effects.
- **Copywriting**: All text will be in Brazilian Portuguese as requested, following the direct and diagnostic tone of voice.

## Proposed Changes

### 1. Global Styles and Design System
- Update `src/styles.css` with the official color palette:
  - Background/Navy: `#071A2F`
  - Electric Blue: `#1E8CFF`
  - Ice White: `#F7F8FA`
  - Operational Yellow: `#F0A820`
  - Cyan: `#4CDFF2`
  - Technical Gray: `#DCE3EA`
- Configure Google Fonts in `src/routes/__root.tsx`: **Sora** (Headlines) and **Inter** (Body). Note: The PDF mentions **Bebas Neue** for some headlines, I will include it as well for maximum brand fidelity.
- Setup custom Tailwind theme for these colors and fonts.

### 2. Assets Management
- Process `user-uploads://logo.png` and `user-uploads://imagem-1_13.jpg` into `src/assets/` using the `lovable-assets` tool.
- Create the official favicon from the brand mark.

### 3. Components
- **`RobotMessage`**: Reusable component for the robot mascot with state-specific glowing effects (Success/Warning/Danger).
- **`DiagnosisSection`**: Visual comparison between "WhatsApp Chaos" and "Organized Operation".
- **`FeatureCards`**: The 6 core service cards defined in the instructions.
- **`Hero`**: Premium section featuring the robot mascot and key value proposition.
- **`StickyHeader`**: Navigation with "Quero ser Parceiro" CTA.

### 4. Routes
- **`src/routes/index.tsx`**: Replace the placeholder with the full landing page structure:
  1. Header
  2. Hero
  3. Diagnosis (Chaos vs. Order)
  4. About Automatiza (Storytelling)
  5. Services/What we do
  6. Value Proposition ("Not just another tool")
  7. Testimonials/Social Proof (if applicable)
  8. CTA/Partner Program
  9. Footer

## Technical Details
- **Fonts**: `@import` Google Fonts (Sora, Inter, Bebas Neue) in `src/routes/__root.tsx`.
- **Icons**: Use `Lucide React` for technical icons, styled with brand colors.
- **Animations**: Use `framer-motion` (or standard Tailwind transitions) for smooth fades, slides, and robot glows.
- **Responsiveness**: Mobile-first approach with a hamburger menu.
- **SEO**: Meta tags and Open Graph data tailored for Automatiza Solução.
