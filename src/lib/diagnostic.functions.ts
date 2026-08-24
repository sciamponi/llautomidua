import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { recommendProductLogic } from "./diagnostic.server";

export const recommendProduct = createServerFn({ method: "POST" })
  .validator((data: any) => z.object({
    businessSegment: z.string(),
    mainProblem: z.string(),
    specificNeed: z.string().optional(),
    currentOperation: z.string().optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    return recommendProductLogic(data);
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
    const result = await recommendProductLogic({
      businessSegment: String(data.answers['businessSegment'] || ""),
      mainProblem: String(data.answers['mainProblem'] || ""),
      specificNeed: data.answers['specificNeed'] ? String(data.answers['specificNeed']) : undefined,
      currentOperation: data.answers['currentOperation'] ? String(data.answers['currentOperation']) : undefined,
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
  .validator((data: any) => z.object({
    sessionId: z.string(),
    step: z.number(),
    data: z.record(z.any()),
  }).parse(data))
  .handler(async ({ data }) => {
    console.log(`Updating session ${data.sessionId} at step ${data.step}`, data.data);
    return { success: true };
  });
