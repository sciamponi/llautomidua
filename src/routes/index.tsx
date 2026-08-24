import { createFileRoute, Link } from "@tanstack/react-router";
import { Hero } from "@/components/automatiza/Hero";
import { AboutSection } from "@/components/automatiza/AboutSection";
import { DiagnosisSection } from "@/components/automatiza/DiagnosisSection";
import { PartnerProgram } from "@/components/automatiza/PartnerProgram";
import { PartnerPricing } from "@/components/automatiza/PartnerPricing";
import { PartnerSignup } from "@/components/automatiza/PartnerSignup";
import { RobotMessage } from "@/components/automatiza/RobotMessage";
import { MembersPreview } from "@/components/automatiza/MembersPreview";
import { FinalCTA } from "@/components/automatiza/FinalCTA";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getProducts } from "@/lib/products.functions";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const fetchProducts = useServerFn(getProducts);

  const { data: products = [] } = useQuery({
    queryKey: ['active-products'],
    queryFn: () => fetchProducts(),
  });

  return (
    <div className="bg-[#071A2F] font-inter text-[#DCE3EA] selection:bg-[#1E8CFF] selection:text-white">
      <main>
        <Hero 
          title={<>Automatize.<br /><span className="text-[#1E8CFF]">Cresça.</span></>}
          subtitle="Transformando problemas operacionais em soluções digitais inteligentes que organizam seu negócio e escalam suas vendas."
        />
        
        <div className="container px-4 py-12">
          <Link to="/diagnostico" className="block max-w-fit mx-auto">
            <RobotMessage 
              type="warning" 
              message="Não sabe por onde começar? Clique aqui para fazer o diagnóstico da sua empresa! 🤖✨" 
              className="hover:scale-105 transition-transform cursor-pointer"
            />
          </Link>
        </div>

        <DiagnosisSection />
        <AboutSection />

        <section className="py-32 bg-[#071A2F] border-t border-white/5">
          <div className="container px-4">
            <div className="max-w-3xl mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white font-sora mb-6">Uma empresa.<br/><span className="text-[#1E8CFF]">Várias soluções.</span></h2>
              <p className="text-lg text-[#DCE3EA]/60 max-w-2xl">Tecnologia especializada para problemas reais. Cada ferramenta da Automatiza foi desenhada para resolver uma dor específica do seu negócio.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.filter(p => p.status === 'active' && p.featured).map((item, i) => (
                <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-[#1E8CFF]/30 transition-all group flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#1E8CFF] uppercase tracking-widest bg-[#1E8CFF]/10 px-3 py-1 rounded-full border border-[#1E8CFF]/20 mb-6 inline-block">
                      {item.category}
                    </span>
                    <h4 className="text-2xl font-bold text-white mb-4 font-sora">{item.name}</h4>
                    <p className="text-[#DCE3EA]/60 text-sm mb-8 leading-relaxed italic">"{item.problem}"</p>
                  </div>
                  {item.type === 'SAAS' ? (
                    <Link 
                      to="/solucoes/$productSlug"
                      params={{ productSlug: item.slug }}
                      className="w-full py-4 rounded-xl bg-white text-[#071A2F] font-bold text-xs uppercase tracking-widest text-center hover:bg-[#F7F8FA] transition-all"
                    >
                      Conhecer Solução
                    </Link>
                  ) : (
                    <Link 
                      to={item.slug === 'sites' ? '/sites' : '/media-indoor'}
                      className="w-full py-4 rounded-xl bg-white text-[#071A2F] font-bold text-xs uppercase tracking-widest text-center hover:bg-[#F7F8FA] transition-all"
                    >
                      Conhecer Solução
                    </Link>
                  )}

                </div>
              ))}
              
              {/* Specialized CTAs */}
              <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-[#1E8CFF]/30 transition-all group flex flex-col justify-between border-dashed">
                <div>
                  <span className="text-[10px] font-bold text-[#4CDFF2] uppercase tracking-widest bg-[#4CDFF2]/10 px-3 py-1 rounded-full border border-[#4CDFF2]/20 mb-6 inline-block">
                    Negócio
                  </span>
                  <h4 className="text-2xl font-bold text-white mb-4 font-sora">Programa de Parceiros</h4>
                  <p className="text-[#DCE3EA]/60 text-sm mb-8 leading-relaxed italic">"Quero revender tecnologia e escalar meus ganhos recorrentes."</p>
                </div>
                <Link to="/parceiros" className="w-full py-4 rounded-xl border border-white/20 text-white font-bold text-xs uppercase tracking-widest text-center hover:bg-white/5 transition-all">
                  Ser um Parceiro
                </Link>
              </div>
            </div>
          </div>
        </section>

        <PartnerProgram />
        <PartnerPricing />
        <PartnerSignup />
        <MembersPreview />
        <FinalCTA />
      </main>
    </div>
  );
}

