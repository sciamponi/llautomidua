import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma.server";
import { getAdminUserInternal } from "./auth";

const LeadStatusSchema = z.enum([
  "NOVO",
  "CONTATO_INICIADO",
  "EM_ATENDIMENTO",
  "CONVERTIDO",
  "PERDIDO",
]);

const LeadListSchema = z.object({
  search: z.string().optional().or(z.literal("")),
  campaignId: z.string().optional().or(z.literal("")),
  companyId: z.string().optional().or(z.literal("")),
  status: LeadStatusSchema.optional(),
  from: z.string().optional().or(z.literal("")),
  to: z.string().optional().or(z.literal("")),
});

export const getLeads = createServerFn({ method: "GET" })
  .validator((data: unknown) => LeadListSchema.parse(data ?? {}))
  .handler(async ({ data }) => {
    const admin = await getAdminUserInternal();
    if (!admin) throw new Error("Não autorizado");

    const where: Record<string, unknown> = {};

    if (data.search) {
      where["OR"] = [
        { name: { contains: data.search, mode: "insensitive" } },
        { whatsapp: { contains: data.search, mode: "insensitive" } },
        { email: { contains: data.search, mode: "insensitive" } },
        { companyName: { contains: data.search, mode: "insensitive" } },
      ];
    }

    if (data.campaignId) where["campaignId"] = data.campaignId;
    if (data.companyId) where["companyId"] = data.companyId;
    if (data.status) where["status"] = data.status;

    if (data.from || data.to) {
      const createdAt: Record<string, Date> = {};
      if (data.from) createdAt["gte"] = new Date(data.from);
      if (data.to) {
        const toDate = new Date(data.to);
        toDate.setHours(23, 59, 59, 999);
        createdAt["lte"] = toDate;
      }
      where["createdAt"] = createdAt;
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          campaign: { select: { id: true, name: true, slug: true } },
          ad: { select: { id: true, title: true } },
          screen: { select: { id: true, name: true, identifier: true } },
          company: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
      prisma.lead.count({ where }),
    ]);

    return { leads, total };
  });

export const getLeadById = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    if (typeof data !== "string") throw new Error("Lead id required");
    return data;
  })
  .handler(async ({ data: id }) => {
    const admin = await getAdminUserInternal();
    if (!admin) throw new Error("Não autorizado");

    return await prisma.lead.findUnique({
      where: { id },
      include: {
        campaign: true,
        ad: true,
        screen: true,
        company: true,
      },
    });
  });

export const updateLeadStatus = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        id: z.string(),
        status: LeadStatusSchema,
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const admin = await getAdminUserInternal();
    if (!admin) throw new Error("Não autorizado");

    return await prisma.lead.update({
      where: { id: data.id },
      data: { status: data.status },
    });
  });
