import robotHeroAsset from "@/assets/robot-hero.jpg.asset.json";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32">
      <div className="container px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[#1E8CFF] font-semibold tracking-wider text-sm uppercase">Automatiza Solução</span>
            <h1 className="text-5xl md:text-6xl font-bold text-white font-sora leading-tight">
              Tecnologia para automatizar. <br/>
              <span className="text-[#4CDFF2]">Oportunidades para crescer.</span>
            </h1>
            <p className="text-lg text-[#DCE3EA] max-w-lg leading-relaxed">
              A Automatiza Solução reúne ferramentas, tecnologia e oportunidades para quem quer vender mais, automatizar processos e transformar conhecimento em negócio.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="bg-[#1E8CFF] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#1E8CFF]/90 transition-all">
                QUERO CONHECER
              </button>
              <button className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all">
                QUERO SER PARCEIRO
              </button>
            </div>
          </div>
          <div className="relative">
            <img src={robotHeroAsset.url} alt="Mascote Automatiza" className="rounded-3xl shadow-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
