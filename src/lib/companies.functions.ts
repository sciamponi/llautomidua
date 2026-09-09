import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma.server";
import { getAdminUserInternal } from "./auth";

const CompanyCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional().or(z.literal("")),
  logo: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
  status: z.string().optional().default("active"),
});

export const getCompanies = createServerFn({ method: "GET" }).handler(async () => {
  const admin = await getAdminUserInternal();
  if (!admin) throw new Error("Não autorizado");

  return await prisma.company.findMany({
    include: {
      _count: { select: { campaigns: true, screens: true, leads: true } },
    },
    orderBy: { createdAt: "desc" },
  });
});

export const createCompany = createServerFn({ method: "POST" })
  .validator((data: unknown) => CompanyCreateSchema.parse(data))
  .handler(async ({ data }) => {
    const admin = await getAdminUserInternal();
    if (!admin) throw new Error("Não autorizado");

    const slug =
      data.slug ||
      `${data.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")}-${Math.random().toString(36).slice(2, 6)}`;

    return await prisma.company.create({
      data: {
        name: data.name,
        slug,
        logo: data.logo || null,
        phone: data.phone || null,
        email: data.email || null,
        website: data.website || null,
        status: data.status,
      },
    });
  });

export const updateCompany = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        id: z.string(),
        name: z.string().min(2),
        slug: z.string().optional().or(z.literal("")),
        logo: z.string().optional().or(z.literal("")),
        phone: z.string().optional().or(z.literal("")),
        email: z.string().optional().or(z.literal("")),
        website: z.string().optional().or(z.literal("")),
        status: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const admin = await getAdminUserInternal();
    if (!admin) throw new Error("Não autorizado");

    const { id, ...rest } = data;

    return await prisma.company.update({
      where: { id },
      data: {
        name: rest.name,
        ...(rest.slug !== undefined && rest.slug !== "" ? { slug: rest.slug } : {}),
        ...(rest.logo !== undefined ? { logo: rest.logo || null } : {}),
        ...(rest.phone !== undefined ? { phone: rest.phone || null } : {}),
        ...(rest.email !== undefined ? { email: rest.email || null } : {}),
        ...(rest.website !== undefined ? { website: rest.website || null } : {}),
        ...(rest.status !== undefined ? { status: rest.status } : {}),
      },
    });
  });

export const deleteCompany = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (typeof data !== "string") throw new Error("Company id required");
    return data;
  })
  .handler(async ({ data: id }) => {
    const admin = await getAdminUserInternal();
    if (!admin) throw new Error("Não autorizado");

    await prisma.company.delete({ where: { id } });
    return { success: true };
  });
