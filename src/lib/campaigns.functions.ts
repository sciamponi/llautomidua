import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma.server";
import { getAdminUserInternal } from "./auth";

const CampaignCreateSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().or(z.literal("")),
  companyId: z.string().min(1),
  imageUrl: z.string().optional().or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "ENDED"]).default("DRAFT"),
  ctaText: z.string().optional().or(z.literal("")),
});

const CampaignUpdateSchema = CampaignCreateSchema.partial().extend({
  id: z.string(),
});

export const getCampaigns = createServerFn({ method: "GET" }).handler(async () => {
  const admin = await getAdminUserInternal();
  if (!admin) throw new Error("Não autorizado");

  return await prisma.campaign.findMany({
    include: {
      company: true,
      _count: { select: { leads: true, ads: true } },
    },
    orderBy: { createdAt: "desc" },
  });
});

export const getCampaignById = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    if (typeof data !== "string") throw new Error("Campaign id required");
    return data;
  })
  .handler(async ({ data }) => {
    const admin = await getAdminUserInternal();
    if (!admin) throw new Error("Não autorizado");

    return await prisma.campaign.findUnique({
      where: { id: data },
      include: {
        company: true,
        ads: true,
        _count: { select: { leads: true } },
      },
    });
  });

export const createCampaign = createServerFn({ method: "POST" })
  .validator((data: unknown) => CampaignCreateSchema.parse(data))
  .handler(async ({ data }) => {
    const admin = await getAdminUserInternal();
    if (!admin) throw new Error("Não autorizado");

    const slug = `${data.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}-${Math.random().toString(36).slice(2, 6)}`;

    return await prisma.campaign.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        companyId: data.companyId,
        imageUrl: data.imageUrl || null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: data.status,
        ctaText: data.ctaText || null,
      },
    });
  });

export const updateCampaign = createServerFn({ method: "POST" })
  .validator((data: unknown) => CampaignUpdateSchema.parse(data))
  .handler(async ({ data }) => {
    const admin = await getAdminUserInternal();
    if (!admin) throw new Error("Não autorizado");

    const { id, ...rest } = data;

    return await prisma.campaign.update({
      where: { id },
      data: {
        ...(rest.name !== undefined ? { name: rest.name } : {}),
        ...(rest.description !== undefined ? { description: rest.description } : {}),
        ...(rest.companyId !== undefined ? { companyId: rest.companyId } : {}),
        ...(rest.imageUrl !== undefined ? { imageUrl: rest.imageUrl } : {}),
        ...(rest.startDate !== undefined ? { startDate: new Date(rest.startDate) } : {}),
        ...(rest.endDate !== undefined ? { endDate: new Date(rest.endDate) } : {}),
        ...(rest.status !== undefined ? { status: rest.status } : {}),
        ...(rest.ctaText !== undefined ? { ctaText: rest.ctaText } : {}),
      },
    });
  });

export const deleteCampaign = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (typeof data !== "string") throw new Error("Campaign id required");
    return data;
  })
  .handler(async ({ data: id }) => {
    const admin = await getAdminUserInternal();
    if (!admin) throw new Error("Não autorizado");

    await prisma.campaign.delete({ where: { id } });
    return { success: true };
  });

export const getActiveCampaigns = createServerFn({ method: "GET" }).handler(async () => {
  return await prisma.campaign.findMany({
    where: { status: "ACTIVE" },
    include: { company: true },
    orderBy: { updatedAt: "desc" },
  });
});
