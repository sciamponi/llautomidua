import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/parceiros')({
  component: ParceirosPage
})

function ParceirosPage() {
  return (
    <div className="bg-[#071A2F] font-inter text-[#DCE3EA]">
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="container px-4 text-center space-y-8 relative z-10">
            <span className="text-[#1E8CFF] font-bold uppercase tracking-widest text-sm">Oportunidade de Negócio</span>
            <h1 className="text-4xl md:text-7xl font-bold text-white font-sora leading-tight max-w-4xl mx-auto">
              Transforme tecnologia em uma fonte de <span className="text-[#4CDFF2]">renda recorrente.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#DCE3EA]/70 max-w-2xl mx-auto">
              Você não precisa saber programar para vender os SaaS da Automatiza. Nós entregamos a ferramenta, você entrega a solução.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/membros"
                className="bg-[#1E8CFF] text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-[#1E8CFF]/90 transition-all shadow-xl shadow-[#1E8CFF]/20"
              >
                QUERO SER UM PARCEIRO
              </Link>
              <Link 
                to="/solucoes"
                className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                VER SOLUÇÕES
              </Link>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1E8CFF]/5 blur-[120px] rounded-full pointer-events-none" />
        </section>

        {/* Benefits Section */}
        <section className="py-32 bg-white/[0.02]">
          <div className="container px-4">
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { title: "Renda Recurrente", desc: "Ganhe todos os meses enquanto o cliente estiver ativo na plataforma." },
                { title: "Material Pronto", desc: "Receba kits de marketing, scripts de vendas e treinamentos completos." },
                { title: "Suporte VIP", desc: "Time dedicado para ajudar você a fechar negócios e implementar soluções." }
              ].map((b, i) => (
                <div key={i} className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1E8CFF] flex items-center justify-center text-white text-xl">
                    {i === 0 ? "💰" : i === 1 ? "🎨" : "🚀"}
                  </div>
                  <h3 className="text-xl font-bold text-white font-sora">{b.title}</h3>
                  <p className="text-[#DCE3EA]/60">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Hub Preview */}
        <section className="py-32">
          <div className="container px-4">
            <div className="bg-[#071A2F] border border-white/10 rounded-[3rem] p-12 md:p-20 overflow-hidden relative">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <h2 className="text-3xl md:text-5xl font-bold text-white font-sora">O Hub do Parceiro</h2>
                  <p className="text-[#DCE3EA]/70 text-lg leading-relaxed">
                    Um painel completo para você gerenciar sua carteira, acompanhar comissões e acessar materiais de treinamento exclusivos.
                  </p>
                  <ul className="space-y-4">
                    {["Gestão de Clientes", "Relatórios de Ganhos", "Cursos e Certificações", "Comunidade Exclusiva"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-white/90">
                        <span className="text-[#4CDFF2]">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                  <button className="border border-[#1E8CFF] text-[#1E8CFF] px-8 py-4 rounded-xl font-bold hover:bg-[#1E8CFF]/5 transition-all uppercase tracking-wider">
                    Ver Demonstração do Hub
                  </button>
                </div>
                <div className="relative">
                  <div className="bg-white/5 border border-white/10 rounded-2xl aspect-video w-full flex items-center justify-center">
                    <span className="text-white/20 italic text-sm">Mockup do Dashboard do Parceiro</span>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#4CDFF2]/10 blur-3xl rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

