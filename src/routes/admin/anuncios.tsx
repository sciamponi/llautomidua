import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getAds as getAdsServer, createAd, updateAd } from "@/lib/ads.functions";
import { getCampaigns as getCampaignsServer } from "@/lib/campaigns.functions";
import { getScreens as getScreensServer } from "@/lib/screens.functions";
import { toast } from "sonner";
import {
  Clapperboard,
  Plus,
  Loader2,
  Pencil,
  X,
  PlayCircle,
  Image,
  Link2,
  Users,
  Timer,
  Gauge,
  Megaphone,
} from "lucide-react";

export const Route = createFileRoute("/admin/anuncios")({
  component: AdsAdminPage,
});

type AdItem = Awaited<ReturnType<typeof getAdsServer>>[number];

function AdsAdminPage() {
  const getAds = useServerFn(getAdsServer);
  const createAdFn = useServerFn(createAd);
  const updateAdFn = useServerFn(updateAd);
  const getCampaigns = useServerFn(getCampaignsServer);
  const getScreens = useServerFn(getScreensServer);

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<AdItem | null>(null);
  const [saving, setSaving] = useState(false);

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formVideo, setFormVideo] = useState("");
  const [formCta, setFormCta] = useState("");
  const [formCampaign, setFormCampaign] = useState("");
  const [formScreen, setFormScreen] = useState("");
  const [formDuration, setFormDuration] = useState("15");
  const [formPriority, setFormPriority] = useState("0");
  const [formStatus, setFormStatus] = useState("ACTIVE");

  const adsQuery = useQuery({
    queryKey: ["ads"],
    queryFn: () => getAds(),
  });

  const campaignsQuery = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => getCampaigns(),
  });

  const screensQuery = useQuery({
    queryKey: ["screens"],
    queryFn: () => getScreens(),
  });

  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormImage("");
    setFormVideo("");
    setFormCta("");
    setFormCampaign("");
    setFormScreen("");
    setFormDuration("15");
    setFormPriority("0");
    setFormStatus("ACTIVE");
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setShowCreate(true);
  };

  const openEdit = (ad: AdItem) => {
    setEditing(ad);
    setFormTitle(ad.title);
    setFormDescription(ad.description ?? "");
    setFormImage(ad.imageUrl ?? "");
    setFormVideo(ad.videoUrl ?? "");
    setFormCta(ad.ctaText ?? "");
    setFormCampaign(ad.campaignId);
    setFormScreen(ad.screenId ?? "");
    setFormDuration(String(ad.duration ?? 15));
    setFormPriority(String(ad.priority ?? 0));
    setFormStatus(ad.status);
    setShowCreate(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editing) {
        await updateAdFn({
          data: {
            id: editing.id,
            title: formTitle,
            description: formDescription,
            imageUrl: formImage,
            videoUrl: formVideo,
            ctaText: formCta,
            campaignId: formCampaign,
            screenId: formScreen,
            duration: Number(formDuration),
            priority: Number(formPriority),
            status: formStatus as "ACTIVE" | "INACTIVE",
          },
        });
        toast.success("Anúncio atualizado.");
      } else {
        await createAdFn({
          data: {
            title: formTitle,
            description: formDescription,
            imageUrl: formImage,
            videoUrl: formVideo,
            ctaText: formCta,
            campaignId: formCampaign,
            screenId: formScreen,
            duration: Number(formDuration),
            priority: Number(formPriority),
            status: formStatus as "ACTIVE" | "INACTIVE",
          },
        });
        toast.success("Anúncio criado.");
      }
      setShowCreate(false);
      resetForm();
      await adsQuery.refetch();
    } catch {
      toast.error("Erro ao salvar anúncio.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-2.5 text-sm text-white outline-none focus:border-[#3B82F6]";

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-sora text-2xl font-bold text-white">Anúncios</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">Peças publicitárias exibidas nas telas</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#2563EB]"
        >
          <Plus className="h-4 w-4" />
          Novo anúncio
        </button>
      </div>

      {adsQuery.isLoading && (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
        </div>
      )}

      {adsQuery.data && adsQuery.data.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#334155] bg-[#1E293B] py-16 text-center">
          <Clapperboard className="mb-3 h-10 w-10 text-[#64748B]" />
          <p className="text-sm font-bold text-[#94A3B8]">Nenhum anúncio cadastrado</p>
          <p className="mt-1 text-xs text-[#64748B]">
            Crie os anúncios que serão exibidos nas telas.
          </p>
          <button
            onClick={openCreate}
            className="mt-4 flex items-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#2563EB]"
          >
            <Plus className="h-4 w-4" />
            Criar anúncio
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {adsQuery.data?.map((ad) => (
          <div
            key={ad.id}
            className="group flex flex-col rounded-2xl border border-[#334155] bg-[#1E293B] p-5 transition-all hover:border-[#3B82F6]/40 sm:flex-row sm:gap-4"
          >
            <div className="mb-4 flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#0F172A] sm:mb-0 sm:w-40">
              {ad.imageUrl ? (
                <img src={ad.imageUrl} alt={ad.title} className="h-full w-full object-cover" />
              ) : ad.videoUrl ? (
                <PlayCircle className="h-10 w-10 text-[#64748B]" />
              ) : (
                <Image className="h-10 w-10 text-[#64748B]" />
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h2 className="truncate font-sora text-base font-bold text-white">{ad.title}</h2>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                    ad.status === "ACTIVE"
                      ? "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]"
                      : "border-[#64748B]/30 bg-[#64748B]/10 text-[#94A3B8]"
                  }`}
                >
                  {ad.status === "ACTIVE" ? "Ativo" : "Inativo"}
                </span>
              </div>

              <div className="mb-3 space-y-1.5 text-xs text-[#94A3B8]">
                {ad.campaign && (
                  <p className="flex items-center gap-1.5 truncate">
                    <Megaphone className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                    {ad.campaign.name}
                    {ad.campaign.company && (
                      <span className="text-[#64748B]">· {ad.campaign.company.name}</span>
                    )}
                  </p>
                )}
                {ad.description && <p className="line-clamp-2 text-[#64748B]">{ad.description}</p>}
                <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-[#334155]/60 pt-2">
                  <span className="flex items-center gap-1.5">
                    <Timer className="h-3.5 w-3.5 text-[#3B82F6]" />
                    {ad.duration ?? 15}s
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Gauge className="h-3.5 w-3.5 text-[#3B82F6]" />
                    Prioridade {ad.priority}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-[#3B82F6]" />
                    {ad._count?.leads ?? 0} leads
                  </span>
                  {ad.screen && (
                    <span className="flex items-center gap-1.5">
                      <Link2 className="h-3.5 w-3.5 text-[#3B82F6]" />
                      {ad.screen.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-auto flex justify-end">
                <button
                  onClick={() => openEdit(ad)}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-[#334155] bg-[#0F172A] px-3 py-1.5 text-xs font-bold text-[#94A3B8] transition-all hover:border-[#3B82F6]/40 hover:text-white"
                >
                  <Pencil className="h-3 w-3" />
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
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
          <div className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-[#334155] bg-[#1E293B] p-6 sm:rounded-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-sora text-lg font-bold text-white">
                {editing ? "Editar anúncio" : "Novo anúncio"}
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
                  Título do anúncio
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ex: Promoção do mês"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">Descrição</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  placeholder="Breve descrição da peça..."
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
                    Campanha
                  </label>
                  <select
                    required
                    value={formCampaign}
                    onChange={(e) => setFormCampaign(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Selecione...</option>
                    {campaignsQuery.data?.map((c) => (
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
                    className={inputClass}
                  >
                    <option value="ACTIVE">Ativo</option>
                    <option value="INACTIVE">Inativo</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
                    Tela específica
                  </label>
                  <select
                    value={formScreen}
                    onChange={(e) => setFormScreen(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Todas as telas</option>
                    {screensQuery.data?.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
                    Duração (segundos)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
                    Prioridade
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
                    CTA (texto do botão)
                  </label>
                  <input
                    type="text"
                    value={formCta}
                    onChange={(e) => setFormCta(e.target.value)}
                    placeholder="QUERO SABER MAIS"
                    className={inputClass}
                  />
                </div>
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
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
                  URL do vídeo
                </label>
                <input
                  type="text"
                  value={formVideo}
                  onChange={(e) => setFormVideo(e.target.value)}
                  placeholder="https://..."
                  className={inputClass}
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
                  "CRIAR ANÚNCIO"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
