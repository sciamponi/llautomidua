import { createServerFn } from "@tanstack/react-start";
import { prisma } from "./prisma.server";
import { getAdminUserInternal } from "./auth";

export const getDashboardStats = createServerFn({ method: "GET" }).handler(async () => {
  const admin = await getAdminUserInternal();
  if (!admin) {
    throw new Error("Não autorizado");
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [totalLeads, leadsToday, activeCampaigns, activeAds, totalScreens, totalCompanies] =
    await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.campaign.count({ where: { status: "ACTIVE" } }),
      prisma.ad.count({ where: { status: "ACTIVE" } }),
      prisma.screen.count(),
      prisma.company.count(),
    ]);

  return {
    totalLeads,
    leadsToday,
    activeCampaigns,
    activeAds,
    totalScreens,
    totalCompanies,
  };
});
