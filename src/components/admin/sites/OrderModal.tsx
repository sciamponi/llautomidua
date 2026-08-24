import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, User, Globe, FileText, History, MessageSquare, ShieldCheck, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface OrderModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'RESUMO' | 'DADOS' | 'CONTEUDO' | 'ARQUIVOS' | 'PREVIEW' | 'VERSOES' | 'HISTORICO' | 'COMUNICACOES';

export function OrderModal({ order, isOpen, onClose }: OrderModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('RESUMO');

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
  ];

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
                <h2 className="text-xl font-bold text-white font-sora leading-tight">{order?.businessName}</h2>
                <div className="flex items-center gap-3 mt-1">
                   <span className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Pedido #{order?.id}</span>
                   <span className={cn(
                     "text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider",
                     order?.status === 'PUBLISHED' ? "bg-green-500/20 text-green-500" : "bg-[#1E8CFF]/20 text-[#1E8CFF]"
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
                      <span className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Responsável</span>
                      <p className="text-sm text-white font-medium">{order?.responsible}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">WhatsApp</span>
                      <p className="text-sm text-[#4CDFF2] font-medium">+55 (00) 00000-0000</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">SLA</span>
                      <p className="text-sm text-yellow-500 font-medium">48 Horas</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Prioridade</span>
                      <span className="inline-block px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-500 text-[9px] font-bold">{order?.priority}</span>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5">
                     <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                       <ShieldCheck className="w-4 h-4 text-[#1E8CFF]" /> Ações Rápidas
                     </h3>
                     <div className="flex flex-wrap gap-4">
                       <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                         Alterar Responsável
                       </button>
                       <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                         Prorrogar SLA
                       </button>
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'COMUNICACOES' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <h4 className="text-xs font-bold text-[#4CDFF2] uppercase tracking-[0.2em] mb-6">Simular Notificação</h4>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase">Canal</label>
                          <select className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-[#1E8CFF]">
                            <option>WhatsApp</option>
                            <option>Email</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase">Evento</label>
                          <select className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-[#1E8CFF]">
                            <option>Site em Produção</option>
                            <option>Aguardando Aprovação</option>
                            <option>Publicado</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="p-6 bg-black/60 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-bold text-[#1E8CFF] uppercase mb-4 tracking-widest">Preview da Mensagem</p>
                        <p className="text-sm text-[#DCE3EA]/80 leading-relaxed italic">
                          "Olá, João! Recebemos seus dados e seu site já está em produção. Você pode acompanhar o progresso através do nosso portal: [LINK]"
                        </p>
                      </div>

                      <button className="w-full py-4 bg-[#1E8CFF] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#1E8CFF]/90 transition-all flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" /> Disparar Simulação
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Placeholder for other tabs */}
              {['DADOS', 'CONTEUDO', 'ARQUIVOS', 'PREVIEW', 'VERSOES', 'HISTORICO'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl">🚧</div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Em Desenvolvimento</h3>
                    <p className="text-xs text-[#DCE3EA]/60 mt-1">Esta aba será implementada nas próximas etapas da Fase 5.2.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
