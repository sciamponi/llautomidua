import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { OrderModal } from '@/components/admin/sites/OrderModal';
import { getOrdersForKanban, updateOrderStatus } from '@/lib/sites-operation.functions';
import type { SiteOrderStatus } from '@/lib/sites-operation.functions';

export const Route = createFileRoute('/admin/sites/')({
  component: SitesKanbanPage,
});

const COLUMNS: { id: SiteOrderStatus; title: string }[] = [
  { id: 'SUBMITTED', title: 'NOVOS' },
  { id: 'DATA_REVIEW', title: 'EM ANÁLISE' },
  { id: 'IN_PRODUCTION', title: 'EM PRODUÇÃO' },
  { id: 'WAITING_APPROVAL', title: 'AGUARDANDO APROVAÇÃO' },
  { id: 'CHANGES_REQUESTED', title: 'AJUSTES SOLICITADOS' },
  { id: 'APPROVED', title: 'APROVADOS (PAGAMENTO)' },
  { id: 'PUBLISHED', title: 'PUBLICADOS' },
  { id: 'CANCELLED', title: 'CANCELADOS' },
];

function SitesKanbanPage() {
  const queryClient = useQueryClient();
  const getOrders = useServerFn(getOrdersForKanban);
  const updateStatus = useServerFn(updateOrderStatus);
  
  const { data: orders } = useSuspenseQuery({
    queryKey: ['orders-kanban'],
    queryFn: () => getOrders(),
  });

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showValues, setShowValues] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const mutation = useMutation({
    mutationFn: (vars: { orderId: string, status: SiteOrderStatus }) => 
      updateStatus({ data: { orderId: vars.orderId, status: vars.status } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders-kanban'] });
      toast.success('Status atualizado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar status');
    }
  });

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    const term = searchTerm.toLowerCase();
    return orders.filter((o: any) => 
      o.businessName?.toLowerCase().includes(term) || 
      o.template?.name?.toLowerCase().includes(term) ||
      o.user?.name?.toLowerCase().includes(term)
    );
  }, [orders, searchTerm]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pipeline = orders.reduce((acc: number, o: any) => acc + (Number(o.price) || 0), 0);
    const pending = orders
      .filter((o: any) => o.paymentStatus !== 'PAID')
      .reduce((acc: number, o: any) => acc + (Number(o.price) || 0), 0);
    const paid = orders
      .filter((o: any) => o.paymentStatus === 'PAID')
      .reduce((acc: number, o: any) => acc + (Number(o.price) || 0), 0);
    
    return { total, pipeline, pending, paid };
  }, [orders]);

  const selectedOrder = useMemo(() => 
    orders.find((o: any) => o.id === selectedOrderId), 
  [orders, selectedOrderId]);

  return (
    <div className="bg-[#071A2F] text-[#DCE3EA] font-inter min-h-screen">
      <OrderModal 
        order={selectedOrder} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <main className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link to="/" className="text-[#1E8CFF] hover:underline text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                ← Voltar ao site
              </Link>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-sora text-white">Operação de Sites</h1>
            <p className="text-[#DCE3EA]/60 text-sm">Gerencie o fluxo de produção e aprovação real-time.</p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <input 
                type="text" 
                placeholder="Buscar empresa ou cliente..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm w-full md:w-64 outline-none focus:border-[#1E8CFF] transition-all"
              />
            </div>
            <button 
              onClick={() => setShowValues(!showValues)}
              className="bg-[#1E8CFF]/10 border border-[#1E8CFF]/20 text-[#1E8CFF] rounded-xl px-4 py-2.5 text-sm font-bold hover:bg-[#1E8CFF]/20 transition-all"
            >
              {showValues ? 'Ocultar Valores' : 'Mostrar Valores'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <span className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Total Projetos</span>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <span className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Pipeline Total</span>
            <p className="text-2xl font-bold text-[#4CDFF2] mt-1">
              {showValues ? `R$ ${stats.pipeline.toLocaleString('pt-BR')}` : 'R$ ••••'}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <span className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Pendente</span>
            <p className="text-2xl font-bold text-yellow-500 mt-1">
              {showValues ? `R$ ${stats.pending.toLocaleString('pt-BR')}` : 'R$ ••••'}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <span className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Pago</span>
            <p className="text-2xl font-bold text-green-500 mt-1">
              {showValues ? `R$ ${stats.paid.toLocaleString('pt-BR')}` : 'R$ ••••'}
            </p>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-6 min-h-[calc(100vh-250px)] scrollbar-thin scrollbar-thumb-white/10">
          {COLUMNS.map(col => {
            const columnOrders = filteredOrders.filter((o: any) => o.status === col.id);
            const columnTotal = columnOrders.reduce((acc: number, o: any) => acc + (Number(o.price) || 0), 0);
            
            return (
              <div key={col.id} className="min-w-[300px] w-[300px] flex-shrink-0 flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex flex-col">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#DCE3EA]/40">{col.title}</h3>
                    {showValues && (
                      <span className="text-[9px] font-bold text-[#1E8CFF]">
                        R$ {columnTotal.toLocaleString('pt-BR')}
                      </span>
                    )}
                  </div>
                  <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-[#DCE3EA]/60">
                    {columnOrders.length}
                  </span>
                </div>

                <div className="flex-grow bg-black/20 rounded-[1.5rem] p-3 border border-white/5 space-y-3">
                  {columnOrders.map((order: any) => (
                    <motion.div 
                      layoutId={order.id}
                      key={order.id}
                      className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:border-[#1E8CFF]/30 transition-all cursor-pointer group relative overflow-hidden"
                      onClick={() => {
                        setSelectedOrderId(order.id);
                        setIsModalOpen(true);
                      }}
                    >
                      {order.priority === 'ATENÇÃO' && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
                      )}
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-sm text-white group-hover:text-[#4CDFF2] transition-all leading-tight">
                          {order.businessName || 'Sem nome'}
                        </h4>
                        {order.priority === 'ATENÇÃO' && (
                          <span className="text-[8px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-500 font-black uppercase">
                            PRIORIDADE
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1.5 mb-5">
                        <div className="flex items-center justify-between text-[9px] uppercase tracking-wider">
                          <span className="text-[#DCE3EA]/40">Cliente</span>
                          <span className="text-white font-medium truncate max-w-[150px]">{order.user?.name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] uppercase tracking-wider">
                          <span className="text-[#DCE3EA]/40">Template</span>
                          <span className="text-[#4CDFF2] font-medium">{order.template?.name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] uppercase tracking-wider">
                          <span className="text-[#DCE3EA]/40">Pagamento</span>
                          <span className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-green-500' : 'text-yellow-500'}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-[#DCE3EA]/40">ID</span>
                          <span className="text-[10px] text-white font-medium">#{order.id.slice(-6)}</span>
                        </div>
                        <select 
                          className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[9px] font-bold text-white outline-none cursor-pointer hover:bg-white/10 transition-all"
                          value={order.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => mutation.mutate({ orderId: order.id, status: e.target.value as SiteOrderStatus })}
                        >
                          {COLUMNS.map(c => (
                            <option key={c.id} value={c.id} className="bg-[#071A2F]">{c.title}</option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  ))}
                  
                  {columnOrders.length === 0 && (
                    <div className="h-24 flex items-center justify-center border border-dashed border-white/5 rounded-2xl">
                      <span className="text-[10px] text-[#DCE3EA]/20 font-bold uppercase tracking-widest">Sem Pedidos</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
