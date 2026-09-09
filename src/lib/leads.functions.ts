import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma.server";
import { getClientIp } from "./auth";

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
  type: z.enum([
    "GENERAL",
    "DEMO",
    "QUOTE",
    "SCREEN_INSTALLATION",
    "SCREEN_ADVERTISING",
    "PARTNER",
    "SITE_ORDER",
  ]),
});

export const captureLead = createServerFn({ method: "POST" })
  .validator((data: unknown) => LeadSchema.parse(data))
  .handler(async ({ data }) => {
    const lead = await prisma.lead.create({
      data: {
        name: data.name.trim(),
        email: data.email || null,
        whatsapp: data.whatsapp.trim(),
        companyName: data.company || null,
        city: data.city || null,
        address: data.address || null,
        establishmentType: data.establishmentType || null,
        screenCount: data.screenCount ?? null,
        segment: data.segment || null,
        objective: data.objective || null,
        message: data.message || null,
        type: data.type,
        status: "NOVO",
        source: "FORM",
        ipAddress: (await getClientIp()) || null,
      },
    });

    return { success: true, message: "Lead capturado com sucesso!", leadId: lead.id };
  });
