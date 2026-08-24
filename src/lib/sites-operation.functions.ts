import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "@/lib/prisma.server";
import { authMiddleware, roleMiddleware } from "./auth.middleware";

export const getOrdersForKanban = createServerFn({ method: "GET" })
  .middleware([roleMiddleware(["MASTER_ADMIN", "ADMIN", "OPERATOR"])])
  .handler(async () => {
    if (!process.env['DATABASE_URL']) return [];
    try {
      const orders = await prisma.siteOrder.findMany({
        include: {
          template: true,
          user: { select: { name: true, email: true } }
        },
        orderBy: { updatedAt: 'desc' }
      });
      return orders;
    } catch (error) {
      console.error('getOrdersForKanban failed:', error);
      return [];
    }
  });

// ... rest of the functions refactored to use middleware
