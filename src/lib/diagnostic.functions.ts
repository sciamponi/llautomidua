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
    const results = products.map((product: any) => {
      let score = 0;
      let reasons: string[] = [];

      // Segment Match (+100)
      if (product.segment && product.segment.toLowerCase() === data.businessSegment.toLowerCase()) {
        score += SCORING_WEIGHTS.SEGMENT;
        reasons.push(`Solução específica para o segmento de ${product.segment}`);
      }

      // Problem Match (+50)
      const productProblem = product.problem || "";
      if (productProblem.toLowerCase().includes(data.mainProblem.toLowerCase()) || 
          data.mainProblem.toLowerCase().includes(product.slug.toLowerCase())) {
        score += SCORING_WEIGHTS.PROBLEM;
        reasons.push(`Atende diretamente ao problema de ${data.mainProblem}`);
      }

      // Special Rules from VOIDPRO-11
      if (data.businessSegment === "barbearia" && data.mainProblem === "agendamento" && product.slug === "barberia") {
        score += 50;
      }
      
      if (data.businessSegment === "pet_shop" && product.slug === "petflow") {
        score += 50;
      }

      if (data.mainProblem === "sites" && product.slug === "sites") {
        score += 150;
        reasons.push("Recomendação direta para Presença Digital & Sites Profissionais");
      }


      return {
        product,
        score,
        reason: reasons.join(". "),
      };
    }).sort((a: any, b: any) => b.score - a.score);

    const topMatch = results[0];
    const secondMatch = results[1];
    
    if (!topMatch || topMatch.score < 50) {
      return {
        status: "needs_review",
        message: "Entendemos parte do seu cenário, mas queremos indicar a solução certa para sua operação.",
        recommendations: []
      };
    }

    let confidence = "LOW";
    if (topMatch.score > 150) {
      if (!secondMatch || (topMatch.score - secondMatch.score) > 50) {
        confidence = "HIGH";
      } else {
        confidence = "MEDIUM";
      }
    }

    // Recommendations that have a meaningful score
    const recommendations = results.slice(0, 2).filter((r: any) => r.score > 50);

    return {
      status: "success",
      confidence,
      topMatch,
      recommendations,
    };
  });


export const completeDiagnostic = createServerFn({ method: "POST" })
  .validator((data: any) => z.object({
    sessionId: z.string(),
    answers: z.record(z.any()),
    leadData: z.object({
      name: z.string(),
      whatsapp: z.string(),
      email: z.string().optional(),
    }).optional()
  }).parse(data))
  .handler(async ({ data }) => {
    // 1. Calculate Recommendation
    const result = await recommendProduct({
      data: {
        businessSegment: data.answers['businessSegment'] || "",
        mainProblem: data.answers['mainProblem'] || "",
        specificNeed: data.answers['specificNeed'],
        currentOperation: data.answers['currentOperation'],
      }
    });

    // 2. In a real scenario, we would persist this to DiagnosticSession, DiagnosticResult, etc.
    // 3. If leadData is provided, create a Lead linked to the session
    console.log(`Completing session ${data.sessionId}`, { result, leadData: data.leadData });
    
    return {
      success: true,
      result,
      sessionId: data.sessionId
    };
  });

export const createDiagnosticSession = createServerFn({ method: "POST" })
  .handler(async () => {
    return { id: `sess_${Math.random().toString(36).substr(2, 9)}` };
  });

export const updateDiagnosticSession = createServerFn({ method: "POST" })
  .validator((data: any) => z.object({
    sessionId: z.string(),
    step: z.number(),
    data: z.record(z.any()),
  }).parse(data))
  .handler(async ({ data }) => {
    console.log(`Updating session ${data.sessionId} at step ${data.step}`, data.data);
    return { success: true };
  });
