import { createServerFn } from "@tanstack/react-start";

export const getPipelineSummary = createServerFn({ method: "GET" })
  .handler(async () => {
    // In production this would query Prisma
    return {
      totalProjects: 24,
      pipelineValue: 38500,
      pendingValue: 8900,
      paidValue: 29600
    };
  });
