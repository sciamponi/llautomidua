export function MembersPreview() {
  return (
    <section className="py-24 bg-[#071A2F]">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-sora mb-4">Área de Membros</h2>
          <p className="text-[#DCE3EA]/70">Exclusiva para parceiros e clientes Automatiza.</p>
        </div>

        <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 p-6 space-y-6">
            <div className="space-y-1">
              {["Início", "Meus Cursos", "Vídeos", "Clube Parceiros"].map((item, i) => (
                <div key={item} className={i === 0 ? "bg-[#1E8CFF]/10 text-[#1E8CFF] px-4 py-2 rounded-lg font-medium" : "text-[#DCE3EA]/60 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"}>
                  {item}
                </div>
              ))}
            </div>
          </aside>
          
          <main className="flex-1 p-8 bg-[#071A2F]/40">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Boas-vindas", cat: "Treinamento" },
                { title: "Configuração CRM", cat: "Tutorial" },
                { title: "Scripts de Vendas", cat: "Material" },
                { title: "Fluxo de Automação", cat: "Avançado" },
                { title: "Marketing Kit", cat: "Recursos" },
                { title: "Novidades V2.0", cat: "Updates" }
              ].map((item, i) => (
                <div key={i} className="aspect-video bg-[#071A2F] border border-white/5 rounded-xl p-4 flex flex-col justify-end group cursor-pointer hover:border-[#1E8CFF]/50 transition-all">
                  <div className="text-[10px] font-bold text-[#1E8CFF] uppercase mb-1">{item.cat}</div>
                  <h5 className="text-white font-bold">{item.title}</h5>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
