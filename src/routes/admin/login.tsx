import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { login } from "@/lib/auth";
import { MonitorPlay, LockKeyhole, Mail, AlertCircle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search["redirect"] === "string" ? search["redirect"] : undefined,
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { redirect: redirectTo } = Route.useSearch();
  const navigate = useNavigate();
  const loginFn = useServerFn(login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await loginFn({ data: { email, password } });
      if (redirectTo && redirectTo.startsWith("/admin")) {
        window.location.href = redirectTo;
      } else {
        await navigate({ to: "/admin" });
      }
    } catch (err) {
      setError(
        err instanceof Error && err.message ? err.message : "Erro ao fazer login. Tente novamente.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F172A] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3B82F6]/15 text-[#3B82F6] ring-1 ring-[#3B82F6]/30">
            <MonitorPlay className="h-8 w-8" />
          </div>
          <h1 className="font-sora text-2xl font-bold text-white">
            Automatiza <span className="text-[#3B82F6]">Admin</span>
          </h1>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Acesse o painel de gerenciamento da Mídia Indoor
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-[#334155] bg-[#1E293B] p-6"
        >
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
              E-mail
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#94A3B8]" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
                className="w-full rounded-xl border border-[#334155] bg-[#0F172A] py-3 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-[#64748B] focus:border-[#3B82F6] touch-manipulation"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
              Senha
            </label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#94A3B8]" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-xl border border-[#334155] bg-[#0F172A] py-3 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-[#64748B] focus:border-[#3B82F6] touch-manipulation"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 px-3.5 py-3 text-sm text-[#F87171]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#2563EB] disabled:opacity-50 touch-manipulation"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "ENTRAR"
            )}
          </button>

          <Link
            to="/"
            className="block text-center text-sm text-[#94A3B8] transition-colors hover:text-white"
          >
            ← Voltar para o site
          </Link>
        </form>

        <p className="mt-6 text-center text-xs text-[#64748B]">
          Acesso restrito à equipe Automatiza Solução
        </p>
      </div>
    </div>
  );
}
