import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Globe, Clock, AlertCircle, CreditCard, ChevronRight, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { getOrdersForKanban } from '@/lib/sites-operation.functions';

export const Route = createFileRoute('/cliente/sites/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ['client-orders'],
      queryFn: () => getOrdersForKanban(),
    });
  },
  component: ClientDashboardPage,
});

function ClientDashboardPage() {
  const getOrders = useServerFn(getOrdersForKanban);
  
  const { data: orders } = useSuspenseQuery({
    queryKey: ['client-orders'],
    queryFn: () => getOrders(),
  });

  // Em um cenário real com autenticação, filtraríamos por user.id no servidor
  // Por enquanto, exibimos os pedidos ativos no banco
  
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white font-sora">Seu Painel</h1>
          <p className="text-[#DCE3EA]/60 mt-2">Gerencie seus projetos e acompanhe o progresso em tempo real.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-bold text-[#4CDFF2] uppercase tracking-[0.2em]">Seus Projetos</h2>
          
          {orders.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-12 text-center">
              <p className="text-[#DCE3EA]/40">Você ainda não possui projetos ativos.</p>
            </div>
          ) : (
            orders.map((order: any) => (
              <div 
                key={order.id}
                className="bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 hover:border-[#1E8CFF]/30 transition-all group relative overflow-hidden"
              >
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#1E8CFF]/10 flex items-center justify-center text-[#1E8CFF]">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white font-sora">{order.businessName}</h3>
                        <p className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest mt-0.5">{order.template?.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      <div className={cn(
                        "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        order.status === 'WAITING_APPROVAL' || order.paymentStatus === 'PENDING'
                          ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-500" 
                          : "bg-[#1E8CFF]/10 border border-[#1E8CFF]/20 text-[#1E8CFF]"
                      )}>
                        <Clock className="w-3 h-3" />
                        {order.status}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4 min-w-[200px]">
                    {order.paymentStatus !== 'PAID' ? (
                      <Link 
                        to="/cliente/sites/pagamento/$orderId" 
                        params={{ orderId: order.id }}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1E8CFF] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:shadow-[0_0_15px_rgba(30,140,255,0.4)] transition-all group/link"
                      >
                        Pagar Agora <CreditCard className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-widest">
                        Projeto em Produção <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          <div className="bg-gradient-to-br from-[#1E8CFF]/10 to-transparent border border-[#1E8CFF]/20 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white font-sora">Novo Projeto?</h3>
              <p className="text-sm text-[#DCE3EA]/60 mt-2">Escolha uma nova solução para o seu negócio.</p>
            </div>
            <Link 
              to="/solucoes"
              className="px-8 py-4 bg-[#1E8CFF] text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(30,140,255,0.3)] transition-all"
            >
              Explorar Catálogo
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1E8CFF]/10 flex items-center justify-center text-[#1E8CFF] mx-auto">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Suporte</h3>
              <p className="text-xs text-[#DCE3EA]/60 mt-2 leading-relaxed">Precisa de ajuda com a configuração?</p>
            </div>
            <button className="w-full py-4 border border-white/10 rounded-xl font-bold text-[10px] text-white uppercase tracking-widest hover:bg-white/5 transition-all">
              Abrir WhatsApp
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
