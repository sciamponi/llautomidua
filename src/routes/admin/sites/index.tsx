import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/sites/')({
  component: SitesKanbanPage,
});


type SiteOrderStatus = 'SUBMITTED' | 'DATA_REVIEW' | 'IN_PRODUCTION' | 'WAITING_APPROVAL' | 'CHANGES_REQUESTED' | 'APPROVED' | 'PUBLISHED' | 'CANCELLED';

const COLUMNS: { id: SiteOrderStatus; title: string }[] = [
  { id: 'SUBMITTED', title: 'NOVOS' },
  { id: 'DATA_REVIEW', title: 'EM ANÁLISE' },
  { id: 'IN_PRODUCTION', title: 'EM PRODUÇÃO' },
  { id: 'WAITING_APPROVAL', title: 'AGUARDANDO APROVAÇÃO' },
  { id: 'CHANGES_REQUESTED', title: 'AJUSTES SOLICITADOS' },
  { id: 'APPROVED', title: 'APROVADOS' },
  { id: 'PUBLISHED', title: 'PUBLICADOS' },
  { id: 'CANCELLED', title: 'CANCELADOS' },
];

function SitesKanbanPage() {
  const [orders, setOrders] = useState([
    {
      id: '1',
      businessName: 'Ar-Condicionado Central',
      segment: 'Serviços',
      template: 'Ar-Condicionado',
      responsible: 'João Silva',
      status: 'SUBMITTED' as SiteOrderStatus,
      priority: 'NORMAL',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      businessName: 'Energia Solar Max',
      segment: 'Energia',
      template: 'Energia Solar',
      responsible: 'Maria Souza',
      status: 'IN_PRODUCTION' as SiteOrderStatus,
      priority: 'ATENÇÃO',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ]);

  const moveOrder = (orderId: string, newStatus: SiteOrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    toast.success(`Pedido movido para ${newStatus}`);
  };

  return (
    <div className="bg-[#071A2F] text-[#DCE3EA] font-inter min-h-screen">
      <main className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link to="/" className="text-[#1E8CFF] hover:underline text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                ← Voltar ao site
              </Link>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-sora text-white">Operação de Sites</h1>
            <p className="text-[#DCE3EA]/60 text-sm">Gerencie o fluxo de produção e aprovação.</p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <input 
                type="text" 
                placeholder="Buscar empresa..." 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm w-full md:w-64 outline-none focus:border-[#1E8CFF] transition-all"
              />
            </div>
            <button className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold hover:bg-white/10 transition-all">Filtros</button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-6 min-h-[calc(100vh-250px)] scrollbar-thin scrollbar-thumb-white/10">
          {COLUMNS.map(col => (
            <div key={col.id} className="min-w-[300px] w-[300px] flex-shrink-0 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#DCE3EA]/40">{col.title}</h3>
                <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-[#DCE3EA]/60">
                  {orders.filter(o => o.status === col.id).length}
                </span>
              </div>

              <div className="flex-grow bg-black/20 rounded-[1.5rem] p-3 border border-white/5 space-y-3">
                {orders.filter(o => o.status === col.id).map(order => (
                  <motion.div 
                    layoutId={order.id}
                    key={order.id}
                    className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:border-[#1E8CFF]/30 transition-all cursor-pointer group relative overflow-hidden"
                  >
                    {order.priority === 'ATENÇÃO' && (
                      <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
                    )}
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-sm text-white group-hover:text-[#4CDFF2] transition-all leading-tight">{order.businessName}</h4>
                      {order.priority === 'ATENÇÃO' && (
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-500 font-black uppercase">
                          PRIORIDADE
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1.5 mb-5">
                      <div className="flex items-center justify-between text-[9px] uppercase tracking-wider">
                        <span className="text-[#DCE3EA]/40">Nicho</span>
                        <span className="text-white font-medium">{order.segment}</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] uppercase tracking-wider">
                        <span className="text-[#DCE3EA]/40">Template</span>
                        <span className="text-[#4CDFF2] font-medium">{order.template}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-[#DCE3EA]/40">Responsável</span>
                        <span className="text-[10px] text-white font-medium">{order.responsible}</span>
                      </div>
                      <select 
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[9px] font-bold text-white outline-none cursor-pointer hover:bg-white/10 transition-all"
                        value={order.status}
                        onChange={(e) => moveOrder(order.id, e.target.value as SiteOrderStatus)}
                      >
                        {COLUMNS.map(c => (
                          <option key={c.id} value={c.id} className="bg-[#071A2F]">{c.title}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                ))}
                
                {orders.filter(o => o.status === col.id).length === 0 && (
                  <div className="h-24 flex items-center justify-center border border-dashed border-white/5 rounded-2xl">
                    <span className="text-[10px] text-[#DCE3EA]/20 font-bold uppercase tracking-widest">Sem Pedidos</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}


