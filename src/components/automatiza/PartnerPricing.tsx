import { useState } from "react";

export function PartnerPricing() {
  const [clients, setClients] = useState(10);
  const clientPrice = 49;
  const partnerBase = 99;

  return (
    <section className="py-24 bg-[#071A2F]/30">
      <div className="container px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="bg-[#071A2F] p-8 md:p-12 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#F0A820] text-[#071A2F] text-[10px] font-bold px-4 py-1 uppercase tracking-tighter rounded-bl-xl">
              Condição Especial Ilimitada
            </div>
            <h3 className="text-white text-2xl font-bold mb-8 font-sora">Parceiro Automatiza</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-[#DCE3EA] text-lg line-through">R$ 129</span>
              <span className="text-5xl font-bold text-white font-sora">R$ 99</span>
              <span className="text-[#DCE3EA]">/mês</span>
            </div>
            <p className="text-[#DCE3EA]/60 mb-8">+ R$ 49/mês por cliente ativo</p>
            
            <ul className="space-y-4 mb-10">
              {[
                "Acesso completo ao Hub",
                "Suporte prioritário",
                "Materiais de marketing",
                "Treinamento operacional",
                "Painel de gestão de clientes"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80">
                  <span className="text-[#1E8CFF]">●</span> {item}
                </li>
              ))}
            </ul>

            <button className="w-full bg-white text-[#071A2F] py-4 rounded-xl font-bold hover:bg-[#F7F8FA] transition-all uppercase tracking-wider">
              Quero ser parceiro
            </button>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white font-sora">Simulador de Ganhos</h2>
            <p className="text-[#DCE3EA]">Veja como sua operação se comporta conforme sua carteira de clientes cresce.</p>
            
            <div className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/5">
              <div>
                <label className="block text-sm font-medium text-[#DCE3EA] mb-4">
                  Quantidade de clientes ativos: <span className="text-[#1E8CFF] font-bold text-lg ml-2">{clients}</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={clients}
                  onChange={(e) => setClients(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#071A2F] rounded-lg appearance-none cursor-pointer accent-[#1E8CFF]"
                />
              </div>

              <div className="pt-6 border-t border-white/10 space-y-3">
                <div className="flex justify-between text-[#DCE3EA]">
                  <span>Mensalidade Base</span>
                  <span>R$ {partnerBase}</span>
                </div>
                <div className="flex justify-between text-[#DCE3EA]">
                  <span>Custo por Clientes ({clients} × R$ {clientPrice})</span>
                  <span>R$ {clients * clientPrice}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-white pt-4 border-t border-white/10">
                  <span>Total mensal</span>
                  <span className="text-[#4CDFF2]">R$ {partnerBase + (clients * clientPrice)}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-[#DCE3EA]/40">* Valores meramente ilustrativos. Não representa promessa de lucro ou ganho garantido.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
