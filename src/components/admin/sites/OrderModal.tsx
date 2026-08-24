import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, User, Globe, FileText, History, MessageSquare, ShieldCheck, Send, CreditCard, Receipt, AlertCircle, CheckCircle, Download, ExternalLink, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { getSiteOrderDetails, updateOrderStatus, updatePaymentStatus } from '@/lib/sites-operation.functions';
import type { SiteOrderStatus, PaymentStatus } from '@/lib/sites-operation.functions';

interface OrderModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'RESUMO' | 'DADOS' | 'CONTEUDO' | 'ARQUIVOS' | 'PREVIEW' | 'VERSOES' | 'HISTORICO' | 'COMUNICACOES' | 'FINANCEIRO';

export function OrderModal({ order: initialOrder, isOpen, onClose }: OrderModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('RESUMO');
  const queryClient = useQueryClient();
  const getDetails = useServerFn(getSiteOrderDetails);
  const updateStatus = useServerFn(updateOrderStatus);
  const updatePayStatus = useServerFn(updatePaymentStatus);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-details', initialOrder?.id],
    queryFn: () => getDetails({ data: initialOrder.id }),
    enabled: !!initialOrder?.id && isOpen,
  });

  const statusMutation = useMutation({
    mutationFn: (vars: { status: SiteOrderStatus, comment?: string }) => {
      const data: any = { 
        orderId: order.id, 
        status: vars.status
      };
      if (vars.comment) data.comment = vars.comment;
      return updateStatus({ data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-details', order.id] });
      queryClient.invalidateQueries({ queryKey: ['orders-kanban'] });
      toast.success('Status atualizado');
    }
  });

  const paymentMutation = useMutation({
    mutationFn: (vars: { paymentId: string, status: PaymentStatus, reason?: string }) => {
      const data: any = { 
        paymentId: vars.paymentId, 
        status: vars.status
      };
      if (vars.reason) data.rejectionReason = vars.reason;
      return updatePayStatus({ data });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-details', order.id] });
      queryClient.invalidateQueries({ queryKey: ['orders-kanban'] });
      toast.success('Pagamento atualizado');
    }
  });


  if (!isOpen) return null;

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'RESUMO', label: 'Resumo', icon: Globe },
    { id: 'DADOS', label: 'Dados', icon: User },
    { id: 'CONTEUDO', label: 'Conteúdo', icon: FileText },
    { id: 'ARQUIVOS', label: 'Arquivos', icon: FileText },
    { id: 'PREVIEW', label: 'Preview', icon: Globe },
    { id: 'VERSOES', label: 'Versões', icon: History },
    { id: 'HISTORICO', label: 'Histórico', icon: History },
    { id: 'COMUNICACOES', label: 'Comunicações', icon: MessageSquare },
    { id: 'FINANCEIRO', label: 'Financeiro', icon: CreditCard },
  ];

  const currentPayment = order?.payments?.[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-6xl h-full max-h-[90vh] bg-[#071A2F] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1E8CFF]/10 flex items-center justify-center text-[#1E8CFF]">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-sora leading-tight">{order?.businessName || initialOrder?.businessName}</h2>
                <div className="flex items-center gap-3 mt-1">
                   <span className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Pedido #{order?.id || initialOrder?.id}</span>
                   <span className={cn(
                     "text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider",
                      order?.status === 'PUBLISHED' ? "bg-green-500/20 text-green-500" : 
                      order?.status === 'APPROVED' ? "bg-yellow-500/20 text-yellow-500" :
                      "bg-[#1E8CFF]/20 text-[#1E8CFF]"
                   )}>
                     {order?.status}
                   </span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-white/5 rounded-2xl transition-all text-[#DCE3EA]/40 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex-grow flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[#1E8CFF] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="flex-grow flex overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="w-64 border-r border-white/5 p-4 space-y-2 bg-black/10 overflow-y-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                      activeTab === tab.id 
                        ? "bg-[#1E8CFF] text-white shadow-lg shadow-[#1E8CFF]/20" 
                        : "text-[#DCE3EA]/40 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content Area */}
              <div className="flex-grow p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                {activeTab === 'RESUMO' && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Empresa</span>
                        <p className="text-sm text-white font-medium">{order?.businessName}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Cliente</span>
                        <p className="text-sm text-white font-medium">{order?.user?.name || 'Não informado'}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Template</span>
                        <p className="text-sm text-[#4CDFF2] font-medium">{order?.template?.name}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Valor</span>
                        <p className="text-sm text-white font-medium">R$ {Number(order?.price).toLocaleString('pt-BR')}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Status Pagamento</span>
                        <span className={cn(
                          "inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                          order?.paymentStatus === 'PAID' ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"
                        )}>{order?.paymentStatus}</span>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                       <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                         <ShieldCheck className="w-4 h-4 text-[#1E8CFF]" /> Ações de Produção
                       </h3>
                       <div className="flex flex-wrap gap-4">
                         {order?.status === 'SUBMITTED' && (
                           <button 
                             onClick={() => statusMutation.mutate({ status: 'DATA_REVIEW' })}
                             className="px-6 py-3 bg-[#1E8CFF] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#1E8CFF]/90 transition-all"
                           >
                             Iniciar Análise
                           </button>
                         )}
                         {order?.status === 'DATA_REVIEW' && (
                           <button 
                             onClick={() => statusMutation.mutate({ status: 'IN_PRODUCTION' })}
                             className="px-6 py-3 bg-[#1E8CFF] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#1E8CFF]/90 transition-all"
                           >
                             Mover para Produção
                           </button>
                         )}
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === 'HISTORICO' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Histórico de Alterações</h3>
                    <div className="space-y-4">
                      {order?.history?.map((h: any) => (
                        <div key={h.id} className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                            <History className="w-4 h-4 text-[#DCE3EA]/40" />
                          </div>
                          <div>
                            <p className="text-xs text-white">
                              Mudou de <span className="text-[#DCE3EA]/40">{h.fromStatus || 'INICIAL'}</span> para <span className="font-bold text-[#4CDFF2]">{h.toStatus}</span>
                            </p>
                            {h.comment && <p className="text-[10px] text-[#DCE3EA]/60 mt-2 bg-black/20 p-2 rounded-lg italic">"{h.comment}"</p>}
                            <p className="text-[9px] text-[#DCE3EA]/40 mt-1 uppercase">{new Date(h.createdAt).toLocaleString('pt-BR')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'FINANCEIRO' && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-[#4CDFF2] uppercase tracking-[0.2em]">Detalhes da Cobrança</h4>
                          <Receipt className="w-4 h-4 text-[#DCE3EA]/40" />
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Valor do Projeto</span>
                            <span className="text-lg font-bold text-white">R$ {Number(order?.price).toLocaleString('pt-BR')}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Status Geral</span>
                            <span className={cn(
                              "text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider",
                              order?.paymentStatus === 'PAID' ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"
                            )}>
                              {order?.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {currentPayment && (
                          <div className="pt-4 border-t border-white/5 space-y-4">
                             <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                               <div>
                                 <p className="text-[10px] font-bold text-white uppercase tracking-widest">Método: {currentPayment.method}</p>
                                 <p className="text-[9px] text-[#DCE3EA]/40 mt-0.5 uppercase">Status: {currentPayment.status}</p>
                               </div>
                               {currentPayment.status === 'PROOF_SUBMITTED' ? (
                                 <AlertCircle className="w-4 h-4 text-yellow-500" />
                               ) : currentPayment.status === 'PAID' ? (
                                 <CheckCircle className="w-4 h-4 text-green-500" />
                               ) : null}
                             </div>
                          </div>
                        )}
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                        <h4 className="text-xs font-bold text-[#4CDFF2] uppercase tracking-[0.2em]">Comprovante / Ações</h4>
                        
                        {currentPayment?.proofUrl ? (
                          <div className="space-y-4">
                            <a 
                              href={currentPayment.proofUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block aspect-video bg-black/40 rounded-2xl border border-white/10 overflow-hidden relative group"
                            >
                              <img src={currentPayment.proofUrl} alt="Comprovante" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all" />
                              </div>
                            </a>
                            <div className="flex gap-4">
                              <button 
                                onClick={() => paymentMutation.mutate({ paymentId: currentPayment.id, status: 'PAID' })}
                                className="flex-grow py-4 bg-green-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-green-600 transition-all"
                              >
                                Aprovar
                              </button>
                              <button 
                                onClick={() => paymentMutation.mutate({ paymentId: currentPayment.id, status: 'REJECTED', reason: 'Comprovante ilegível' })}
                                className="px-4 py-4 bg-red-500/20 text-red-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-500/30 transition-all"
                              >
                                Rejeitar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-video bg-black/40 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-4 text-center p-8">
                             <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#DCE3EA]/20">
                               <FileText className="w-6 h-6" />
                             </div>
                             <div>
                               <p className="text-xs font-bold text-white uppercase tracking-widest">Aguardando Cliente</p>
                               <p className="text-[9px] text-[#DCE3EA]/40 mt-1 uppercase">O cliente ainda não enviou comprovante</p>
                             </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Outras abas (Placeholder com visual real) */}
                {['DADOS', 'CONTEUDO', 'ARQUIVOS', 'PREVIEW', 'VERSOES', 'COMUNICACOES'].includes(activeTab) && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl">🚧</div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-widest">{activeTab} EM INTEGRAÇÃO</h3>
                      <p className="text-xs text-[#DCE3EA]/60 mt-1">Conectando lógica de persistência para esta seção...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
