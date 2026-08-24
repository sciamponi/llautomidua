import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getProducts } from "./products.functions";

export const SCORING_WEIGHTS = {
  SEGMENT: 100,
  PROBLEM: 50,
  NEED: 30,
  OPERATION: 10,
};

export const recommendProduct = createServerFn({ method: "POST" })
  .validator((data: any) => z.object({
    businessSegment: z.string(),
    mainProblem: z.string(),
    specificNeed: z.string().optional(),
    currentOperation: z.string().optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    const products = await getProducts();
    
    // Scoring engine logic
    const results = products.map(product => {
      let score = 0;
      let reasons: string[] = [];

      // Segment Match (+100)
      if (product.segment.toLowerCase() === data.businessSegment.toLowerCase()) {
        score += SCORING_WEIGHTS.SEGMENT;
        reasons.push(`Solução específica para o segmento de ${product.segment}`);
      }

      // Problem Match (+50)
      // Basic fuzzy match for mock demonstration
      if (product.problem?.toLowerCase().includes(data.mainProblem.toLowerCase()) || 
          data.mainProblem.toLowerCase().includes(product.slug.toLowerCase())) {
        score += SCORING_WEIGHTS.PROBLEM;
        reasons.push(`Atende diretamente ao problema de ${data.mainProblem}`);
      }

      // Special Rules from VOIDPRO-11
      if (data.businessSegment === "barbearia" && data.mainProblem === "agendamento" && product.slug === "barberia") {
        score += 50; // Extra boost for BarberIA in barbearia context
      }
      
      if (data.businessSegment === "pet_shop" && product.slug === "petflow") {
        score += 50;
      }

      return {
        product,
        score,
        reason: reasons.join(". "),
      };
    }).sort((a, b) => b.score - a.score);

    const topMatch = results[0];
    const secondMatch = results[1];
    
    let confidence = "LOW";
    if (topMatch.score > 150) {
      if (!secondMatch || (topMatch.score - secondMatch.score) > 50) {
        confidence = "HIGH";
      } else {
        confidence = "MEDIUM";
      }
    }

    // Tie/Close match handling
    const recommendations = results.slice(0, 2).filter(r => r.score > 50);

    if (topMatch.score < 50) {
      return {
        status: "needs_review",
        message: "Entendemos parte do seu cenário, mas queremos indicar a solução certa para sua operação.",
        recommendations: []
      };
    }

    return {
      status: "success",
      confidence,
      topMatch,
      recommendations,
    };
  });

export const createDiagnosticSession = createServerFn({ method: "POST" })
  .handler(async () => {
    // In a real DB scenario, this would create a row in DiagnosticSession
    // For now, we return a mock ID
    return { id: `sess_${Math.random().toString(36).substr(2, 9)}` };
  });

export const updateDiagnosticSession = createServerFn({ method: "POST" })
  .validator((data: any) => z.object({
    sessionId: z.string(),
    step: z.number(),
    data: z.record(z.any()),
  }).parse(data))
  .handler(async ({ data }) => {
    // Mock update
    console.log(`Updating session ${data.sessionId} at step ${data.step}`, data.data);
    return { success: true };
  });
