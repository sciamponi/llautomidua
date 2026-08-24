import { createFileRoute, redirect } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { getUsers } from '@/lib/auth.functions';
import { cn } from '@/lib/utils';
import { Users, UserPlus, Shield, Building, Package, MoreHorizontal, Mail, Calendar } from 'lucide-react';

export const Route = createFileRoute('/admin/usuarios/')({
  beforeLoad: async ({ context }) => {
    const session = context.session;
    if (!session) {
      throw redirect({ to: '/login', search: { redirect: '/admin/usuarios' } });
    }
    const hasAdminRole = session.user.roles.some((r: any) => 
      ['MASTER_ADMIN', 'ADMIN'].includes(r.role)
    );
    if (!hasAdminRole) {
      throw redirect({ to: '/' });
    }
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ['admin-users'],
      queryFn: () => getUsers(),
    });
  },
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const fetchUsers = useServerFn(getUsers);
  
  const { data: users } = useSuspenseQuery({
    queryKey: ['admin-users'],
    queryFn: () => fetchUsers(),
  });

  return (
    <div className="min-h-screen bg-[#071A2F] text-[#DCE3EA] font-inter p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white font-sora">Gestão de Usuários</h1>
            <p className="text-[#DCE3EA]/60 mt-2">Gerencie acessos e permissões de todo o ecossistema.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#1E8CFF] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:shadow-[0_0_15px_rgba(30,140,255,0.4)] transition-all">
            <UserPlus className="w-4 h-4" /> Novo Usuário
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10">
            <p className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest mb-2">Total de Usuários</p>
            <p className="text-3xl font-bold text-white font-sora">{users.length}</p>
          </div>
          <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10">
            <p className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest mb-2">Admins / Master</p>
            <p className="text-3xl font-bold text-[#4CDFF2] font-sora">
              {users.filter((u: any) => u.roles.some((r: any) => ['MASTER_ADMIN', 'ADMIN'].includes(r.role))).length}
            </p>
          </div>
          <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10">
            <p className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest mb-2">Novos (30 dias)</p>
            <p className="text-3xl font-bold text-[#1E8CFF] font-sora">
              {users.filter((u: any) => {
                const date = new Date(u.createdAt);
                const now = new Date();
                return (now.getTime() - date.getTime()) < (30 * 24 * 60 * 60 * 1000);
              }).length}
            </p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-8 py-5 text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Usuário</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Papéis & Escopo</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Data Cadastro</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#1E8CFF]/10 flex items-center justify-center text-[#1E8CFF] font-bold">
                          {user.name?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-[#4CDFF2] transition-colors">{user.name}</p>
                          <p className="text-xs text-[#DCE3EA]/40">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-2">
                        {user.roles.map((r: any, idx: number) => (
                          <div 
                            key={idx}
                            className={cn(
                              "flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border",
                              r.role === 'MASTER_ADMIN' ? "bg-red-500/10 border-red-500/20 text-red-500" :
                              r.role === 'ADMIN' ? "bg-[#1E8CFF]/10 border-[#1E8CFF]/20 text-[#1E8CFF]" :
                              r.role === 'PARTNER' ? "bg-purple-500/10 border-purple-500/20 text-purple-500" :
                              "bg-white/10 border-white/10 text-[#DCE3EA]/60"
                            )}
                          >
                            <Shield className="w-3 h-3" />
                            {r.role}
                            <span className="opacity-40">•</span>
                            {r.scope}
                            {r.company && (
                              <>
                                <span className="opacity-40">•</span>
                                <Building className="w-3 h-3" />
                                {r.company.name}
                              </>
                            )}
                            {r.product && (
                              <>
                                <span className="opacity-40">•</span>
                                <Package className="w-3 h-3" />
                                {r.product.name}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs text-[#DCE3EA]/60">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button className="p-2 text-[#DCE3EA]/40 hover:text-white transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
