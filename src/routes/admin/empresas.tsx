import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  getCompanies as getCompaniesServer,
  createCompany,
  updateCompany,
} from "@/lib/companies.functions";
import { toast } from "sonner";
import {
  Building2,
  Plus,
  Loader2,
  Pencil,
  X,
  Globe,
  Phone,
  Mail,
  Megaphone,
  LayoutGrid,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/admin/empresas")({
  component: CompaniesAdminPage,
});

type CompanyItem = Awaited<ReturnType<typeof getCompaniesServer>>[number];

function CompaniesAdminPage() {
  const getCompanies = useServerFn(getCompaniesServer);
  const createCompanyFn = useServerFn(createCompany);
  const updateCompanyFn = useServerFn(updateCompany);

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<CompanyItem | null>(null);
  const [saving, setSaving] = useState(false);

  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formWebsite, setFormWebsite] = useState("");
  const [formLogo, setFormLogo] = useState("");

  const companiesQuery = useQuery({
    queryKey: ["companies"],
    queryFn: () => getCompanies(),
  });

  const resetForm = () => {
    setFormName("");
    setFormPhone("");
    setFormEmail("");
    setFormWebsite("");
    setFormLogo("");
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setShowCreate(true);
  };

  const openEdit = (company: CompanyItem) => {
    setEditing(company);
    setFormName(company.name);
    setFormPhone(company.phone ?? "");
    setFormEmail(company.email ?? "");
    setFormWebsite(company.website ?? "");
    setFormLogo(company.logo ?? "");
    setShowCreate(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editing) {
        await updateCompanyFn({
          data: {
            id: editing.id,
            name: formName,
            phone: formPhone,
            email: formEmail,
            website: formWebsite,
            logo: formLogo,
          },
        });
        toast.success("Empresa atualizada.");
      } else {
        await createCompanyFn({
          data: {
            name: formName,
            phone: formPhone,
            email: formEmail,
            website: formWebsite,
            logo: formLogo,
          },
        });
        toast.success("Empresa cadastrada.");
      }
      setShowCreate(false);
      resetForm();
      await companiesQuery.refetch();
    } catch {
      toast.error("Erro ao salvar empresa.");
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
          <h1 className="font-sora text-2xl font-bold text-white">Empresas</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">Anunciantes e estabelecimentos parceiros</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#2563EB]"
        >
          <Plus className="h-4 w-4" />
          Nova empresa
        </button>
      </div>

      {companiesQuery.isLoading && (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
        </div>
      )}

      {companiesQuery.data && companiesQuery.data.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#334155] bg-[#1E293B] py-16 text-center">
          <Building2 className="mb-3 h-10 w-10 text-[#64748B]" />
          <p className="text-sm font-bold text-[#94A3B8]">Nenhuma empresa cadastrada</p>
          <p className="mt-1 text-xs text-[#64748B]">
            Cadastre uma empresa para associar campanhas e telas.
          </p>
          <button
            onClick={openCreate}
            className="mt-4 flex items-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#2563EB]"
          >
            <Plus className="h-4 w-4" />
            Cadastrar empresa
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {companiesQuery.data?.map((company) => (
          <div
            key={company.id}
            className="group flex flex-col rounded-2xl border border-[#334155] bg-[#1E293B] p-5 transition-all hover:border-[#3B82F6]/40"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-full w-full rounded-xl object-cover"
                  />
                ) : (
                  <Building2 className="h-5 w-5" />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="truncate font-sora text-base font-bold text-white">
                  {company.name}
                </h2>
                <span className="mt-0.5 inline-block rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-2 py-0.5 text-[10px] font-bold text-[#22C55E]">
                  {company.status}
                </span>
              </div>
            </div>

            <div className="mb-4 space-y-1.5 text-xs text-[#94A3B8]">
              {company.phone && (
                <p className="flex items-center gap-1.5 truncate">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                  {company.phone}
                </p>
              )}
              {company.email && (
                <p className="flex items-center gap-1.5 truncate">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                  {company.email}
                </p>
              )}
              {company.website && (
                <p className="flex items-center gap-1.5 truncate">
                  <Globe className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                  {company.website}
                </p>
              )}
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-[#334155]/60 pt-3">
              <div className="flex gap-3 text-[10px] font-bold text-[#94A3B8]">
                <span className="flex items-center gap-1">
                  <Megaphone className="h-3 w-3" />
                  {company._count?.campaigns ?? 0}
                </span>
                <span className="flex items-center gap-1">
                  <LayoutGrid className="h-3 w-3" />
                  {company._count?.screens ?? 0}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {company._count?.leads ?? 0}
                </span>
              </div>
              <button
                onClick={() => openEdit(company)}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-[#334155] bg-[#0F172A] px-2.5 py-1.5 text-xs font-bold text-[#94A3B8] transition-all hover:border-[#3B82F6]/40 hover:text-white"
              >
                <Pencil className="h-3 w-3" />
                Editar
              </button>
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
                {editing ? "Editar empresa" : "Nova empresa"}
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
                  Nome da empresa
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Padaria Modelo LTDA"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">E-mail</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="contato@empresa.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">Site</label>
                <input
                  type="text"
                  value={formWebsite}
                  onChange={(e) => setFormWebsite(e.target.value)}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
                  URL do logo
                </label>
                <input
                  type="text"
                  value={formLogo}
                  onChange={(e) => setFormLogo(e.target.value)}
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
                  "CADASTRAR EMPRESA"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
