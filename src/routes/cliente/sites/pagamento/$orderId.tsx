import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Receipt, Copy, CheckCircle, Upload, AlertCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/cliente/sites/pagamento/$orderId')({
  component: ClientPaymentPage,
});

function ClientPaymentPage() {
  const { orderId } = Route.useParams();
  const [method, setMethod] = useState<'PIX' | 'ASAAS' | null>(null);
  const [copied, setCopied] = useState(false);
  const [proofUploaded, setProofUploaded] = useState(false);

  const pixData = {
    key: '000.000.000-00',
    receiver: 'Automatiza Soluções LTDA',
    amount: 1500.00,
    instructions: 'Transfira o valor exato para a chave PIX acima. Após o pagamento, anexe o comprovante para acelerar a publicação do seu site.'
  };

  const copyKey = () => {
    navigator.clipboard.writeText(pixData.key);
    setCopied(true);
    toast.success('Chave PIX copiada!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E8CFF]/10 border border-[#1E8CFF]/20 text-[#1E8CFF] text-[10px] font-bold uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3" /> Checkout Seguro
        </div>
        <h1 className="text-3xl font-bold text-white font-sora">Pagamento do Projeto</h1>
        <p className="text-[#DCE3EA]/60 max-w-lg mx-auto">Seu site foi aprovado! Agora, realize o pagamento para iniciarmos a publicação oficial.</p>
      </header>

      {!method ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => setMethod('PIX')}
            className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:border-[#1E8CFF]/50 transition-all group text-left space-y-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#1E8CFF]/10 flex items-center justify-center text-[#1E8CFF] group-hover:scale-110 transition-transform">
              <Receipt className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-sora">PIX (Manual)</h3>
              <p className="text-sm text-[#DCE3EA]/60 mt-2">Pagamento instantâneo com aprovação manual via comprovante.</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#1E8CFF] uppercase tracking-widest">
              Selecionar Método →
            </div>
          </button>

          <button 
            onClick={() => toast.info('Gateway Asaas será integrado na próxima fase.')}
            className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:border-[#1E8CFF]/50 transition-all group text-left space-y-6 opacity-50"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#DCE3EA]/40 group-hover:scale-110 transition-transform">
              <CreditCard className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-sora">Cartão ou Boleto</h3>
              <p className="text-sm text-[#DCE3EA]/60 mt-2">Pagamento automático via gateway Asaas (Disponível em breve).</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">
              Em Breve
            </div>
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 space-y-10"
        >
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setMethod(null)}
              className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest hover:text-white transition-colors"
            >
              ← Alterar Método
            </button>
            <div className="text-right">
              <span className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Valor a Pagar</span>
              <p className="text-2xl font-bold text-[#1E8CFF]">R$ {pixData.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="aspect-square bg-white rounded-3xl p-4 max-w-[280px] mx-auto md:mx-0">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=automatiza-pix-${orderId}`} 
                  alt="QR Code PIX"
                  className="w-full h-full"
                />
              </div>
              <p className="text-[10px] text-center md:text-left text-[#DCE3EA]/40 uppercase tracking-[0.2em]">Escaneie o QR Code acima</p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Chave PIX</span>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm font-bold text-white">{pixData.key}</p>
                      <button 
                        onClick={copyKey}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-[#1E8CFF]"
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Recebedor</span>
                    <p className="text-sm font-bold text-white mt-1">{pixData.receiver}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#4CDFF2] uppercase tracking-widest">
                  <AlertCircle className="w-4 h-4" /> Instruções
                </div>
                <p className="text-sm text-[#DCE3EA]/60 leading-relaxed italic">{pixData.instructions}</p>
              </div>

              {!proofUploaded ? (
                <div className="space-y-4">
                  <label className="block w-full cursor-pointer group">
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*,.pdf"
                      onChange={() => {
                        setProofUploaded(true);
                        toast.success('Comprovante enviado para análise!');
                      }}
                    />
                    <div className="py-6 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center gap-3 group-hover:border-[#1E8CFF]/50 transition-all">
                      <Upload className="w-6 h-6 text-[#DCE3EA]/40 group-hover:text-[#1E8CFF] transition-colors" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest">Anexar Comprovante</span>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-3xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Comprovante Recebido</p>
                    <p className="text-[10px] text-green-500/60 mt-1 uppercase">Aguardando aprovação financeira</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
