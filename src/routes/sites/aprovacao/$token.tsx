import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
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
  const [order] = useState({
    businessName: 'Ar-Condicionado Central',
    templateName: 'Ar-Condicionado',
    version: 1,
    previewUrl: 'https://example.com/preview',
    notes: 'Primeira versão do site com todos os serviços listados.'
  });

  const handleApproval = async (approved: boolean) => {
    setIsSubmitting(true);
    try {
      const approvalData: { token: string; approved: boolean; feedback?: string } = { token, approved };
      if (!approved && feedback) {
        approvalData.feedback = feedback;
      }
      await approveFn({ data: approvalData });

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
        <div className="max-w-md w-full space-y-8">
          <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl font-bold font-sora text-white">Site Aprovado!</h1>
            <p className="text-gray-400">Excelente! Agora só falta o pagamento para iniciarmos a publicação oficial do seu projeto.</p>
          </div>
          
          <Link 
            to="/cliente/sites/pagamento/$orderId"
            params={{ orderId: 'current-order-id' }} // In production, this would come from the order object
            className="block w-full py-5 bg-[#1E8CFF] text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#1E8CFF]/90 transition-all shadow-lg shadow-[#1E8CFF]/20"
          >
            Ir para Pagamento →
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-[#071A2F] text-[#DCE3EA] font-inter min-h-screen">
      <header className="border-b border-white/10 p-6 bg-black/40 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/" className="hidden md:block">
              <img src="/logo.png" alt="Automatiza" className="h-8 w-auto opacity-50 hover:opacity-100 transition-opacity" />
            </Link>
            <div>
              <h1 className="text-lg md:text-xl font-bold font-sora text-white">{order.businessName}</h1>
              <p className="text-[9px] md:text-[10px] text-[#DCE3EA]/40 uppercase tracking-[0.2em]">Portal de Aprovação • Versão {order.version}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#4CDFF2]/10 px-3 py-1.5 rounded-full border border-[#4CDFF2]/20">
            <div className="w-2 h-2 bg-[#4CDFF2] rounded-full animate-pulse shadow-[0_0_8px_#4CDFF2]" />
            <span className="text-[9px] md:text-[10px] font-bold text-[#4CDFF2] uppercase tracking-wider">Aguardando Aprovação</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col lg:row-reverse lg:flex-row gap-8">
        <div className="flex-grow space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden aspect-video relative group shadow-2xl">
             {/* Mock de Iframe de Preview */}
             <div className="absolute inset-0 bg-[#071A2F]/80 flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-[#1E8CFF]/20 rounded-2xl flex items-center justify-center text-3xl">🌐</div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white font-sora">Visualização do Site</h3>
                  <p className="text-[#DCE3EA]/60 text-sm max-w-xs mx-auto">Esta é uma simulação do seu site. Clique no botão abaixo para ver a versão interativa completa.</p>
                </div>
                <a 
                  href={order.previewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-[#1E8CFF] text-white rounded-xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#1E8CFF]/90 transition-all shadow-lg shadow-[#1E8CFF]/20"
                >
                  Abrir Preview Interativo
                </a>
             </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-xl">📝</span>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#DCE3EA]/40">Notas da Produção</h3>
            </div>
            <div className="bg-[#071A2F]/50 p-6 rounded-2xl border border-white/5">
              <p className="text-base leading-relaxed text-[#DCE3EA]/80">{order.notes}</p>
            </div>
          </div>
        </div>

        <aside className="w-full lg:w-96 space-y-6 shrink-0">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8 sticky top-32 shadow-xl backdrop-blur-sm">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#DCE3EA]/40">Revisão Final</h4>
              <p className="text-xs text-[#DCE3EA]/60 leading-relaxed">
                Após a aprovação, seu site seguirá para a etapa de publicação. Se precisar de mudanças, descreva-as em "Solicitar Ajustes".
              </p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => handleApproval(true)}
                disabled={isSubmitting}
                className="w-full py-5 bg-[#4CDFF2] text-[#071A2F] rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#4CDFF2]/90 transition-all shadow-lg shadow-[#4CDFF2]/20 disabled:opacity-50"
              >
                {isSubmitting ? 'PROCESSANDO...' : 'APROVAR SITE AGORA'}
              </button>
              
              <button 
                onClick={() => setView('adjustments')}
                disabled={isSubmitting}
                className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all disabled:opacity-50"
              >
                SOLICITAR AJUSTES
              </button>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1E8CFF]/20 flex items-center justify-center text-sm">🤖</div>
              <div>
                <p className="text-[10px] font-bold text-white uppercase tracking-widest">Suporte Automatiza</p>
                <p className="text-[9px] text-[#DCE3EA]/40">Dúvidas? Fale conosco no chat.</p>
              </div>
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
            className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
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
                  className="flex-1 py-4 bg-white/5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleApproval(false)}
                  disabled={!feedback.trim() || isSubmitting}
                  className="flex-1 py-4 bg-[#1E8CFF] rounded-xl font-bold text-xs uppercase tracking-widest disabled:opacity-50 shadow-lg shadow-[#1E8CFF]/20"
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


