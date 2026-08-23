export function AboutSection() {
  return (
    <section className="py-24 bg-[#071A2F]">
      <div className="container px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square md:aspect-video lg:aspect-square bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center overflow-hidden">
            <div className="text-white/20 text-center p-8">
              <span className="block text-6xl mb-4">👤</span>
              <p className="text-sm uppercase tracking-widest font-bold">Fundador / Placeholder</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <span className="text-[#1E8CFF] font-semibold tracking-wider text-sm uppercase">Quem é a Automatiza?</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white font-sora leading-tight">
              Por trás da tecnologia, existe uma pessoa.
            </h2>
            <div className="space-y-6 text-[#DCE3EA]/80 leading-relaxed text-lg">
              <p>
                A Automatiza Solução nasceu da vontade de transformar tecnologia em algo realmente útil para quem está do outro lado da tela.
              </p>
              <p>
                Percebemos que muitas empresas estavam presas em um ciclo infinito de esforço manual, onde o crescimento era limitado pela capacidade de resposta humana no WhatsApp.
              </p>
              <div className="p-6 border-l-4 border-[#1E8CFF] bg-white/5 italic">
                "Ninguém cresce de verdade preso ao operacional."
              </div>
              <p>
                Buscamos a liberdade através da automação. Não para substituir pessoas, mas para dar a elas o controle e a clareza necessários para focar no que realmente importa: fechar negócios e construir relacionamentos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
