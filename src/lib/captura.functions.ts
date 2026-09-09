import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma.server";
import { getClientIp } from "./auth";

export const getCampaignForCapture = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    if (typeof data !== "string") throw new Error("Campaign id required");
    return data;
  })
  .handler(async ({ data: campaignId }) => {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        company: true,
      },
    });

    if (!campaign) {
      return null;
    }

    return {
      id: campaign.id,
      name: campaign.name,
      slug: campaign.slug,
      description: campaign.description,
      imageUrl: campaign.imageUrl,
      status: campaign.status,
      ctaText: campaign.ctaText,
      company: {
        id: campaign.company.id,
        name: campaign.company.name,
        logo: campaign.company.logo,
      },
    };
  });

const SubmitLeadSchema = z.object({
  campaignId: z.string().min(1),
  adId: z.string().optional().or(z.literal("")),
  screenId: z.string().optional().or(z.literal("")),
  name: z.string().min(2),
  whatsapp: z.string().min(8),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  source: z.string().optional().default("QR_CODE"),
  utmSource: z.string().optional().or(z.literal("")),
  utmMedium: z.string().optional().or(z.literal("")),
  utmCampaign: z.string().optional().or(z.literal("")),
});

export const submitLead = createServerFn({ method: "POST" })
  .validator((data: unknown) => SubmitLeadSchema.parse(data))
  .handler(async ({ data }) => {
    const campaign = await prisma.campaign.findUnique({
      where: { id: data.campaignId },
      include: { company: true },
    });

    if (!campaign) {
      throw new Error("Campanha não encontrada");
    }

    if (campaign.status !== "ACTIVE") {
      throw new Error("Esta campanha não está ativa no momento.");
    }

    const lead = await prisma.lead.create({
      data: {
        name: data.name.trim(),
        whatsapp: data.whatsapp.trim(),
        email: data.email || null,
        city: data.city || null,
        companyName: campaign.company.name,
        type: "MEDIA_INDOOR",
        status: "NOVO",
        campaignId: campaign.id,
        companyId: campaign.companyId,
        adId: data.adId || null,
        screenId: data.screenId || null,
        source: data.source || "QR_CODE",
        ipAddress: (await getClientIp()) || null,
        userAgent: null,
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null,
      },
    });

    return {
      success: true,
      leadId: lead.id,
      campaign: campaign.name,
    };
  });
