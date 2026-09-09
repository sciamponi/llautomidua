import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const DEPS = ["Campanha Teste E2E%", "Campanha Teste E2E"];
const likeName = (p) => ({ OR: [{ name: { contains: p } }] });

const campaigns = await prisma.campaign.findMany({
  where: { name: { contains: "Campanha Teste E2E" } },
});
const campaignIds = campaigns.map((c) => c.id);
const ads = await prisma.ad.findMany({
  where: {
    OR: [{ title: { contains: "Anúncio Teste E2E" } }, { campaignId: { in: campaignIds } }],
  },
});
const screens = await prisma.screen.findMany({
  where: { name: { contains: "Tela Teste E2E" } },
});
const leads = await prisma.lead.findMany({
  where: {
    OR: [
      { name: { contains: "Teste" } },
      { campaignId: { in: campaignIds } },
      { adId: { in: ads.map((a) => a.id) } },
      { screenId: { in: screens.map((s) => s.id) } },
    ],
  },
});
const companies = await prisma.company.findMany({
  where: { name: { contains: "Empresa Teste E2E" } },
});

const r = await prisma.$transaction(async (tx) => {
  const dl = await tx.lead.deleteMany({ where: { id: { in: leads.map((l) => l.id) } } });
  const da = await tx.ad.deleteMany({ where: { id: { in: ads.map((a) => a.id) } } });
  const ds = await tx.screen.deleteMany({ where: { id: { in: screens.map((s) => s.id) } } });
  const dc = await tx.campaign.deleteMany({ where: { id: { in: campaignIds } } });
  const dco = await tx.company.deleteMany({ where: { id: { in: companies.map((c) => c.id) } } });
  const dse = await tx.session.deleteMany({});
  return { dl: dl.count, da: da.count, ds: ds.count, dc: dc.count, dco: dco.count, dse: dse.count };
});

console.log("removidos:", JSON.stringify(r));

const [users, sessions, companies2, campaigns2, screens2, ads2, leads2, siteOrders, products, courses, templates] =
  await Promise.all([
    prisma.user.count(),
    prisma.session.count(),
    prisma.company.count(),
    prisma.campaign.count(),
    prisma.screen.count(),
    prisma.ad.count(),
    prisma.lead.count(),
    prisma.siteOrder.count(),
    prisma.product.count(),
    prisma.course.count(),
    prisma.template.count(),
  ]);
console.log(
  "estado final -> users:", users,
  "| sessions:", sessions,
  "| companies:", companies2,
  "| campaigns:", campaigns2,
  "| screens:", screens2,
  "| ads:", ads2,
  "| leads:", leads2,
  "| siteOrders:", siteOrders,
  "| products:", products,
  "| courses:", courses,
  "| templates:", templates,
);
await prisma.$disconnect();