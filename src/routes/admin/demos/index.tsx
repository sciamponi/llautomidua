import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { getDemoStats, validateDemoToken } from '@/lib/demo.functions';
import { prisma } from '@/lib/prisma.server';
import { createServerFn } from '@tanstack/react-start';
import { 
  BarChart3, 
  Users, 
  PlayCircle, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronLeft,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const getDemosForAdmin = createServerFn({ method: "GET" })
  .handler(async () => {
    if (!process.env['DATABASE_URL']) return [];
    
    return await prisma.demoAccess.findMany({
      include: {
        product: true,
        lead: true
      },
      orderBy: { createdAt: 'desc' }
    });
  });

export const Route = createFileRoute('/admin/demos/')({
  loader: async () => {
    const stats = await getDemoStats();
    const demos = await getDemosForAdmin();
    return { stats, demos };
  },
  component: AdminDemosPage,
});

function AdminDemosPage() {
  const { stats, demos } = useLoaderData({ from: '/admin/demos/' });

  return (
    <div className="min-h-screen bg-[#071A2F] text-[#DCE3EA] font-inter">
      <header className="border-b border-white/10 bg-[#071A2F]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 hover:bg-white/5 rounded-xl transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-white font-sora">Gestão de Demos</h1>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 md:py-12">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            title="Total de Solicitações" 
            value={stats.totalRequests.toString()} 
            icon={<Users className="w-6 h-6 text-[#1E8CFF]" />} 
          />
          <StatCard 
            title="Demos Liberadas" 
            value={stats.activeDemos.toString()} 
            icon={<PlayCircle className="w-6 h-6 text-green-500" />} 
          />
          <StatCard 
            title="Total Acessadas" 
            value={stats.accessedDemos.toString()} 
            icon={<BarChart3 className="w-6 h-6 text-purple-500" />} 
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#DCE3EA]/40" />
            <Input 
              placeholder="Buscar por cliente, WhatsApp ou produto..." 
              className="bg-[#071A2F] border-white/10 pl-12 h-12 rounded-xl focus:border-[#1E8CFF]/50"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/10 bg-white/5 h-12 rounded-xl gap-2">
              <Filter className="w-4 h-4" /> Filtros
            </Button>
          </div>
        </div>

        {/* Demos Table */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest bg-white/5">
                  <th className="px-6 py-4">Cliente / WhatsApp</th>
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Solicitado</th>
                  <th className="px-6 py-4">Acessos</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {demos.length > 0 ? (
                  demos.map((demo: any) => (
                    <tr key={demo.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="font-bold text-white">{demo.lead.name}</div>
                        <div className="text-xs text-[#DCE3EA]/60">{demo.lead.whatsapp}</div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant="secondary" className="bg-[#1E8CFF]/10 text-[#1E8CFF] border-[#1E8CFF]/20 font-bold uppercase text-[9px]">
                          {demo.product.name}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-xs text-[#DCE3EA]/80 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-[#1E8CFF]" />
                          {new Date(demo.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-white border-white/10">
                            {demo.accessCount}
                          </Badge>
                          {demo.lastAccessAt && (
                            <span className="text-[10px] text-[#DCE3EA]/40">
                              Último: {new Date(demo.lastAccessAt).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={demo.status} />
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="max-w-xs mx-auto text-[#DCE3EA]/40">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Nenhum acesso registrado ainda.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-2xl bg-[#071A2F] border border-white/5 shadow-xl">
          {icon}
        </div>
      </div>
      <p className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-[0.2em] mb-1">{title}</p>
      <h3 className="text-4xl font-bold text-white font-sora">{value}</h3>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'ACTIVE':
      return (
        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 font-bold gap-1.5">
          <CheckCircle2 className="w-3 h-3" /> ATIVO
        </Badge>
      );
    case 'EXPIRED':
      return (
        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold gap-1.5">
          <Clock className="w-3 h-3" /> EXPIRADO
        </Badge>
      );
    case 'REVOKED':
      return (
        <Badge className="bg-red-500/10 text-red-500 border-red-500/20 font-bold gap-1.5">
          <AlertCircle className="w-3 h-3" /> REVOGADO
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
}
