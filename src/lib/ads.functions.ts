import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma.server";
import { getAdminUserInternal } from "./auth";

const AdCreateSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional().or(z.literal("")),
  imageUrl: z.string().optional().or(z.literal("")),
  videoUrl: z.string().optional().or(z.literal("")),
  ctaText: z.string().optional().or(z.literal("")),
  campaignId: z.string().min(1),
  screenId: z.string().optional().or(z.literal("")),
  duration: z.number().optional(),
  priority: z.number().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

const AdUpdateSchema = AdCreateSchema.partial().extend({ id: z.string() });

export const getAds = createServerFn({ method: "GET" }).handler(async () => {
  const admin = await getAdminUserInternal();
  if (!admin) throw new Error("Não autorizado");

  return await prisma.ad.findMany({
    include: {
      campaign: { include: { company: true } },
      screen: true,
      _count: { select: { leads: true } },
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });
});

export const createAd = createServerFn({ method: "POST" })
  .validator((data: unknown) => AdCreateSchema.parse(data))
  .handler(async ({ data }) => {
    const admin = await getAdminUserInternal();
    if (!admin) throw new Error("Não autorizado");

    return await prisma.ad.create({
      data: {
        title: data.title,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        videoUrl: data.videoUrl || null,
        ctaText: data.ctaText || null,
        campaignId: data.campaignId,
        screenId: data.screenId || null,
        duration: data.duration ?? 15,
        priority: data.priority ?? 0,
        status: data.status,
      },
    });
  });

export const updateAd = createServerFn({ method: "POST" })
  .validator((data: unknown) => AdUpdateSchema.parse(data))
  .handler(async ({ data }) => {
    const admin = await getAdminUserInternal();
    if (!admin) throw new Error("Não autorizado");

    const { id, ...rest } = data;

    return await prisma.ad.update({
      where: { id },
      data: {
        ...(rest.title !== undefined ? { title: rest.title } : {}),
        ...(rest.description !== undefined ? { description: rest.description } : {}),
        ...(rest.imageUrl !== undefined ? { imageUrl: rest.imageUrl } : {}),
        ...(rest.videoUrl !== undefined ? { videoUrl: rest.videoUrl } : {}),
        ...(rest.ctaText !== undefined ? { ctaText: rest.ctaText } : {}),
        ...(rest.campaignId !== undefined ? { campaignId: rest.campaignId } : {}),
        ...(rest.screenId !== undefined ? { screenId: rest.screenId } : {}),
        ...(rest.duration !== undefined ? { duration: rest.duration } : {}),
        ...(rest.priority !== undefined ? { priority: rest.priority } : {}),
        ...(rest.status !== undefined ? { status: rest.status } : {}),
      },
    });
  });

export const deleteAd = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (typeof data !== "string") throw new Error("Ad id required");
    return data;
  })
  .handler(async ({ data: id }) => {
    const admin = await getAdminUserInternal();
    if (!admin) throw new Error("Não autorizado");

    await prisma.ad.delete({ where: { id } });
    return { success: true };
  });
