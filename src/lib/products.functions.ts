import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Mock data as specified in VOIDPRO-9 for immediate availability
const MOCK_PRODUCTS = [
  {
    id: "prod_1",
    name: "Automatiza",
    slug: "automacao",
    type: "SAAS",
    category: "Atendimento & WhatsApp",
    segment: "Tecnologia",
    shortDescription: "Transforme seu WhatsApp em uma operação organizada.",
    description: "CRM e Automação para WhatsApp.",
    problem: "Tenho muitas mensagens e dificuldade para organizar.",
    pricingType: "SUBSCRIPTION",
    pricing: "49",
    status: "active",
    featured: true,
    sortOrder: 1
  },
  {
    id: "prod_2",
    name: "BarberIA",
    slug: "barberia",
    type: "SAAS",
    category: "Agendamento & Gestão",
    segment: "Beleza",
    shortDescription: "Agendamento inteligente para barbearias.",
    description: "Gestão completa para o setor de beleza.",
    problem: "Minha operação depende de agendamentos manuais.",
    pricingType: "SUBSCRIPTION",
    pricing: "147",
    status: "active",
    featured: true,
    sortOrder: 2
  },
  {
    id: "prod_3",
    name: "Media Indoor",
    slug: "media-indoor",
    type: "MEDIA",
    category: "Media Indoor",
    segment: "Publicidade",
    shortDescription: "Sua marca em pontos estratégicos.",
    description: "Rede de telas digitais para publicidade e entretenimento.",
    problem: "Quero criar novas oportunidades comerciais com mídia.",
    pricingType: "MEDIA",
    status: "active",
    featured: true,
    sortOrder: 3
  },
  {
    id: "prod_4",
    name: "PetFlow",
    slug: "petflow",
    type: "SOLUTION",
    category: "Pet",
    segment: "Pet",
    shortDescription: "Gestão e atendimento para Pet Shops.",
    description: "Solução pensada para pet shops e banho e tosa.",
    problem: "Organize o atendimento do seu negócio pet.",
    pricingType: "RECURRING_SERVICE",
    status: "active",
    featured: true,
    sortOrder: 4
  },
  {
    id: "prod_5",
    name: "Sites",
    slug: "sites",
    type: "SERVICE",
    category: "Sites & Presença Digital",
    segment: "Tecnologia",
    shortDescription: "Sites profissionais e Landing Pages.",
    description: "Desenvolvimento de presença digital de alta conversão.",
    problem: "Preciso de um site profissional para minha empresa.",
    pricingType: "ONE_TIME",
    status: "active",
    featured: true,
    sortOrder: 5
  }
];

export const getProducts = createServerFn({ method: "GET" })
  .handler(async () => {
    // In production, this would be: return await prisma.product.findMany({ where: { status: 'active' }, orderBy: { sortOrder: 'asc' } });
    return MOCK_PRODUCTS;
  });

export const getProductBySlug = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async ({ data }) => {
    return MOCK_PRODUCTS.find(p => p.slug === data) || null;
  });
