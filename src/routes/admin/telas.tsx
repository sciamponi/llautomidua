import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  getScreens as getScreensServer,
  createScreen,
  updateScreen,
} from "@/lib/screens.functions";
import { getCampaigns as getCampaignsServer } from "@/lib/campaigns.functions";
import { toast } from "sonner";
import {
  LayoutGrid,
  Plus,
  Loader2,
  Pencil,
  X,
  MapPin,
  Store,
  Hash,
  Users,
  MonitorPlay,
  Activity,
} from "lucide-react";

export const Route = createFileRoute("/admin/telas")({
  component: ScreensAdminPage,
});

type ScreenItem = Awaited<ReturnType<typeof getScreensServer>>[number];

const STATUS_META: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Ativa", className: "bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30" },
  INACTIVE: { label: "Inativa", className: "bg-[#64748B]/15 text-[#94A3B8] border-[#64748B]/30" },
  MAINTENANCE: {
    label: "Manutenção",
    className: "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30",
  },
};

function ScreensAdminPage() {
  const getScreens = useServerFn(getScreensServer);
  const createScreenFn = useServerFn(createScreen);
  const updateScreenFn = useServerFn(updateScreen);
  const getCampaigns = useServerFn(getCampaignsServer);

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<ScreenItem | null>(null);
  const [saving, setSaving] = useState(false);

  const [formName, setFormName] = useState("");
  const [formIdentifier, setFormIdentifier] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formEstablishment, setFormEstablishment] = useState("");
  const [formStatus, setFormStatus] = useState("ACTIVE");
  const [formCampaign, setFormCampaign] = useState("");

  const screensQuery = useQuery({
    queryKey: ["screens"],
    queryFn: () => getScreens(),
  });

  const campaignsQuery = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => getCampaigns(),
  });

  const resetForm = () => {
    setFormName("");
    setFormIdentifier("");
    setFormLocation("");
    setFormEstablishment("");
    setFormStatus("ACTIVE");
    setFormCampaign("");
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setShowCreate(true);
  };

  const openEdit = (screen: ScreenItem) => {
    setEditing(screen);
    setFormName(screen.name);
    setFormIdentifier(screen.identifier);
    setFormLocation(screen.location ?? "");
    setFormEstablishment(screen.establishment ?? "");
    setFormStatus(screen.status);
    setFormCampaign(screen.currentCampaignId ?? "");
    setShowCreate(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editing) {
        await updateScreenFn({
          data: {
            id: editing.id,
            name: formName,
            identifier: formIdentifier,
            location: formLocation,
            establishment: formEstablishment,
            status: formStatus as "ACTIVE" | "INACTIVE" | "MAINTENANCE",
            currentCampaignId: formCampaign,
          },
        });
        toast.success("Tela atualizada.");
      } else {
        await createScreenFn({
          data: {
            name: formName,
            identifier: formIdentifier,
            location: formLocation,
            establishment: formEstablishment,
            status: formStatus as "ACTIVE" | "INACTIVE" | "MAINTENANCE",
            currentCampaignId: formCampaign,
          },
        });
        toast.success("Tela cadastrada.");
      }
      setShowCreate(false);
      resetForm();
      await screensQuery.refetch();
    } catch {
      toast.error("Erro ao salvar tela. Verifique se o identificador é único.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-2.5 text-sm text-white outline-none focus:border-[#3B82F6]";

  const formatLastActive = (d: string | Date | null) => {
    if (!d) return "Nunca";
    const diff = Date.now() - new Date(d).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Agora";
    if (minutes < 60) return `há ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours} h`;
    const days = Math.floor(hours / 24);
    return `há ${days} dias`;
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-sora text-2xl font-bold text-white">Telas</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">Estabelecimentos com telas instaladas</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#2563EB]"
        >
          <Plus className="h-4 w-4" />
          Nova tela
        </button>
      </div>

      {screensQuery.isLoading && (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
        </div>
      )}

      {screensQuery.data && screensQuery.data.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#334155] bg-[#1E293B] py-16 text-center">
          <LayoutGrid className="mb-3 h-10 w-10 text-[#64748B]" />
          <p className="text-sm font-bold text-[#94A3B8]">Nenhuma tela cadastrada</p>
          <p className="mt-1 text-xs text-[#64748B]">
            Cadastre as telas instaladas para rastrear de onde vêm os leads.
          </p>
          <button
            onClick={openCreate}
            className="mt-4 flex items-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#2563EB]"
          >
            <Plus className="h-4 w-4" />
            Cadastrar tela
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {screensQuery.data?.map((screen) => {
          const meta =
            STATUS_META[screen.status] ??
            ({
              label: "Inativa",
              className: "bg-[#64748B]/15 text-[#94A3B8] border-[#64748B]/30",
            } as const);
          return (
            <div
              key={screen.id}
              className="group flex flex-col rounded-2xl border border-[#334155] bg-[#1E293B] p-5 transition-all hover:border-[#3B82F6]/40"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
                    <LayoutGrid className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate font-sora text-base font-bold text-white">
                      {screen.name}
                    </h2>
                    <span
                      className={`mt-1 inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${meta.className}`}
                    >
                      {meta.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4 space-y-2 text-xs text-[#94A3B8]">
                <p className="flex items-center gap-1.5 truncate">
                  <Hash className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                  <span className="font-bold text-white">{screen.identifier}</span>
                </p>
                {screen.establishment && (
                  <p className="flex items-center gap-1.5 truncate">
                    <Store className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                    {screen.establishment}
                  </p>
                )}
                {screen.location && (
                  <p className="flex items-center gap-1.5 truncate">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                    {screen.location}
                  </p>
                )}
                {screen.currentCampaign && (
                  <p className="flex items-center gap-1.5 truncate">
                    <MonitorPlay className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                    <span className="truncate">{screen.currentCampaign.name}</span>
                  </p>
                )}
                <p className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                  Última atividade: {formatLastActive(screen.lastActiveAt)}
                </p>
                <p className="flex items-center gap-1.5 border-t border-[#334155]/60 pt-2">
                  <Users className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                  Leads gerados: {screen._count?.leads ?? 0}
                </p>
              </div>

              <div className="mt-auto flex justify-end">
                <button
                  onClick={() => openEdit(screen)}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-[#334155] bg-[#0F172A] px-3 py-1.5 text-xs font-bold text-[#94A3B8] transition-all hover:border-[#3B82F6]/40 hover:text-white"
                >
                  <Pencil className="h-3 w-3" />
                  Editar
                </button>
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
          <div className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-[#334155] bg-[#1E293B] p-6 sm:rounded-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-sora text-lg font-bold text-white">
                {editing ? "Editar tela" : "Nova tela"}
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
                  Nome da tela
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Tela 1 - Loja Central"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
                  Identificador único
                </label>
                <input
                  type="text"
                  required
                  value={formIdentifier}
                  onChange={(e) =>
                    setFormIdentifier(
                      e.target.value
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, ""),
                    )
                  }
                  placeholder="tela-01"
                  className={inputClass}
                />
                <p className="mt-1 text-[10px] text-[#64748B]">
                  Será usado nos links de captura para rastrear a origem.
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
                  Estabelecimento
                </label>
                <input
                  type="text"
                  value={formEstablishment}
                  onChange={(e) => setFormEstablishment(e.target.value)}
                  placeholder="Ex: Barbearia Corte Certo"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
                  Localização
                </label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="Ex: Centro, São Paulo/SP"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className={inputClass}
                  >
                    <option value="ACTIVE">Ativa</option>
                    <option value="INACTIVE">Inativa</option>
                    <option value="MAINTENANCE">Manutenção</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
                    Campanha atual
                  </label>
                  <select
                    value={formCampaign}
                    onChange={(e) => setFormCampaign(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Nenhuma</option>
                    {campaignsQuery.data?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
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
                  "CADASTRAR TELA"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
