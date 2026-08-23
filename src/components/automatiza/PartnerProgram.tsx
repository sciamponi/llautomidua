export function PartnerProgram() {
  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-sora mb-4">Programa de Parceiros</h2>
          <p className="text-[#DCE3EA] text-lg max-w-2xl mx-auto">
            Você pode vender tecnologia sem precisar criar a tecnologia.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { step: "01", title: "Você entra", desc: "Faz seu cadastro no programa" },
            { step: "02", title: "Recebe acesso", desc: "Acesso total às ferramentas" },
            { step: "03", title: "Encontra clientes", desc: "Oferece solução para empresas" },
            { step: "04", title: "Acompanha", desc: "Gerencia sua carteira ativa" },
            { step: "05", title: "Você cresce", desc: "Escala junto com a Automatiza" }
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#071A2F] border border-white/5 text-center group hover:border-[#1E8CFF]/30 transition-all">
              <span className="block text-4xl font-bold text-[#1E8CFF]/20 group-hover:text-[#1E8CFF]/50 transition-colors mb-4">{item.step}</span>
              <h4 className="text-white font-bold mb-2">{item.title}</h4>
              <p className="text-sm text-[#DCE3EA]/60">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
