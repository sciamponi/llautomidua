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
    pricing: "297",
    status: "active",
    featured: true,
    sortOrder: 1,
    features: [
      { title: "Multi-agentes", desc: "Toda sua equipe atendendo em um único número de WhatsApp de forma organizada." },
      { title: "Funil de Vendas", desc: "Visualize em qual etapa cada cliente está e nunca perca um lead por falta de acompanhamento." },
      { title: "Automações", desc: "Crie fluxos de mensagens automáticas para dúvidas frequentes e triagem inicial." },
      { title: "Dashboard", desc: "Saiba exatamente quem está sendo atendido, tempo de resposta e conversão." },
      { title: "API Oficial", desc: "Segurança total para sua operação com a conexão oficial da Meta." },
      { title: "CRM Integrado", desc: "Histórico completo de cada cliente acessível para toda a equipe autorizada." }
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
      { title: "Link Exclusivo", desc: "Seu cliente agenda em segundos sem precisar baixar nenhum aplicativo." },
      { title: "Lembretes", desc: "Reduza as faltas em até 80% com notificações automáticas antes do horário." },
      { title: "Gestão Financeira", desc: "Controle entradas, saídas e comissões de barbeiros de forma simplificada." },
      { title: "App Profissional", desc: "Interface otimizada para o barbeiro ver sua agenda e clientes pelo celular." },
      { title: "Controle de Estoque", desc: "Nunca fique sem os produtos essenciais da sua bancada ou revenda." },
      { title: "Marketing", desc: "Ferramentas para enviar promoções e avisos para sua base de clientes." }
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
    sortOrder: 4,
    features: [
      { title: "Agendamento Automático", desc: "Seu cliente escolhe o serviço e a profissional direto pelo WhatsApp ou link." },
      { title: "Gestão de Equipe", desc: "Organize as escalas e comissões de cada profissional de forma justa e transparente." },
      { title: "Fidelidade", desc: "Programas de pontos e promoções automatizadas para fazer sua cliente voltar sempre." },
      { title: "Controle Financeiro", desc: "Acompanhe faturamento diário, ticket médio e lucratividade em tempo real." },
      { title: "Estoque", desc: "Gestão inteligente de insumos para você nunca ficar sem o esmalte favorito." },
      { title: "Relacionamento", desc: "Envie mensagens automáticas de aniversário e pós-atendimento personalizado." }
    ]
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
    sortOrder: 5,
    features: [
      { title: "Checklist Digital", desc: "Registre avarias e necessidades do veículo direto pelo tablet ou celular." },
      { title: "Ordens de Serviço", desc: "Gestão completa do fluxo de trabalho, do mecânico ao faturamento." },
      { title: "Aprovação via Link", desc: "Envie o orçamento para o WhatsApp do cliente e receba a aprovação instantânea." },
      { title: "Histórico Veicular", desc: "Tenha toda a vida útil do veículo do seu cliente gravada para consultas futuras." },
      { title: "Gestão de Peças", desc: "Integração com fornecedores e controle rigoroso de estoque e compras." },
      { title: "Financeiro", desc: "Controle de fluxo de caixa, cartões, notas fiscais e inadimplência." }
    ]
  },
  {
    id: "prod_6",
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
    sortOrder: 6
  }
];

export const getProducts = createServerFn({ method: "GET" })
  .handler(async () => {
    return MOCK_PRODUCTS;
  });

export const getProductBySlug = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async ({ data }) => {
    return MOCK_PRODUCTS.find(p => p.slug === data) || null;
  });
