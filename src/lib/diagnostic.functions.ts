import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { recommendProductLogic } from "./diagnostic.server";

export const recommendProduct = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return z.object({
      businessSegment: z.string(),
      mainProblem: z.string(),
      specificNeed: z.string().optional().nullable(),
      currentOperation: z.string().optional().nullable(),
    }).parse(data);
  })
  .handler(async ({ data }) => {
    return recommendProductLogic({
      businessSegment: data.businessSegment,
      mainProblem: data.mainProblem,
      specificNeed: data.specificNeed ?? null,
      currentOperation: data.currentOperation ?? null,
    });
  });

export const completeDiagnostic = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return z.object({
      sessionId: z.string(),
      answers: z.record(z.string(), z.any()),
      leadData: z.object({
        name: z.string(),
        whatsapp: z.string(),
        email: z.string().optional().nullable(),
      }).optional().nullable()
    }).parse(data);
  })
  .handler(async ({ data }) => {
    const answers = data.answers;
    const result = await recommendProductLogic({
      businessSegment: String(answers['businessSegment'] || ""),
      mainProblem: String(answers['mainProblem'] || ""),
      specificNeed: answers['specificNeed'] ? String(answers['specificNeed']) : null,
      currentOperation: answers['currentOperation'] ? String(answers['currentOperation']) : null,
    });

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
  .validator((data: unknown) => {
    return z.object({
      sessionId: z.string(),
      step: z.number(),
      data: z.record(z.string(), z.any()),
    }).parse(data);
  })
  .handler(async ({ data }) => {
    console.log(`Updating session ${data.sessionId} at step ${data.step}`, data.data);
    return { success: true };
  });
