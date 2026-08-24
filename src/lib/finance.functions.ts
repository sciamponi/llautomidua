import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { roleMiddleware } from "./auth.middleware";

export const getPipelineSummary = createServerFn({ method: "GET" })
  .middleware([roleMiddleware(["MASTER_ADMIN", "ADMIN", "OPERATOR"])])
  .handler(async () => {
    if (!process.env['DATABASE_URL']) {
      return {
        totalProjects: 24,
        pipelineValue: 38500,
        pendingValue: 8900,
        paidValue: 29600,
        simulated: true
      };
    }

    const { prisma } = await import("@/lib/prisma.server");
    
    try {
      const [totalProjects, paidSum, pendingSum] = await Promise.all([
        prisma.siteOrder.count(),
        prisma.payment.aggregate({
          where: { status: 'PAID' },
          _sum: { amount: true }
        }),
        prisma.payment.aggregate({
          where: { status: 'PENDING' },
          _sum: { amount: true }
        })
      ]);

      const paidValue = Number(paidSum._sum.amount || 0);
      const pendingValue = Number(pendingSum._sum.amount || 0);

      return {
        totalProjects,
        pipelineValue: paidValue + pendingValue,
        pendingValue,
        paidValue,
        simulated: false
      };
    } catch (error) {
      console.error('getPipelineSummary failed:', error);
      return {
        totalProjects: 0,
        pipelineValue: 0,
        pendingValue: 0,
        paidValue: 0,
        error: "Failed to load financial data"
      };
    }
  });
