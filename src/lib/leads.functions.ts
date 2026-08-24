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
  type: z.enum(['GENERAL', 'DEMO', 'QUOTE', 'SCREEN_INSTALLATION', 'SCREEN_ADVERTISING', 'PARTNER', 'SITE_ORDER']),
});

export const captureLead = createServerFn({ method: "POST" })
  .validator((data: unknown) => LeadSchema.parse(data))
  .handler(async ({ data }) => {
    console.log('Server capturing lead:', data);
    
    // Simulating database latency
    await new Promise(resolve => setTimeout(resolve, 500));

    // In production: return await prisma.lead.create({ data });
    return { success: true, message: "Lead capturado com sucesso!" };
  });
