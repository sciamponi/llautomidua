import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useServerFn } from '@tanstack/react-start';
import { processApproval } from '@/lib/sites-operation.functions';
import { toast } from 'sonner';

export const Route = createFileRoute('/sites/aprovacao/$token')({
  component: ClientApprovalPage,
});

function ClientApprovalPage() {
  const { token } = Route.useParams();
  const approveFn = useServerFn(processApproval);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [view, setView] = useState<'details' | 'success' | 'adjustments'>('details');
  const [order, setOrder] = useState({
    businessName: 'Ar-Condicionado Central',
    templateName: 'Ar-Condicionado',
    version: 1,
    previewUrl: 'https://example.com/preview',
    notes: 'Primeira versão do site com todos os serviços listados.'
  });

  const handleApproval = async (approved: boolean) => {
    setIsSubmitting(true);
    try {
      await approveFn({ data: { token, approved, feedback: approved ? undefined : feedback } });
      toast.success(approved ? "Site aprovado com sucesso!" : "Solicitação de ajustes enviada.");
      setView('success');
    } catch (error) {
      toast.error("Erro ao processar solicitação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (view === 'success') {
    return (
      <div className="min-h-screen bg-[#071A2F] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-6">
          <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold font-sora text-white">Solicitação Recebida!</h1>
          <p className="text-gray-400">Obrigado pelo seu retorno. Nossa equipe será notificada e dará continuidade ao processo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071A2F] text-[#DCE3EA] font-inter">
      <header className="border-b border-white/10 p-6 bg-black/20">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold font-sora">{order.businessName}</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Portal de Aprovação • Versão {order.version}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#4CDFF2] rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-[#4CDFF2] uppercase">Aguardando Aprovação</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 md:py-12 flex flex-col md:flex-row gap-8">
        <div className="flex-grow space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden aspect-video relative group">
             {/* Mock de Iframe de Preview */}
             <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="text-center space-y-4">
                  <p className="text-gray-400 text-sm">Preview da Versão {order.version}</p>
                  <a href={order.previewUrl} target="_blank" className="inline-block px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all">
                    Abrir em nova aba
                  </a>
                </div>
             </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Notas da Produção</h3>
            <p className="text-sm leading-relaxed text-gray-300">{order.notes}</p>
          </div>
        </div>

        <aside className="w-full md:w-80 space-y-6 shrink-0">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 sticky top-6">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">Decisão</h4>
              <p className="text-[10px] text-gray-400">Revise o preview e as notas antes de aprovar.</p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => handleApproval(true)}
                disabled={isSubmitting}
                className="w-full py-4 bg-[#4CDFF2] text-[#071A2F] rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#4CDFF2]/90 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Processando...' : 'Aprovar Site'}
              </button>
              
              <button 
                onClick={() => setView('adjustments')}
                disabled={isSubmitting}
                className="w-full py-4 bg-white/5 border border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50"
              >
                Solicitar Ajustes
              </button>
            </div>
          </div>
        </aside>
      </main>

      <AnimatePresence>
        {view === 'adjustments' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#071A2F] border border-white/10 rounded-[2.5rem] p-8 max-w-lg w-full space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold font-sora">Quais ajustes são necessários?</h3>
                <p className="text-gray-400 text-sm">Descreva detalhadamente o que precisa ser alterado.</p>
              </div>

              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#1E8CFF] h-40"
                placeholder="Ex: Gostaria de trocar a imagem principal por uma foto da minha equipe..."
              />

              <div className="flex gap-4">
                <button 
                  onClick={() => setView('details')}
                  className="flex-1 py-4 bg-white/5 rounded-xl font-bold text-xs uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleApproval(false)}
                  disabled={!feedback.trim() || isSubmitting}
                  className="flex-1 py-4 bg-[#1E8CFF] rounded-xl font-bold text-xs uppercase tracking-widest disabled:opacity-50"
                >
                  Enviar Feedback
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
