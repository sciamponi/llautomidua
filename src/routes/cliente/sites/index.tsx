import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { LayoutDashboard, Globe, MessageSquare, Settings, LogOut, ChevronRight, Clock, AlertCircle, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/cliente/sites/')({
  component: ClientDashboardPage,
});

function ClientDashboardPage() {
  const orders = [
    {
      id: '1',
      businessName: 'Ar-Condicionado Central',
      status: 'WAITING_APPROVAL',
      statusLabel: 'Aguardando Pagamento',
      progress: 90,
      lastUpdate: '2 horas atrás',
      slaDeadline: 'Amanhã, 14:00',
      paymentStatus: 'PENDING',
    }
  ];


  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white font-sora">Olá, João Silva</h1>
          <p className="text-[#DCE3EA]/60 mt-2">Bem-vindo ao seu painel de controle da Automatiza.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
          <Clock className="w-4 h-4 text-[#1E8CFF]" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Último Acesso: Hoje, 09:30</span>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Projects */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-bold text-[#4CDFF2] uppercase tracking-[0.2em]">Seus Projetos Ativos</h2>
          
          {orders.map((order) => (
            <div 
              key={order.id}
              className="bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 hover:border-[#1E8CFF]/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E8CFF]/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[#1E8CFF]/10 transition-all" />
              
              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#1E8CFF]/10 flex items-center justify-center text-[#1E8CFF]">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white font-sora">{order.businessName}</h3>
                      <p className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest mt-0.5">Website Profissional</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      order.status === 'WAITING_APPROVAL' 
                        ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-500" 
                        : "bg-[#1E8CFF]/10 border border-[#1E8CFF]/20 text-[#1E8CFF]"
                    )}>
                      <Clock className="w-3 h-3" />
                      {order.statusLabel}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">
                      <AlertCircle className="w-3 h-3" />
                      Prazo: {order.slaDeadline}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4 min-w-[200px]">
                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-[#DCE3EA]/40">Progresso</span>
                      <span className="text-[#1E8CFF]">{order.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${order.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-[#1E8CFF] shadow-[0_0_10px_rgba(30,140,255,0.5)]"
                      />
                    </div>
                  </div>
                  {order.status === 'WAITING_APPROVAL' ? (
                    <Link 
                      to="/cliente/sites/pagamento/$orderId" 
                      params={{ orderId: order.id }}
                      className="flex items-center gap-2 px-6 py-3 bg-[#1E8CFF] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:shadow-[0_0_15px_rgba(30,140,255,0.4)] transition-all group/link"
                    >
                      Realizar Pagamento <CreditCard className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <Link 
                      to="/cliente/sites" 
                      className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest hover:text-[#1E8CFF] transition-colors group/link"
                    >
                      Ver Detalhes <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  )}

                </div>
              </div>
            </div>
          ))}

          {/* New Service CTA */}
          <div className="bg-gradient-to-br from-[#1E8CFF]/10 to-transparent border border-[#1E8CFF]/20 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white font-sora">Precisa de mais soluções?</h3>
              <p className="text-sm text-[#DCE3EA]/60 mt-2">Explore nosso ecossistema e acelere seu crescimento digital.</p>
            </div>
            <Link 
              to="/solucoes"
              className="px-8 py-4 bg-[#1E8CFF] text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(30,140,255,0.3)] transition-all whitespace-nowrap"
            >
              Ver Todas as Soluções
            </Link>
          </div>
        </div>

        {/* Sidebar / Quick Info */}
        <div className="space-y-8">
          <section className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-6">
            <h2 className="text-xs font-bold text-[#4CDFF2] uppercase tracking-[0.2em]">Notificações</h2>
            <div className="space-y-4">
              {[
                { title: 'Site em Produção', time: '2h atrás', type: 'update' },
                { title: 'Dados Recebidos', time: '1 dia atrás', type: 'success' },
              ].map((note, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer">
                  <div className={cn(
                    "w-2 h-2 mt-1.5 rounded-full",
                    note.type === 'update' ? "bg-[#1E8CFF]" : "bg-green-500"
                  )} />
                  <div>
                    <p className="text-xs font-bold text-white">{note.title}</p>
                    <p className="text-[10px] text-[#DCE3EA]/40 mt-1 uppercase font-bold tracking-widest">{note.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1E8CFF]/10 flex items-center justify-center text-[#1E8CFF] mx-auto">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Suporte Dedicado</h3>
              <p className="text-xs text-[#DCE3EA]/60 mt-2 leading-relaxed">Dúvidas sobre o seu projeto? Fale diretamente com seu gerente de conta.</p>
            </div>
            <button className="w-full py-4 border border-white/10 rounded-xl font-bold text-[10px] text-white uppercase tracking-widest hover:bg-white/5 transition-all">
              Chamar no WhatsApp
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
