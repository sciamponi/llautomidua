import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "@/lib/prisma.server";
import { randomBytes } from "crypto";

const RequestDemoSchema = z.object({
  name: z.string().min(2),
  whatsapp: z.string().min(8),
  email: z.string().email().optional().or(z.literal("")),
  productId: z.string(),
});

export const requestDemoAccess = createServerFn({ method: "POST" })
  .validator((data: unknown) => RequestDemoSchema.parse(data))
  .handler(async ({ data }) => {
    // 1. Create/Update Lead
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        whatsapp: data.whatsapp,
        email: data.email || null,
        productId: data.productId,
        type: 'DEMO',
        source: 'DEMO_MODAL',
      }
    });

    // 2. Fetch Product Config
    const product = await prisma.product.findUnique({
      where: { id: data.productId }
    });

    if (!product || !product.demoActive) {
      throw new Error("Demonstração não disponível para este produto.");
    }

    // 3. Generate Secure Token
    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = await hashToken(rawToken);

    // 4. Create Demo Access Record
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + (product.demoDurationHours || 24));

    await prisma.demoAccess.create({
      data: {
        leadId: lead.id,
        productId: product.id,
        tokenHash,
        expiresAt,
        status: 'ACTIVE'
      }
    });

    return { 
      success: true, 
      token: rawToken,
      expiresAt: expiresAt.toISOString()
    };
  });

export const validateDemoToken = createServerFn({ method: "GET" })
  .validator((token: string) => z.string().parse(token))
  .handler(async ({ data: token }) => {
    const tokenHash = await hashToken(token);
    
    const access = await prisma.demoAccess.findUnique({
      where: { tokenHash },
      include: { product: true, lead: true }
    });

    if (!access) return { valid: false, error: "Token inválido." };
    if (access.status !== 'ACTIVE') return { valid: false, error: "Acesso não está ativo." };
    if (new Date() > access.expiresAt) {
      // Auto-expire
      await prisma.demoAccess.update({
        where: { id: access.id },
        data: { status: 'EXPIRED' }
      });
      return { valid: false, error: "Acesso expirado." };
    }

    // Update stats
    await prisma.demoAccess.update({
      where: { id: access.id },
      data: {
        accessCount: { increment: 1 },
        lastAccessAt: new Date(),
        firstAccessAt: access.firstAccessAt || new Date()
      }
    });

    return { 
      valid: true, 
      product: access.product,
      expiresAt: access.expiresAt.toISOString()
    };
  });

export const getDemoStats = createServerFn({ method: "GET" })
  .handler(async () => {
    const totalRequests = await prisma.demoAccess.count();
    const activeDemos = await prisma.demoAccess.count({ where: { status: 'ACTIVE' } });
    const accessedDemos = await prisma.demoAccess.count({ where: { accessCount: { gt: 0 } } });

    return {
      totalRequests,
      activeDemos,
      accessedDemos
    };
  });

async function hashToken(token: string) {
  const msgUint8 = new TextEncoder().encode(token);
  // Using Web Crypto API for consistency if possible, otherwise Node crypto
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
