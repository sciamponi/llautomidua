import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  getCampaigns as getCampaignsServer,
  createCampaign,
  updateCampaign,
} from "@/lib/campaigns.functions";
import { getCompanies } from "@/lib/companies.functions";
import { generateQrCode } from "@/lib/qr.functions";
import { toast } from "sonner";
import {
  Megaphone,
  Plus,
  Loader2,
  QrCode,
  Pencil,
  Play,
  Pause,
  CircleStop,
  X,
  Copy,
  Send,
  CalendarDays,
  Building2,
  Link2,
} from "lucide-react";

export const Route = createFileRoute("/admin/campanhas")({
  component: CampaignsAdminPage,
});

type CampaignItem = Awaited<ReturnType<typeof getCampaignsServer>>[number];

const STATUS_META: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Rascunho", className: "bg-[#64748B]/15 text-[#94A3B8] border-[#64748B]/30" },
  ACTIVE: { label: "Ativa", className: "bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30" },
  PAUSED: { label: "Pausada", className: "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30" },
  ENDED: { label: "Encerrada", className: "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30" },
};

function CampaignsAdminPage() {
  const getCampaigns = useServerFn(getCampaignsServer);
  const createCampaignFn = useServerFn(createCampaign);
  const updateCampaignFn = useServerFn(updateCampaign);
  const getCompaniesFn = useServerFn(getCompanies);
  const generateQrFn = useServerFn(generateQrCode);

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<CampaignItem | null>(null);
  const [qrCampaign, setQrCampaign] = useState<CampaignItem | null>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState("");
  const [loadingQr, setLoadingQr] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formStatus, setFormStatus] = useState("DRAFT");
  const [formCta, setFormCta] = useState("QUERO SABER MAIS");
  const [formDescription, setFormDescription] = useState("");
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");
  const [formImage, setFormImage] = useState("");
  const [saving, setSaving] = useState(false);

  const campaignsQuery = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => getCampaigns(),
  });

  const companiesQuery = useQuery({
    queryKey: ["companies"],
    queryFn: () => getCompaniesFn(),
  });

  const resetForm = () => {
    setFormName("");
    setFormCompany("");
    setFormStatus("DRAFT");
    setFormCta("QUERO SABER MAIS");
    setFormDescription("");
    setFormStart("");
    setFormEnd("");
    setFormImage("");
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setShowCreate(true);
  };

  const openEdit = (campaign: CampaignItem) => {
    setEditing(campaign);
    setFormName(campaign.name);
    setFormCompany(campaign.companyId);
    setFormStatus(campaign.status);
    setFormCta(campaign.ctaText ?? "");
    setFormDescription(campaign.description ?? "");
    setFormStart(campaign.startDate ? new Date(campaign.startDate).toISOString().slice(0, 10) : "");
    setFormEnd(campaign.endDate ? new Date(campaign.endDate).toISOString().slice(0, 10) : "");
    setFormImage(campaign.imageUrl ?? "");
    setShowCreate(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editing) {
        await updateCampaignFn({
          data: {
            id: editing.id,
            name: formName,
            companyId: formCompany,
            status: formStatus as "DRAFT" | "ACTIVE" | "PAUSED" | "ENDED",
            ctaText: formCta,
            description: formDescription,
            startDate: formStart,
            endDate: formEnd,
            imageUrl: formImage,
          },
        });
        toast.success("Campanha atualizada.");
      } else {
        await createCampaignFn({
          data: {
            name: formName,
            companyId: formCompany,
            status: formStatus as "DRAFT" | "ACTIVE" | "PAUSED" | "ENDED",
            ctaText: formCta,
            description: formDescription,
            startDate: formStart,
            endDate: formEnd,
            imageUrl: formImage,
          },
        });
        toast.success("Campanha criada.");
      }
      setShowCreate(false);
      resetForm();
      await campaignsQuery.refetch();
    } catch {
      toast.error("Erro ao salvar campanha.");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (campaign: CampaignItem, newStatus: string) => {
    try {
      await updateCampaignFn({
        data: {
          id: campaign.id,
          status: newStatus as "DRAFT" | "ACTIVE" | "PAUSED" | "ENDED",
        },
      });
      toast.success(
        `Campanha ${newStatus === "ACTIVE" ? "ativada" : newStatus === "PAUSED" ? "pausada" : newStatus === "ENDED" ? "encerrada" : "marcada como rascunho"}.`,
      );
      await campaignsQuery.refetch();
    } catch {
      toast.error("Erro ao alterar status.");
    }
  };

  const openQr = async (campaign: CampaignItem) => {
    setQrCampaign(campaign);
    setQrImage(null);
    setQrUrl("");
    setLoadingQr(true);
    try {
      const result = await generateQrFn({ data: campaign.id });
      setQrImage(result.qrDataUrl);
      setQrUrl(result.captureUrl);
    } catch {
      toast.error("Erro ao gerar QR Code.");
    } finally {
      setLoadingQr(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(qrUrl);
    toast.success("Link de captura copiado.");
  };

  const formatDate = (d: string | Date | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("pt-BR");
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-sora text-2xl font-bold text-white">Campanhas</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Crie e gerencie as campanhas da Mídia Indoor
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#2563EB]"
        >
          <Plus className="h-4 w-4" />
          Nova campanha
        </button>
      </div>

      {campaignsQuery.isLoading && (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
        </div>
      )}

      {campaignsQuery.data && campaignsQuery.data.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#334155] bg-[#1E293B] py-16 text-center">
          <Megaphone className="mb-3 h-10 w-10 text-[#64748B]" />
          <p className="text-sm font-bold text-[#94A3B8]">Nenhuma campanha cadastrada</p>
          <p className="mt-1 text-xs text-[#64748B]">
            Crie sua primeira campanha para começar a captar leads.
          </p>
          <button
            onClick={openCreate}
            className="mt-4 flex items-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#2563EB]"
          >
            <Plus className="h-4 w-4" />
            Criar campanha
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {campaignsQuery.data?.map((campaign) => {
          const meta =
            STATUS_META[campaign.status] ??
            ({
              label: "Rascunho",
              className: "bg-[#64748B]/15 text-[#94A3B8] border-[#64748B]/30",
            } as const);
          return (
            <div
              key={campaign.id}
              className="group flex flex-col rounded-2xl border border-[#334155] bg-[#1E293B] p-5 transition-all hover:border-[#3B82F6]/40"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
                      <Megaphone className="h-4 w-4" />
                    </div>
                    <h2 className="truncate font-sora text-base font-bold text-white">
                      {campaign.name}
                    </h2>
                  </div>
                  <span
                    className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${meta.className}`}
                  >
                    {meta.label}
                  </span>
                </div>
              </div>

              <div className="mb-4 space-y-2 text-xs text-[#94A3B8]">
                {campaign.company && (
                  <p className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                    {campaign.company.name}
                  </p>
                )}
                <p className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                  {formatDate(campaign.startDate)} → {formatDate(campaign.endDate)}
                </p>
                {campaign.description && (
                  <p className="line-clamp-2 text-[#64748B]">{campaign.description}</p>
                )}
                <p className="flex items-center justify-between border-t border-[#334155]/60 pt-2">
                  <span className="flex items-center gap-1.5">
                    <Link2 className="h-3.5 w-3.5 text-[#3B82F6]" />
                    Leads: {campaign._count?.leads ?? 0}
                  </span>
                  <span>Anúncios: {campaign._count?.ads ?? 0}</span>
                </p>
              </div>

              <div className="mt-auto flex flex-wrap gap-2">
                <button
                  onClick={() => openQr(campaign)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#3B82F6]/40 bg-[#3B82F6]/10 py-2 text-xs font-bold text-[#3B82F6] transition-all hover:bg-[#3B82F6]/20"
                >
                  <QrCode className="h-3.5 w-3.5" />
                  QR Code
                </button>
                <button
                  onClick={() => openEdit(campaign)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-[#334155] bg-[#0F172A] px-3 py-2 text-xs font-bold text-[#94A3B8] transition-all hover:border-[#3B82F6]/40 hover:text-white"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </button>
                {campaign.status === "ACTIVE" ? (
                  <button
                    onClick={() => changeStatus(campaign, "PAUSED")}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#F59E0B]/40 bg-[#F59E0B]/10 px-3 py-2 text-xs font-bold text-[#F59E0B] transition-all hover:bg-[#F59E0B]/20"
                  >
                    <Pause className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => changeStatus(campaign, "ACTIVE")}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#22C55E]/40 bg-[#22C55E]/10 px-3 py-2 text-xs font-bold text-[#22C55E] transition-all hover:bg-[#22C55E]/20"
                  >
                    <Play className="h-3.5 w-3.5" />
                  </button>
                )}
                {campaign.status !== "ENDED" && (
                  <button
                    onClick={() => changeStatus(campaign, "ENDED")}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 px-3 py-2 text-xs font-bold text-[#EF4444] transition-all hover:bg-[#EF4444]/20"
                  >
                    <CircleStop className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => {
              setShowCreate(false);
              resetForm();
            }}
          />
          <div className="relative z-10 max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-[#334155] bg-[#1E293B] p-6 sm:rounded-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-sora text-lg font-bold text-white">
                {editing ? "Editar campanha" : "Nova campanha"}
              </h2>
              <button
                onClick={() => {
                  setShowCreate(false);
                  resetForm();
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#334155] text-[#94A3B8] transition-all hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
                  Nome da campanha
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Lançamento do produto X"
                  className="w-full rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-3 text-sm text-white outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
                    Empresa / Anunciante
                  </label>
                  <select
                    required
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="w-full rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-3 text-sm text-white outline-none focus:border-[#3B82F6]"
                  >
                    <option value="">Selecione...</option>
                    {companiesQuery.data?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-3 text-sm text-white outline-none focus:border-[#3B82F6]"
                  >
                    <option value="DRAFT">Rascunho</option>
                    <option value="ACTIVE">Ativa</option>
                    <option value="PAUSED">Pausada</option>
                    <option value="ENDED">Encerrada</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">Início</label>
                  <input
                    type="date"
                    value={formStart}
                    onChange={(e) => setFormStart(e.target.value)}
                    className="w-full rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-3 text-sm text-white outline-none focus:border-[#3B82F6] [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">Fim</label>
                  <input
                    type="date"
                    value={formEnd}
                    onChange={(e) => setFormEnd(e.target.value)}
                    className="w-full rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-3 text-sm text-white outline-none focus:border-[#3B82F6] [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
                  CTA (chamada do anúncio)
                </label>
                <input
                  type="text"
                  value={formCta}
                  onChange={(e) => setFormCta(e.target.value)}
                  placeholder="QUERO SABER MAIS"
                  className="w-full rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-3 text-sm text-white outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">Descrição</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  placeholder="Descreva a campanha..."
                  className="w-full rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-3 text-sm text-white outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
                  URL da imagem
                </label>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-3 text-sm text-white outline-none focus:border-[#3B82F6]"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#2563EB] disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : editing ? (
                  "SALVAR ALTERAÇÕES"
                ) : (
                  "CRIAR CAMPANHA"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {qrCampaign && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setQrCampaign(null)} />
          <div className="relative z-10 w-full max-w-sm rounded-t-2xl border border-[#334155] bg-[#1E293B] p-6 text-center sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-sora text-lg font-bold text-white">QR Code da campanha</h2>
              <button
                onClick={() => setQrCampaign(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#334155] text-[#94A3B8] transition-all hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {loadingQr && (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
              </div>
            )}

            {qrImage && !loadingQr && (
              <>
                <p className="mb-4 truncate text-sm font-bold text-white">{qrCampaign.name}</p>
                <div className="mx-auto w-fit rounded-2xl border border-white/10 bg-white p-3">
                  <img
                    src={qrImage}
                    alt={`QR Code para a campanha ${qrCampaign.name}`}
                    className="h-56 w-56"
                  />
                </div>
                <p className="mt-4 text-xs leading-relaxed text-[#94A3B8]">
                  Apontem a câmera para o QR Code para abrir a página de captação desta campanha.
                </p>
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#334155] bg-[#0F172A] px-3 py-2">
                  <span className="min-w-0 flex-1 truncate text-left text-xs text-[#94A3B8]">
                    {qrUrl}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={copyUrl}
                      title="Copiar link"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#334155] text-[#94A3B8] transition-all hover:text-white"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <a
                      href={qrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Abrir página"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#3B82F6]/40 bg-[#3B82F6]/10 text-[#3B82F6] transition-all hover:bg-[#3B82F6]/20"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => window.print()}
                  className="mt-3 w-full rounded-xl bg-[#3B82F6] py-2.5 text-sm font-bold text-white transition-all hover:bg-[#2563EB]"
                >
                  IMPRIMIR QR CODE
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
