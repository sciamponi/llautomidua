import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDashboardStats } from "@/lib/dashboard.functions";
import {
  Users,
  CalendarClock,
  Megaphone,
  MonitorPlay,
  LayoutGrid,
  Building2,
  TrendingUp,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

const CARDS = [
  {
    key: "totalLeads",
    label: "Leads",
    description: "Total de leads capturados",
    href: "/admin/leads",
    icon: Users,
    color: "text-[#3B82F6]",
    bg: "bg-[#3B82F6]/10",
  },
  {
    key: "leadsToday",
    label: "Hoje",
    description: "Leads capturados hoje",
    href: "/admin/leads",
    icon: TrendingUp,
    color: "text-[#22C55E]",
    bg: "bg-[#22C55E]/10",
  },
  {
    key: "activeCampaigns",
    label: "Campanhas",
    description: "Campanhas ativas",
    href: "/admin/campanhas",
    icon: Megaphone,
    color: "text-[#F59E0B]",
    bg: "bg-[#F59E0B]/10",
  },
  {
    key: "activeAds",
    label: "Anúncios",
    description: "Anúncios ativos",
    href: "/admin/anuncios",
    icon: MonitorPlay,
    color: "text-[#A78BFA]",
    bg: "bg-[#A78BFA]/10",
  },
  {
    key: "totalScreens",
    label: "Telas",
    description: "Telas cadastradas",
    href: "/admin/telas",
    icon: LayoutGrid,
    color: "text-[#06B6D4]",
    bg: "bg-[#06B6D4]/10",
  },
  {
    key: "totalCompanies",
    label: "Empresas",
    description: "Anunciantes cadastrados",
    href: "/admin/empresas",
    icon: Building2,
    color: "text-[#FB7185]",
    bg: "bg-[#FB7185]/10",
  },
] as const;

function AdminDashboardPage() {
  const getStats = useServerFn(getDashboardStats);

  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => getStats(),
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-sora text-2xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">Visão geral da sua operação de Mídia Indoor</p>
        </div>
        <span className="hidden items-center gap-2 rounded-xl border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 py-2 text-xs font-bold text-[#22C55E] sm:flex">
          <CalendarClock className="h-4 w-4" />
          Tempo real
        </span>
      </div>

      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
        </div>
      )}

      {isError && (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-[#EF4444]/30 bg-[#EF4444]/10 text-center">
          <p className="text-sm font-bold text-[#F87171]">Erro ao carregar os dados do dashboard</p>
          <p className="mt-1 text-xs text-[#F87171]/70">
            Verifique se o banco de dados está configurado e conectado.
          </p>
        </div>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CARDS.map((card) => {
              const Icon = card.icon;
              const value = stats[card.key];
              return (
                <Link
                  key={card.key}
                  to={card.href}
                  className="group relative overflow-hidden rounded-2xl border border-[#334155] bg-[#1E293B] p-5 transition-all hover:-translate-y-0.5 hover:border-[#3B82F6]/50 hover:shadow-lg hover:shadow-[#3B82F6]/10"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                        {card.label}
                      </p>
                      <p className="mt-2 font-sora text-3xl font-bold text-white">{value}</p>
                    </div>
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.bg} ${card.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-[#94A3B8]">{card.description}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#3B82F6] opacity-0 transition-all group-hover:opacity-100">
                    Ver detalhes
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-[#334155] bg-[#1E293B] p-5">
            <h2 className="mb-1 font-sora text-base font-bold text-white">Fluxo da Captação</h2>
            <p className="text-sm text-[#94A3B8]">
              Tela → Anúncio → QR Code → Página de captura → Lead → CRM
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold text-[#94A3B8]">
              <span className="rounded-lg border border-[#334155] bg-[#0F172A] px-3 py-1.5">
                Tela
              </span>
              <span className="text-[#3B82F6]">→</span>
              <span className="rounded-lg border border-[#334155] bg-[#0F172A] px-3 py-1.5">
                Anúncio
              </span>
              <span className="text-[#3B82F6]">→</span>
              <span className="rounded-lg border border-[#334155] bg-[#0F172A] px-3 py-1.5">
                QR Code
              </span>
              <span className="text-[#3B82F6]">→</span>
              <span className="rounded-lg border border-[#334155] bg-[#0F172A] px-3 py-1.5">
                Captura
              </span>
              <span className="text-[#3B82F6]">→</span>
              <span className="rounded-lg border border-[#3B82F6]/40 bg-[#3B82F6]/10 text-[#3B82F6] px-3 py-1.5">
                Lead
              </span>
              <span className="text-[#3B82F6]">→</span>
              <span className="rounded-lg border border-[#334155] bg-[#0F172A] px-3 py-1.5">
                Conversão
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
