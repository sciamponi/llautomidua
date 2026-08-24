import { createFileRoute, redirect, Link } from '@tanstack/react-router';
import { getSession, logout } from '@/lib/auth.functions';
import { cn } from "@/lib/utils";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { LogOut, LayoutDashboard, Users, Package, DollarSign, Brain, ClipboardList, Globe } from "lucide-react";

export const Route = createFileRoute('/admin/')({
  beforeLoad: async ({ context }) => {
    const session = context.session;
    
    if (!session) {
      throw redirect({ to: '/login', search: { redirect: '/admin' } });
    }

    const hasAdminRole = session.user.roles.some((r: any) => 
      ['MASTER_ADMIN', 'ADMIN', 'OPERATOR'].includes(r.role)
    );

    if (!hasAdminRole) {
      throw redirect({ to: '/' });
    }
  },
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { session } = Route.useRouteContext();
  const performLogout = useServerFn(logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await performLogout();
    if (result.success) {
      navigate({ to: (result.redirect as any) || '/login' });
    }
  };

  return (
    <div className="min-h-screen bg-[#071A2F] text-[#DCE3EA] font-inter">
      <header className="border-b border-white/10 bg-[#071A2F]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white font-sora">Painel Administrativo</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
               <Link to="/" className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest hover:text-white transition-colors">Site Público</Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white">{session?.user.name}</p>
              <p className="text-[9px] text-[#DCE3EA]/40 uppercase tracking-widest">{session?.user.roles[0]?.role}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1E8CFF]/20 border border-[#1E8CFF]/30 flex items-center justify-center text-[#1E8CFF] font-bold">
                {session?.user.name?.[0]}
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard 
            title="Operação de Sites" 
            description="Gerenciamento do pipeline de produção, aprovações e pagamentos de sites."
            icon={<Globe className="w-8 h-8" />}
            to="/admin/sites"
            stats="12 Ativos"
          />
          <DashboardCard 
            title="Gestão de Usuários" 
            description="Controle de acessos, papéis (Roles) e permissões do ecossistema."
            icon={<Users className="w-8 h-8" />}
            to="/admin/usuarios"
          />

          <DashboardCard 
            title="Catálogo de Produtos" 
            description="Gerencie as soluções disponíveis, preços e configurações de recomendação."
            icon={<Package className="w-8 h-8" />}
            to="/admin/produtos"
          />
          <DashboardCard 
            title="Controle de Demos" 
            description="Monitore acessos temporários, leads de demonstração e estatísticas de uso."
            icon={<PlayCircle className="w-8 h-8 text-green-400" />}
            to="/admin/demos"
          />
          <DashboardCard 
            title="Financeiro Global" 
            description="Visão consolidada de recebimentos, assinaturas e comissões de parceiros."
            icon={<DollarSign className="w-8 h-8" />}
            to="/admin/financeiro"
            disabled
          />
          <DashboardCard 
            title="Configurações de IA" 
            description="Ajuste os prompts e motores do Cérebro Comercial e assistentes."
            icon={<Brain className="w-8 h-8" />}
            to="/admin/ia"
            disabled
          />
          <DashboardCard 
            title="Logs e Auditoria" 
            description="Rastreabilidade completa de ações realizadas no sistema."
            icon={<ClipboardList className="w-8 h-8" />}
            to="/admin/logs"
            disabled
          />
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ 
  title, 
  description, 
  icon, 
  to, 
  stats, 
  disabled 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  to: string; 
  stats?: string;
  disabled?: boolean;
}) {
  const content = (
    <div className={cn(
      "p-8 rounded-[2rem] border transition-all group flex flex-col h-full",
      disabled 
        ? "bg-white/5 border-white/5 opacity-50 cursor-not-allowed" 
        : "bg-white/5 border-white/10 hover:border-[#1E8CFF]/30 cursor-pointer"
    )}>
      <div className="mb-6 flex justify-between items-start">
        <div className="text-[#1E8CFF] group-hover:scale-110 transition-transform">
          {icon}
        </div>
        {stats && <span className="text-[10px] font-bold text-[#1E8CFF] bg-[#1E8CFF]/10 px-2 py-1 rounded-lg uppercase tracking-widest">{stats}</span>}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 font-sora group-hover:text-[#1E8CFF] transition-colors">{title}</h3>
      <p className="text-sm text-[#DCE3EA]/60 leading-relaxed flex-grow">{description}</p>
      
      {!disabled && (
        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Acessar Módulo</span>
          <span className="text-[#1E8CFF] group-hover:translate-x-1 transition-transform">→</span>
        </div>
      )}
    </div>
  );

  if (disabled) return content;
  return <Link to={to as any}>{content}</Link>;
}
