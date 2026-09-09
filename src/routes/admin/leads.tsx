import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getLeads, updateLeadStatus, getLeadById } from "@/lib/leads-admin.functions";
import { getCampaigns } from "@/lib/campaigns.functions";
import { getCompanies } from "@/lib/companies.functions";
import { toast } from "sonner";
import {
  Search,
  Copy,
  MessageCircle,
  Eye,
  Loader2,
  Users,
  ChevronDown,
  Phone,
  MapPin,
  CalendarDays,
  QrCode,
  MonitorPlay,
  Building2,
  X,
  ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/admin/leads")({
  component: LeadsAdminPage,
});

const STATUS_OPTIONS = [
  { value: "NOVO", label: "Novo", color: "bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/30" },
  {
    value: "CONTATO_INICIADO",
    label: "Contato iniciado",
    color: "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30",
  },
  {
    value: "EM_ATENDIMENTO",
    label: "Em atendimento",
    color: "bg-[#A78BFA]/15 text-[#A78BFA] border-[#A78BFA]/30",
  },
  {
    value: "CONVERTIDO",
    label: "Convertido",
    color: "bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30",
  },
  {
    value: "PERDIDO",
    label: "Perdido",
    color: "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30",
  },
];

const STATUS_COLOR: Record<string, string> = {
  NOVO: "bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/30",
  CONTATO_INICIADO: "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30",
  EM_ATENDIMENTO: "bg-[#A78BFA]/15 text-[#A78BFA] border-[#A78BFA]/30",
  CONVERTIDO: "bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30",
  PERDIDO: "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30",
};

function LeadsAdminPage() {
  const getLeadsFn = useServerFn(getLeads);
  const updateLeadStatusFn = useServerFn(updateLeadStatus);
  const getLeadByIdFn = useServerFn(getLeadById);
  const getCampaignsFn = useServerFn(getCampaigns);
  const getCompaniesFn = useServerFn(getCompanies);

  const [search, setSearch] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedLead, setSelectedLead] = useState<Awaited<ReturnType<typeof getLeadByIdFn>>>(null);

  const campaignsQuery = useQuery({
    queryKey: ["campaigns-filter"],
    queryFn: () => getCampaignsFn(),
  });

  const companiesQuery = useQuery({
    queryKey: ["companies-filter"],
    queryFn: () => getCompaniesFn(),
  });

  const leadsQuery = useQuery({
    queryKey: ["leads", search, campaignId, companyId, status, from, to],
    queryFn: () =>
      getLeadsFn({
        data: {
          search,
          campaignId,
          companyId,
          status:
            (status as "NOVO" | "CONTATO_INICIADO" | "EM_ATENDIMENTO" | "CONVERTIDO" | "PERDIDO") ||
            undefined,
          from,
          to,
        },
      }),
  });

  const changeStatus = async (leadId: string, newStatus: string) => {
    try {
      await updateLeadStatusFn({
        data: {
          id: leadId,
          status: newStatus as
            "NOVO" | "CONTATO_INICIADO" | "EM_ATENDIMENTO" | "CONVERTIDO" | "PERDIDO",
        },
      });
      toast.success("Status atualizado.");
      await leadsQuery.refetch();
    } catch {
      toast.error("Erro ao atualizar status.");
    }
  };

  const openDetail = async (leadId: string) => {
    try {
      const lead = await getLeadByIdFn({ data: leadId });
      setSelectedLead(lead);
    } catch {
      toast.error("Erro ao carregar detalhes do lead.");
    }
  };

  const copyWhatsapp = (w: string) => {
    navigator.clipboard.writeText(w);
    toast.success("Número copiado.");
  };

  const openConversation = (w: string) => {
    const digits = w.replace(/\D/g, "");
    window.open(`https://wa.me/55${digits}`, "_blank");
  };

  const formatDate = (d: string | Date) => {
    return new Date(d).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hasFilters = search || campaignId || companyId || status || from || to;

  const clearFilters = () => {
    setSearch("");
    setCampaignId("");
    setCompanyId("");
    setStatus("");
    setFrom("");
    setTo("");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-sora text-2xl font-bold text-white">Leads</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Acompanhe todos os leads capturados pelas telas
        </p>
      </div>

      <div className="mb-5 space-y-3 rounded-2xl border border-[#334155] bg-[#1E293B] p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou WhatsApp..."
            className="w-full rounded-xl border border-[#334155] bg-[#0F172A] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-[#64748B] focus:border-[#3B82F6]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          <select
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            className="col-span-2 rounded-xl border border-[#334155] bg-[#0F172A] px-3 py-2.5 text-sm text-white outline-none focus:border-[#3B82F6] md:col-span-1"
          >
            <option value="">Todas campanhas</option>
            {campaignsQuery.data?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="col-span-2 rounded-xl border border-[#334155] bg-[#0F172A] px-3 py-2.5 text-sm text-white outline-none focus:border-[#3B82F6] md:col-span-1"
          >
            <option value="">Todas empresas</option>
            {companiesQuery.data?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-[#334155] bg-[#0F172A] px-3 py-2.5 text-sm text-white outline-none focus:border-[#3B82F6]"
          >
            <option value="">Todos status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-xl border border-[#334155] bg-[#0F172A] px-3 py-2.5 text-sm text-white outline-none focus:border-[#3B82F6] [color-scheme:dark]"
          />
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-xl border border-[#334155] bg-[#0F172A] px-3 py-2.5 text-sm text-white outline-none focus:border-[#3B82F6] [color-scheme:dark]"
          />
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-xs font-bold text-[#94A3B8] transition-colors hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
            Limpar filtros
          </button>
        )}
      </div>

      {leadsQuery.isLoading && (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
        </div>
      )}

      {leadsQuery.isError && (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-[#EF4444]/30 bg-[#EF4444]/10 text-sm font-bold text-[#F87171]">
          Erro ao carregar leads. Verifique a conexão com o banco.
        </div>
      )}

      {leadsQuery.data && leadsQuery.data.leads.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#334155] bg-[#1E293B] py-16 text-center">
          <Users className="mb-3 h-10 w-10 text-[#64748B]" />
          <p className="text-sm font-bold text-[#94A3B8]">Nenhum lead encontrado</p>
          <p className="mt-1 max-w-sm text-xs text-[#64748B]">
            Os leads capturados via QR Code aparecerão aqui automaticamente.
          </p>
        </div>
      )}

      {leadsQuery.data && leadsQuery.data.leads.length > 0 && (
        <div className="space-y-3">
          {leadsQuery.data.leads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-2xl border border-[#334155] bg-[#1E293B] p-4 transition-all hover:border-[#3B82F6]/40"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-bold text-white">{lead.name}</p>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${STATUS_COLOR[lead.status] ?? STATUS_COLOR["NOVO"]}`}
                      >
                        {STATUS_OPTIONS.find((s) => s.value === lead.status)?.label ?? lead.status}
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#94A3B8]">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {lead.whatsapp}
                      </span>
                      {lead.campaign && (
                        <span className="flex max-w-[200px] items-center gap-1 truncate">
                          <QrCode className="h-3 w-3 shrink-0" />
                          {lead.campaign.name}
                        </span>
                      )}
                      {lead.company && (
                        <span className="flex max-w-[160px] items-center gap-1 truncate">
                          <Building2 className="h-3 w-3 shrink-0" />
                          {lead.company.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(lead.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => copyWhatsapp(lead.whatsapp)}
                    title="Copiar WhatsApp"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#334155] bg-[#0F172A] text-[#94A3B8] transition-all hover:border-[#3B82F6]/50 hover:text-white"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openConversation(lead.whatsapp)}
                    title="Abrir conversa no WhatsApp"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E] transition-all hover:bg-[#22C55E]/20"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openDetail(lead.id)}
                    title="Ver detalhes"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#334155] bg-[#0F172A] text-[#94A3B8] transition-all hover:border-[#3B82F6]/50 hover:text-white"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <select
                    value={lead.status}
                    onChange={(e) => changeStatus(lead.id, e.target.value)}
                    className="flex h-9 items-center rounded-xl border border-[#334155] bg-[#0F172A] px-2.5 text-xs font-bold text-white outline-none focus:border-[#3B82F6]"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSelectedLead(null)} />
          <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-[#334155] bg-[#1E293B] p-6 sm:rounded-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-sora text-lg font-bold text-white">Detalhes do lead</h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#334155] text-[#94A3B8] transition-all hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-white">{selectedLead.name}</p>
                  <span
                    className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${STATUS_COLOR[selectedLead.status] ?? ""}`}
                  >
                    {STATUS_OPTIONS.find((s) => s.value === selectedLead.status)?.label ??
                      selectedLead.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <DetailRow
                  icon={<Phone className="h-4 w-4" />}
                  label="WhatsApp"
                  value={selectedLead.whatsapp}
                />
                {selectedLead.email && (
                  <DetailRow
                    icon={<MessageCircle className="h-4 w-4" />}
                    label="E-mail"
                    value={selectedLead.email}
                  />
                )}
                {selectedLead.city && (
                  <DetailRow
                    icon={<MapPin className="h-4 w-4" />}
                    label="Cidade"
                    value={selectedLead.city}
                  />
                )}
                <DetailRow
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Data"
                  value={formatDate(selectedLead.createdAt)}
                />
                {selectedLead.campaign && (
                  <DetailRow
                    icon={<QrCode className="h-4 w-4" />}
                    label="Campanha"
                    value={selectedLead.campaign.name}
                  />
                )}
                {selectedLead.ad && (
                  <DetailRow
                    icon={<MonitorPlay className="h-4 w-4" />}
                    label="Anúncio"
                    value={selectedLead.ad.title}
                  />
                )}
                {selectedLead.screen && (
                  <DetailRow
                    icon={<MonitorPlay className="h-4 w-4" />}
                    label="Tela"
                    value={selectedLead.screen.name}
                  />
                )}
                {selectedLead.company && (
                  <DetailRow
                    icon={<Building2 className="h-4 w-4" />}
                    label="Empresa"
                    value={selectedLead.company.name}
                  />
                )}
                {selectedLead.source && (
                  <DetailRow
                    icon={<Search className="h-4 w-4" />}
                    label="Origem"
                    value={selectedLead.source}
                  />
                )}
                {selectedLead.utmCampaign && (
                  <DetailRow label="UTM Campaign" value={selectedLead.utmCampaign} />
                )}
                {selectedLead.ipAddress && <DetailRow label="IP" value={selectedLead.ipAddress} />}
              </div>

              <button
                onClick={() => openConversation(selectedLead.whatsapp)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#22C55E] py-3 text-sm font-bold text-[#0F172A] transition-all hover:bg-[#16A34A]"
              >
                <MessageCircle className="h-4 w-4" />
                Abrir conversa no WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-3">
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#64748B]">
        {icon}
        {label}
      </span>
      <span className="max-w-[60%] truncate text-right text-sm font-medium text-white">
        {value}
      </span>
    </div>
  );
}
