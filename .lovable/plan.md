# Plan: Diagnostic Recommendation Engine (VOIDPRO-10)

Evolve the current simple diagnostic form into a robust commercial recommendation engine ("Cérebro Comercial") that prioritizes specific segment solutions over generic ones and persists data for lead qualification.

## User Review Required

> [!IMPORTANT]
> - The new diagnostic will use a scoring system to recommend the best product.
> - We will add `PetFlow` to the mock product list to support the new rules.
> - Lead data from the diagnostic will be persisted in the database via the `Lead` table.

## Proposed Changes

### Database & Schema
- Update `prisma/schema.prisma` to include a `DiagnosticResult` model (optional, for now using `Lead` to store answers).
- Ensure `PetFlow` exists in the mock data in `src/lib/products.functions.ts`.

### Backend (Server Functions)
- Create `src/lib/diagnostic.functions.ts`:
    - `recommendProduct`: A server function that implements the scoring matrix.
        - `SEGMENT_MATCH`: +100
        - `PROBLEM_MATCH`: +50
        - `NECESSITY_MATCH`: +30
    - `saveDiagnosticLead`: Saves lead info along with the diagnostic answers.

### Frontend (Diagnostic Experience)
- Refactor `src/components/automatiza/quiz/DiagnosticQuiz.tsx`:
    - **Step-by-step Progressive Flow**: One question at a time with a progress bar.
    - **Dynamic Question Logic**:
        - Q1: Business Segment (Barbearia, Pet Shop, etc.).
        - Q2: Contextual Problem (e.g., if Barbearia -> "Agendamentos", "WhatsApp", etc.).
        - Q3: Specific Necessity (e.g., if Barbearia -> "Organizar horários").
        - Q4: Current Operation (Manual, Planilha, etc.).
    - **New Recommendation View**:
        - Show "Encontramos a solução ideal".
        - Display product icon/name.
        - "Why we recommend this" (bullet points based on answers).
        - Primary CTA: Go to Product Page.
        - Secondary CTA: Speak to Specialist.
        - Alternatives: Show up to 2 other products if relevant.

### Routing & Integration
- Update `src/routes/diagnostico/index.tsx` to handle the new engine state.
- Ensure `Media Indoor` and `Sites` flows are correctly routed based on specific needs.

## Technical Details
- The scoring engine will use `SEGMENT_MATCH_WEIGHT > PROBLEM_MATCH_WEIGHT`.
- Mock products in `src/lib/products.functions.ts` will be updated to include `PetFlow` and refined descriptions.
- Use `framer-motion` for smooth transitions between questions.

## Success Criteria
- [ ] Barbearia -> BarberIA.
- [ ] Pet Shop -> PetFlow.
- [ ] General Business + WhatsApp -> Automatiza.
- [ ] Result shows the "Reasoning" behind the recommendation.
- [ ] Lead is saved with the chosen path.
