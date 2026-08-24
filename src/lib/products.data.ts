// Mock data as fallback for preview
export const MOCK_PRODUCTS = [
  {
    id: "prod_1",
    name: "Automatiza",
    slug: "automacao",
    type: "SAAS",
    category: "Atendimento & WhatsApp",
    segment: "Tecnologia",
    shortDescription: "Transforme seu WhatsApp em uma operação organizada.",
    description: "CRM e Automação para WhatsApp.",
    audience: "Empresas que atendem pelo WhatsApp e precisam de organização.",
    problem: "Tenho muitas mensagens e dificuldade para organizar.",
    solution: "Centralize tudo em um único número com múltiplos atendentes e funil de vendas.",
    howItWorks: "Conecte seu WhatsApp, crie sua equipe e comece a gerenciar atendimentos.",
    benefits: ["Multi-agentes", "Funil de Vendas", "Relatórios", "Automação"],
    pricingType: "SUBSCRIPTION",
    pricing: "297",
    status: "active",
    featured: true,
    sortOrder: 1,
    demoActive: true,
    demoDurationHours: 24,
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
    audience: "Donos de barbearia que querem automatizar agendamentos.",
    problem: "Minha operação depende de agendamentos manuais.",
    solution: "Link exclusivo para o cliente agendar em segundos.",
    howItWorks: "Cadastre seus serviços e profissionais e divulgue seu link de agendamento.",
    benefits: ["Link de Agendamento", "Gestão de Clientes", "Financeiro", "Relatórios"],
    pricingType: "SUBSCRIPTION",
    pricing: "97",
    status: "active",
    featured: true,
    sortOrder: 2,
    demoActive: true,
    demoDurationHours: 48,
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
    demoActive: false,
    sortOrder: 3
  }
];
