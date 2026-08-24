import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const RequestDemoSchema = z.object({
  name: z.string().min(2),
  whatsapp: z.string().min(8),
  email: z.string().email().optional().or(z.literal("")),
  productId: z.string(),
});

export const requestDemoAccess = createServerFn({ method: "POST" })
  .validator((data: unknown) => RequestDemoSchema.parse(data))
  .handler(async ({ data }) => {
    const { hashToken, hasDatabase } = await import("@/lib/demo.server");
    const { randomBytes } = await import("crypto");

    const rawToken = randomBytes(32).toString("hex");
    const expiresAt = new Date();

    // Preview / unconfigured environment: return a simulated demo access
    if (!hasDatabase()) {
      expiresAt.setHours(expiresAt.getHours() + 24);
      return {
        success: true,
        simulated: true,
        token: rawToken,
        expiresAt: expiresAt.toISOString(),
      };
    }

    const { prisma } = await import("@/lib/prisma.server");

    try {
      const product = await prisma.product.findUnique({
        where: { id: data.productId },
      });

      if (!product || !product.demoActive) {
        throw new Error("Demonstração não disponível para este produto.");
      }

      const lead = await prisma.lead.create({
        data: {
          name: data.name,
          whatsapp: data.whatsapp,
          email: data.email || null,
          productId: data.productId,
          type: "DEMO",
          source: "DEMO_MODAL",
        },
      });

      expiresAt.setHours(expiresAt.getHours() + (product.demoDurationHours || 24));

      await prisma.demoAccess.create({
        data: {
          leadId: lead.id,
          productId: product.id,
          tokenHash: await hashToken(rawToken),
          expiresAt,
          status: "ACTIVE",
        },
      });

      return {
        success: true,
        simulated: false,
        token: rawToken,
        expiresAt: expiresAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes("Demonstração")) throw error;
      expiresAt.setHours(expiresAt.getHours() + 24);
      return {
        success: true,
        simulated: true,
        token: rawToken,
        expiresAt: expiresAt.toISOString(),
      };
    }
  });

export const validateDemoToken = createServerFn({ method: "GET" })
  .validator((token: string) => z.string().parse(token))
  .handler(async ({ data: token }) => {
    const { hashToken, hasDatabase } = await import("@/lib/demo.server");
    if (!hasDatabase()) {
      return { valid: false, error: "Demonstração indisponível neste ambiente." };
    }
    const { prisma } = await import("@/lib/prisma.server");

    try {
      const tokenHash = await hashToken(token);

      const access = await prisma.demoAccess.findUnique({
        where: { tokenHash },
        include: { product: true, lead: true },
      });

      if (!access) return { valid: false, error: "Token inválido." };
      if (access.status !== "ACTIVE") return { valid: false, error: "Acesso não está ativo." };
      if (new Date() > access.expiresAt) {
        await prisma.demoAccess.update({
          where: { id: access.id },
          data: { status: "EXPIRED" },
        });
        return { valid: false, error: "Acesso expirado." };
      }

      await prisma.demoAccess.update({
        where: { id: access.id },
        data: {
          accessCount: { increment: 1 },
          lastAccessAt: new Date(),
          firstAccessAt: access.firstAccessAt || new Date(),
        },
      });

      return {
        valid: true,
        product: access.product,
        expiresAt: access.expiresAt.toISOString(),
      };
    } catch {
      return { valid: false, error: "Não foi possível validar o acesso." };
    }
  });

export const getDemoStats = createServerFn({ method: "GET" }).handler(async () => {
  const { hasDatabase } = await import("@/lib/demo.server");
  const empty = { totalRequests: 0, activeDemos: 0, accessedDemos: 0 };
  if (!hasDatabase()) return empty;

  const { prisma } = await import("@/lib/prisma.server");
  try {
    const [totalRequests, activeDemos, accessedDemos] = await Promise.all([
      prisma.demoAccess.count(),
      prisma.demoAccess.count({ where: { status: "ACTIVE" } }),
      prisma.demoAccess.count({ where: { accessCount: { gt: 0 } } }),
    ]);
    return { totalRequests, activeDemos, accessedDemos };
  } catch {
    return empty;
  }
});
