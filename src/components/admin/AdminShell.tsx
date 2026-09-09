import { Link, Outlet, useLocation, useRouter } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  MonitorPlay,
  LayoutGrid,
  Building2,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  MonitorPlay as LogoIcon,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { logout } from "@/lib/auth";
import { toast } from "sonner";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Leads", href: "/admin/leads", icon: Users },
  { name: "Campanhas", href: "/admin/campanhas", icon: Megaphone },
  { name: "Anúncios", href: "/admin/anuncios", icon: MonitorPlay },
  { name: "Telas", href: "/admin/telas", icon: LayoutGrid },
  { name: "Empresas", href: "/admin/empresas", icon: Building2 },
  { name: "Relatórios", href: "/admin/relatorios", icon: BarChart3 },
  { name: "Configurações", href: "/admin/configuracoes", icon: Settings },
];

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
  onNavigate?: (() => void) | undefined;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
        active
          ? "bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30"
          : "text-[#94A3B8] hover:bg-[#1E293B] hover:text-white border border-transparent"
      }`}
    >
      <Icon className="h-[18px] w-[18px]" />
      {item.name}
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const logoutFn = useServerFn(logout);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutFn();
      toast.success("Sessão encerrada.");
      await router.navigate({ to: "/admin/login", search: { redirect: undefined } });
    } catch {
      toast.error("Erro ao encerrar sessão.");
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#111827] border-r border-[#334155]/50">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#334155]/50">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B82F6]/15 text-[#3B82F6]">
          <LogoIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">Automatiza</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#3B82F6] font-bold">
            Mídia Indoor
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            onNavigate={onNavigate}
            active={
              item.href === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(item.href)
            }
          />
        ))}
      </nav>

      <div className="border-t border-[#334155]/50 p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#94A3B8] hover:bg-[#1E293B] hover:text-white transition-all"
        >
          <LayoutGrid className="h-[18px] w-[18px]" />
          Ver site público
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#EF4444] transition-all"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sair
        </button>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-white">
      <aside className="fixed inset-y-0 left-0 z-40 w-64 -translate-x-full transition-transform md:static md:translate-x-0 hidden md:block">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 w-64">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#334155]/50 bg-[#0F172A]/95 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#334155] text-[#94A3B8] md:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold text-[#94A3B8] hidden sm:block">
              Painel Administrativo
            </span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="md:hidden text-[#94A3B8]">
            <X className="h-5 w-5" />
          </button>
        </header>
        <main className="flex-1 p-4 md:p-6" key={location.pathname}>
          {children}
        </main>
      </div>
    </div>
  );
}
