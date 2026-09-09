import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [users, leads, products, companies, siteOrders, screens, campaigns, courses, templates] =
    await Promise.all([
      prisma.user.count(),
      prisma.lead.count(),
      prisma.product.count(),
      prisma.company.count(),
      prisma.siteOrder.count(),
      prisma.screen.count(),
      prisma.campaign.count(),
      prisma.course.count(),
      prisma.siteTemplate.count(),
    ]);
  console.log(
    JSON.stringify(
      { users, leads, products, companies, siteOrders, screens, campaigns, courses, templates },
      null,
      2
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());