# Plan - Institutional Landing Page for Automatiza Solução (Updated)

Build the complete landing page for **Automatiza Solução** following the strict brand guidelines and visual direction provided. The focus is on clarity, conversion (Partner Program), and a premium dark aesthetic that avoids "generic SaaS" or "futuristic" tropes.

## User Review Required

> [!IMPORTANT]
> The robot mascot is a central interactive element. I will implement a reusable `RobotMessage` component with specific neon glow states (Green/Success, Yellow/Warning, Red/Danger).
> **No Fake Data**: I will strictly avoid creating fake testimonials, client logos, or fabricated results. Sections without real proof will be transformed into "How it works" or "Why Automatiza".
> **Pricing**: A clear pricing card for the Partner Program (R$ 99/month + R$ 49 per active client) with an interactive calculator.

- **Robot States**:
  - Success: "Tudo certo! Você está no caminho certo. 🚀" (Green Neon)
  - Warning: "Ei! Tem uma oportunidade aqui que você talvez não queira perder. 👀" (Yellow Neon)
  - Danger: "Alerta! Você ainda não faz parte da Automatiza. 😱" (Red Neon)
- **Calculator**: Interactive tool to estimate costs based on active clients.

## Proposed Changes

### 1. Global Styles and Design System
- Update `src/styles.css` with the mandatory palette:
  - Navy: `#071A2F`
  - Electric Blue: `#1E8CFF`
  - Ice White: `#F7F8FA`
  - Operational Yellow: `#F0A820`
  - Cyan: `#4CDFF2`
  - Technical Gray: `#DCE3EA`
- Configure Google Fonts in `src/routes/__root.tsx`: **Sora** (Headlines/Impact) and **Inter** (Body/UI).

### 2. Asset Integration
- Use `lovable-assets` to handle `logo.png` and `imagem-1_13.jpg`.
- Generate the `favicon.ico` from the logo.

### 3. Modular Component Development
Create the following components under `src/components/automatiza/`:
- **`Header`**: Sticky with specific menu and CTA.
- **`Hero`**: Dynamic section with mascot and surrounding UI elements.
- **`RobotMessage`**: The interactive mascot component with neon glow animations.
- **`DiagnosisSection`**: "Chaos vs. Control" visual comparison.
- **`FeatureCards`**: 6 core service cards.
- **`PartnerProgram`**: The 5-step onboarding process.
- **`PartnerPricing`**: Card with special condition (R$ 99).
- **`PricingCalculator`**: Interactive R$ 49/client calculator.
- **`PartnerSignup`**: 6-field capture form.
- **`MembersPreview`**: Visual dashboard for the future members area.
- **`VideoLibrary`**: Structure for tutorial/campaign videos.
- **`FAQ` & `FinalCTA`**: Concluding conversion sections.

### 4. Route Implementation
- **`src/routes/index.tsx`**: Orchestrate the components into the full landing page.
- Implement mobile-first responsivity for all sections.
- Set SEO metadata (Title: "Automatiza Solução | Tecnologia para automatizar. Oportunidades para crescer.").

## Technical Details
- **UI**: Shadcn UI components for cards, inputs, and layout.
- **Animations**: Tailwind transitions and simple `framer-motion` for glows/pulses.
- **States**: `useState` for the calculator and form handling.
- **Mock Data**: Structured objects for videos and dashboard items to allow future integration.
