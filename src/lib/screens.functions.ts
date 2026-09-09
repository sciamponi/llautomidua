import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma.server";
import { getAdminUserInternal } from "./auth";

const ScreenCreateSchema = z.object({
  name: z.string().min(2),
  identifier: z.string().min(2),
  location: z.string().optional().or(z.literal("")),
  establishment: z.string().optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]).default("ACTIVE"),
  currentCampaignId: z.string().optional().or(z.literal("")),
  companyId: z.string().optional().or(z.literal("")),
});

export const getScreens = createServerFn({ method: "GET" }).handler(async () => {
  const admin = await getAdminUserInternal();
  if (!admin) throw new Error("Não autorizado");

  return await prisma.screen.findMany({
    include: {
      currentCampaign: { select: { id: true, name: true } },
      company: { select: { id: true, name: true } },
      _count: { select: { leads: true, ads: true } },
    },
    orderBy: { createdAt: "desc" },
  });
});

export const createScreen = createServerFn({ method: "POST" })
  .validator((data: unknown) => ScreenCreateSchema.parse(data))
  .handler(async ({ data }) => {
    const admin = await getAdminUserInternal();
    if (!admin) throw new Error("Não autorizado");

    return await prisma.screen.create({
      data: {
        name: data.name,
        identifier: data.identifier,
        location: data.location || null,
        establishment: data.establishment || null,
        status: data.status,
        currentCampaignId: data.currentCampaignId || null,
        companyId: data.companyId || null,
      },
    });
  });

export const updateScreen = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        id: z.string(),
        name: z.string().min(2),
        identifier: z.string().min(2),
        location: z.string().optional().or(z.literal("")),
        establishment: z.string().optional().or(z.literal("")),
        status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]),
        currentCampaignId: z.string().optional().or(z.literal("")),
        companyId: z.string().optional().or(z.literal("")),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const admin = await getAdminUserInternal();
    if (!admin) throw new Error("Não autorizado");

    const { id, ...rest } = data;

    return await prisma.screen.update({
      where: { id },
      data: {
        name: rest.name,
        identifier: rest.identifier,
        location: rest.location || null,
        establishment: rest.establishment || null,
        status: rest.status,
        currentCampaignId: rest.currentCampaignId || null,
        companyId: rest.companyId || null,
      },
    });
  });

export const deleteScreen = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (typeof data !== "string") throw new Error("Screen id required");
    return data;
  })
  .handler(async ({ data: id }) => {
    const admin = await getAdminUserInternal();
    if (!admin) throw new Error("Não autorizado");

    await prisma.screen.delete({ where: { id } });
    return { success: true };
  });
