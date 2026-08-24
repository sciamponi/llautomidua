import { createServerFn } from "@tanstack/react-start";
import { MOCK_PRODUCTS } from "@/lib/products.data";

export const getProducts = createServerFn({ method: "GET" })
  .handler(async () => {
    if (!process.env['DATABASE_URL']) return MOCK_PRODUCTS;
    try {
      const { prisma } = await import("@/lib/prisma.server");
      const products = await prisma.product.findMany({
        where: { status: 'active' },
        include: {
          gallery: { orderBy: { sortOrder: 'asc' } }
        },
        orderBy: { sortOrder: 'asc' }
      });
      return products.length > 0 ? JSON.parse(JSON.stringify(products)) : MOCK_PRODUCTS;
    } catch (e) {
      return MOCK_PRODUCTS;
    }
  });

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: string) => data)
  .handler(async ({ data }) => {
    if (!process.env['DATABASE_URL']) return MOCK_PRODUCTS.find(p => p.slug === data) || null;
    try {
      const { prisma } = await import("@/lib/prisma.server");
      const product = await prisma.product.findUnique({
        where: { slug: data },
        include: {
          gallery: { orderBy: { sortOrder: 'asc' } },
          recommendations: { include: { recommendedProduct: true } }
        }
      });
      return product ? JSON.parse(JSON.stringify(product)) : MOCK_PRODUCTS.find(p => p.slug === data) || null;
    } catch (e) {
      return MOCK_PRODUCTS.find(p => p.slug === data) || null;
    }
  });
