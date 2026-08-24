import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export interface SiteTemplate {
  id: string;
  name: string;
  slug: string;
  category: string;
  segment: string;
  description: string;
  application: string;
  previewImage?: string;
  externalUrl?: string;
  status: 'active' | 'inactive';
  featured: boolean;
  sortOrder: number;
}

const MOCK_TEMPLATES: SiteTemplate[] = [
  {
    id: "temp_1",
    name: "Ar-Condicionado",
    slug: "ar-condicionado",
    category: "CASA & SERVIÇOS",
    segment: "Negócios Locais",
    description: "Landing page para empresas de instalação, manutenção e climatização.",
    application: "Geração de lead e orçamento.",
    status: "active",
    featured: true,
    sortOrder: 1
  },
  {
    id: "temp_2",
    name: "Energia Solar",
    slug: "energia-solar",
    category: "CASA & SERVIÇOS",
    segment: "Negócios Locais",
    description: "Landing page de alta conversão para empresas de energia fotovoltaica.",
    application: "Geração de orçamento e leads qualificados.",
    status: "active",
    featured: true,
    sortOrder: 2
  },
  {
    id: "temp_3",
    name: "Reformas",
    slug: "reformas",
    category: "CASA & SERVIÇOS",
    segment: "Negócios Locais",
    description: "Landing page para empreiteiras e profissionais de reformas e construção.",
    application: "Captação de novos projetos.",
    status: "active",
    featured: false,
    sortOrder: 3
  },
  {
    id: "temp_4",
    name: "Móveis Planejados",
    slug: "moveis-planejados",
    category: "CASA & SERVIÇOS",
    segment: "Negócios Locais",
    description: "Landing page focada em design e orçamentos de móveis sob medida.",
    application: "Geração de leads qualificados.",
    status: "active",
    featured: false,
    sortOrder: 4
  },
  {
    id: "temp_5",
    name: "Estética Automotiva",
    slug: "estetica-automotiva",
    category: "AUTOMOTIVO",
    segment: "Negócios Locais",
    description: "Landing page para centros de estética e detalhamento automotivo.",
    application: "Agendamento e orçamentos.",
    status: "active",
    featured: false,
    sortOrder: 5
  },
  {
    id: "temp_6",
    name: "Arquitetura & Interiores",
    slug: "arquitetura",
    category: "PROFISSIONAIS",
    segment: "Negócios Locais",
    description: "Portfolio e landing page para arquitetos e designers de interiores.",
    application: "Portfólio e contato.",
    status: "active",
    featured: false,
    sortOrder: 6
  },
  {
    id: "temp_7",
    name: "Contabilidade",
    slug: "contabilidade",
    category: "PROFISSIONAIS",
    segment: "Negócios Locais",
    description: "Site institucional para escritórios de contabilidade e consultoria.",
    application: "Autoridade e novos clientes.",
    status: "active",
    featured: false,
    sortOrder: 7
  },
  {
    id: "temp_8",
    name: "Advocacia",
    slug: "advocacia",
    category: "PROFISSIONAIS",
    segment: "Negócios Locais",
    description: "Site para escritórios de advocacia com foco em áreas específicas.",
    application: "Consultoria e captação.",
    status: "active",
    featured: false,
    sortOrder: 8
  },
  {
    id: "temp_9",
    name: "Buffet & Eventos",
    slug: "eventos",
    category: "EVENTOS",
    segment: "Negócios Locais",
    description: "Landing page para buffets, salões de festas e organizadores.",
    application: "Orçamentos de festas.",
    status: "active",
    featured: false,
    sortOrder: 9
  },
  {
    id: "temp_10",
    name: "Fotografia",
    slug: "fotografia",
    category: "PROFISSIONAIS",
    segment: "Negócios Locais",
    description: "Portfólio visual para fotógrafos de eventos, ensaios e casamentos.",
    application: "Portfólio e agendamento.",
    status: "active",
    featured: false,
    sortOrder: 10
  }
];

export const getSiteTemplates = createServerFn({ method: "GET" })
  .handler(async () => {
    return MOCK_TEMPLATES;
  });

export const getSiteTemplateBySlug = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async ({ data }) => {
    return MOCK_TEMPLATES.find(t => t.slug === data) || null;
  });
