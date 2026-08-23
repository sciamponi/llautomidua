export function DiagnosisSection() {
  return (
    <section className="py-24 bg-[#071A2F]/50">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-sora mb-6">
            Seu WhatsApp está trabalhando para sua empresa? <br/>
            <span className="text-[#F0A820]">Ou sua equipe está trabalhando para o WhatsApp?</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-red-950/20 border border-red-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 text-xs font-bold text-red-500 uppercase tracking-widest opacity-20">Caos</div>
            <h3 className="text-xl font-bold text-white mb-6 font-sora">O Cenário Atual</h3>
            <ul className="space-y-4">
              {[
                "Mensagens não respondidas acumuladas",
                "Leads qualificados esfriando sem resposta",
                "Orçamentos enviados e nunca cobrados",
                "Equipe perdida em dezenas de janelas",
                "Gestor sem visão do que está acontecendo"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#DCE3EA]">
                  <span className="text-red-500">✕</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-blue-950/20 border border-[#1E8CFF]/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 text-xs font-bold text-[#1E8CFF] uppercase tracking-widest opacity-20">Controle</div>
            <h3 className="text-xl font-bold text-white mb-6 font-sora">Com Automatiza Solução</h3>
            <ul className="space-y-4">
              {[
                "Triagem automática e distribuição de leads",
                "CRM integrado com histórico completo",
                "Follow-up agendado e automatizado",
                "Indicadores de performance em tempo real",
                "Operação profissional e escalável"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#DCE3EA]">
                  <span className="text-[#4CDFF2]">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
