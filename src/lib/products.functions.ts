import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "@/lib/prisma.server";

// We keep the logic but move to DB where possible
// For a multi-product architecture, Products should be in DB.

export const getProducts = createServerFn({ method: "GET" })
  .handler(async () => {
    if (!process.env['DATABASE_URL']) {
       // Fallback for preview
       return [
         {
           id: "prod_1",
           name: "Automatiza",
           slug: "automacao",
           type: "SAAS",
           category: "Atendimento & WhatsApp",
           status: "active",
           featured: true,
           problem: "Tenho muitas mensagens e dificuldade para organizar.",
         }
       ];
    }
    return await prisma.product.findMany({
      where: { status: 'active' },
      orderBy: { sortOrder: 'asc' }
    });
  });

export const getProductBySlug = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async ({ data }) => {
    if (!process.env['DATABASE_URL']) return null;
    return await prisma.product.findUnique({
      where: { slug: data },
      include: {
        recommendations: { include: { recommendedProduct: true } }
      }
    });
  });
