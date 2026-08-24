# Plan: Commercial Recommendation Engine Overhaul (VOIDPRO-10 & 11)

Transform the current diagnostic form into a robust commercial engine that uses a scoring matrix to recommend the best products (SaaS, Service, Media) based on business segment and specific pain points.

## User Review Required

> [!IMPORTANT]
> - New diagnostic logic: **Specific Solution > Generic Solution**.
> - Data will be persisted in four new tables: `DiagnosticSession`, `DiagnosticResult`, `DiagnosticRecommendation`, and `DiagnosticRule`.
> - `PetFlow` will be added to the catalog as a new SaaS solution for Pet Shops.
> - The diagnostic will now be dynamic: questions change based on the selected business segment.

## Proposed Changes

### Database & Models
- Update `prisma/schema.prisma`:
    - `DiagnosticSession`: Track the user's progress through the quiz.
    - `DiagnosticResult`: Store the final calculated recommendation.
    - `DiagnosticRecommendation`: Link multiple potential products to a result (main + alternatives).
    - `DiagnosticRule`: Configurable scoring rules (e.g., segment=barbearia + problem=agendamento -> BarberIA).
- Add `PetFlow` to `MOCK_PRODUCTS` in `src/lib/products.functions.ts` as a placeholder until the full DB migration is complete.

### Backend (Commercial Logic)
- Create `src/lib/diagnostic.functions.ts`:
    - `SCORING_WEIGHTS`: Constant for `SEGMENT=100`, `PROBLEM=50`, `NEED=30`, `OPERATION=10`.
    - `recommendProduct`: Server function that:
        - Calculates scores for all active products.
        - Determines `confidence` (HIGH, MEDIUM, LOW) based on score gaps.
        - Handles ties by suggesting up to 2 options.
        - Implements fallback to "Talk to Specialist" if no solution fits (score below threshold).
    - `createDiagnosticSession`: Start tracking a user path.
    - `updateDiagnosticSession`: Save progress step-by-step.
    - `completeDiagnostic`: Finalize session, calculate recommendation, and link to a `Lead`.

### Frontend (User Experience)
- Refactor `src/components/automatiza/quiz/DiagnosticQuiz.tsx`:
    - **Step-by-step Progressive UI**: High-impact animations with `framer-motion`.
    - **Dynamic Question Engine**:
        - Q1: Business Segment (Barbearia, Pet Shop, Gym, etc.).
        - Q2: Segment-specific challenges.
        - Q3: Specific operational needs based on Q2.
        - Q4: Current operation level.
    - **Recommendation Screen**:
        - Show "Ideal Solution" with specific reasoning ("Based on your challenge with agendamento...").
        - Show alternative solutions if confidence is not 100%.
        - Integrated Lead Capture form at the end of the flow.

### Routing & Integration
- Update `src/routes/diagnostico/index.tsx` to mount the new `DiagnosticQuiz`.
- Ensure `Media Indoor` flow is triggered correctly when the user selects "Publicidade" or "Instalação de Telas".

## Technical Details
- Scoring algorithm: `TotalScore = Σ (AnswerWeight * RuleMatch)`.
- Confidence: `High` if top score > 150 and gap to 2nd is > 50. `Medium` if gap < 50. `Low` if top score < 100.
- State management: Use local React state for the UI, but persist every step to the DB via `updateDiagnosticSession` to capture "abandoned" funnels.

## Success Criteria
- [ ] Selecting "Barbearia" + "Agendamento" recommends **BarberIA**.
- [ ] Selecting "Pet Shop" recommends **PetFlow**.
- [ ] Selecting "Publicidade" recommends **Media Indoor / Publicidade**.
- [ ] "Talk to Specialist" appears when no match is found.
- [ ] Lead record in DB is correctly linked to the `DiagnosticSession`.
