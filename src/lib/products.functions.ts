import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "@/lib/prisma.server";

// Mock data as fallback for preview
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
    pricing: "297",
    status: "active",
    featured: true,
    sortOrder: 1,
    features: [
      { title: "Multi-agentes", desc: "Toda sua equipe atendendo em um único número de WhatsApp de forma organizada." },
      { title: "Funil de Vendas", desc: "Visualize em qual etapa cada cliente está e nunca perca um lead por falta de acompanhamento." }
    ]
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
    pricing: "97",
    status: "active",
    featured: true,
    sortOrder: 2,
    features: [
      { title: "Link Exclusivo", desc: "Seu cliente agenda em segundos sem precisar baixar nenhum aplicativo." }
    ]
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
    name: "Esmaltter-IA",
    slug: "esmalteria",
    type: "SAAS",
    category: "Beleza & Estética",
    segment: "Beleza",
    shortDescription: "Organize atendimento, clientes e agendamentos do seu negócio de beleza.",
    description: "O sistema inteligente desenvolvido para esmalterias, salões e clínicas de estética.",
    problem: "O operacional está travando seu salão?",
    pricingType: "SUBSCRIPTION",
    pricing: "127",
    status: "active",
    featured: true,
    sortOrder: 4
  },
  {
    id: "prod_5",
    name: "Solução Oficinas",
    slug: "oficinas",
    type: "SAAS",
    category: "Gestão Automotiva",
    segment: "Automotivo",
    shortDescription: "Organize a operação da oficina e o relacionamento com seus clientes.",
    description: "A tecnologia que transforma o pátio da sua oficina em uma linha de produção inteligente.",
    problem: "Sua oficina está perdendo peças e dinheiro?",
    pricingType: "SUBSCRIPTION",
    pricing: "197",
    status: "active",
    featured: true,
    sortOrder: 5
  },
  {
    id: "prod_6",
    name: "PetFlow",
    slug: "petflow",
    type: "SAAS",
    category: "Gestão Pet",
    segment: "Pet Shop",
    shortDescription: "O controle total para o seu Pet Shop e Banho & Tosa.",
    description: "Sistema completo de agendamento e gestão para o mercado pet.",
    problem: "Dificuldade em organizar horários de banho e tosa.",
    pricingType: "SUBSCRIPTION",
    pricing: "147",
    status: "active",
    featured: true,
    sortOrder: 6
  },
  {
    id: "prod_7",
    name: "Sites Profissionais",
    slug: "sites",
    type: "SERVICE",
    category: "Sites & Presença Digital",
    segment: "Tecnologia",
    shortDescription: "Sites profissionais e Landing Pages de alta conversão.",
    description: "Desenvolvimento de presença digital personalizada para sua marca.",
    problem: "Preciso de um site profissional para minha empresa.",
    pricingType: "ONE_TIME",
    status: "active",
    featured: true,
    sortOrder: 7
  }
];

export const getProducts = createServerFn({ method: "GET" })
  .handler(async () => {
    if (!process.env['DATABASE_URL']) return MOCK_PRODUCTS;
    try {
      const products = await prisma.product.findMany({
        where: { status: 'active' },
        orderBy: { sortOrder: 'asc' }
      });
      // Merge with MOCK or return DB if not empty
      return products.length > 0 ? JSON.parse(JSON.stringify(products)) : MOCK_PRODUCTS;
    } catch (e) {
      return MOCK_PRODUCTS;
    }
  });

export const getProductBySlug = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async ({ data }) => {
    if (!process.env['DATABASE_URL']) return MOCK_PRODUCTS.find(p => p.slug === data) || null;
    try {
      const product = await prisma.product.findUnique({
        where: { slug: data },
        include: {
          recommendations: { include: { recommendedProduct: true } }
        }
      });
      return product ? JSON.parse(JSON.stringify(product)) : MOCK_PRODUCTS.find(p => p.slug === data) || null;
    } catch (e) {
      return MOCK_PRODUCTS.find(p => p.slug === data) || null;
    }
  });
