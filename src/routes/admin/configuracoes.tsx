import { createFileRoute } from "@tanstack/react-router";
import { Settings, UserCog, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin/configuracoes")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#334155] bg-[#1E293B] py-20 text-center">
      <Settings className="mb-3 h-12 w-12 text-[#64748B]" />
      <h1 className="font-sora text-xl font-bold text-white">Configurações</h1>
      <p className="mt-2 max-w-md text-sm text-[#94A3B8]">
        Em breve aqui você poderá gerenciar usuários, permissões e preferências gerais da
        plataforma.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-[#64748B]">
        <span className="flex items-center gap-1.5 rounded-xl border border-[#334155] bg-[#0F172A] px-3 py-2">
          <UserCog className="h-3.5 w-3.5" />
          Usuários e acessos
        </span>
        <span className="flex items-center gap-1.5 rounded-xl border border-[#334155] bg-[#0F172A] px-3 py-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          Segurança
        </span>
      </div>
    </div>
  );
}
