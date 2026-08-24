import { createFileRoute } from '@tanstack/react-router';
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
    <div className="bg-[#071A2F] text-[#DCE3EA] font-inter">
      <main className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold font-sora">Operação de Sites</h1>
            <p className="text-gray-400 text-sm">Gerencie o fluxo de produção e aprovação.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar empresa..." 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm w-64 outline-none focus:border-[#1E8CFF]"
              />
            </div>
            <button className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold">Filtros</button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-6 min-h-[calc(100vh-250px)]">
          {COLUMNS.map(col => (
            <div key={col.id} className="min-w-[300px] flex-shrink-0 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">{col.title}</h3>
                <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] font-bold text-gray-400">
                  {orders.filter(o => o.status === col.id).length}
                </span>
              </div>

              <div className="flex-grow bg-black/20 rounded-2xl p-3 border border-white/5 space-y-3">
                {orders.filter(o => o.status === col.id).map(order => (
                  <motion.div 
                    layoutId={order.id}
                    key={order.id}
                    className="bg-white/5 border border-white/10 p-4 rounded-xl hover:border-white/20 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm group-hover:text-[#4CDFF2] transition-all">{order.businessName}</h4>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${
                        order.priority === 'ATENÇÃO' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/10 text-gray-400'
                      }`}>
                        {order.priority}
                      </span>
                    </div>
                    
                    <div className="space-y-1 mb-4">
                      <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Nicho: <span className="text-white">{order.segment}</span></p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Template: <span className="text-white">{order.template}</span></p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-gray-500">Resp: {order.responsible}</span>
                        <span className="text-[9px] text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <select 
                        className="bg-black/40 border-none rounded text-[9px] font-bold outline-none"
                        value={order.status}
                        onChange={(e) => moveOrder(order.id, e.target.value as SiteOrderStatus)}
                      >
                        {COLUMNS.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

