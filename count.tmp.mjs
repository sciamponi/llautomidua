import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const [u, s, c, cm, sg, a, l] = await Promise.all([
  p.user.count(),
  p.session.count(),
  p.company.count(),
  p.campaign.count(),
  p.screen.count(),
  p.ad.count(),
  p.lead.count(),
]);
console.log("users", u, "| sessions", s, "| companies", c, "| campaigns", cm, "| screens", sg, "| ads", a, "| leads", l);
await p.$disconnect();