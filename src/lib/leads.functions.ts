import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const LeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  whatsapp: z.string().min(8),
  company: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  establishmentType: z.string().optional(),
  screenCount: z.number().optional(),
  segment: z.string().optional(),
  objective: z.string().optional(),
  message: z.string().optional(),
  type: z.enum(['GENERAL', 'DEMO', 'QUOTE', 'SCREEN_INSTALLATION', 'SCREEN_ADVERTISING', 'PARTNER', 'SPECIALIST_CLICK']),
});

export const captureLead = createServerFn({ method: "POST" })
  .validator((data: unknown) => LeadSchema.parse(data))
  .handler(async ({ data }) => {
    console.log('Server capturing lead:', data);
    
    if (!process.env['DATABASE_URL']) {
      // Preview mode simulated response
      return { success: true, simulated: true, message: "Lead capturado com sucesso (Modo Simulado)!" };
    }

    const { prisma } = await import("@/lib/prisma.server");
    
    try {
      await prisma.lead.create({
        data: {
          name: data.name,
          email: data.email || null,
          whatsapp: data.whatsapp,
          company: data.company || null,
          city: data.city || null,
          address: data.address || null,
          establishmentType: data.establishmentType || null,
          screenCount: data.screenCount ?? null,
          segment: data.segment || null,
          objective: data.objective || null,
          message: data.message || null,
          type: data.type,
          source: "DIRECT_FORM"
        }
      });
      return { success: true, simulated: false, message: "Lead capturado com sucesso!" };
    } catch (error) {
      console.error('Lead capture failed:', error);
      throw new Error("Não foi possível salvar o lead no momento.");
    }
  });
