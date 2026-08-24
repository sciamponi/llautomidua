import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/automatiza/Header";
import { Hero } from "@/components/automatiza/Hero";
import { AboutSection } from "@/components/automatiza/AboutSection";
import { DiagnosisSection } from "@/components/automatiza/DiagnosisSection";
import { PartnerProgram } from "@/components/automatiza/PartnerProgram";
import { PartnerPricing } from "@/components/automatiza/PartnerPricing";
import { PartnerSignup } from "@/components/automatiza/PartnerSignup";
import { RobotMessage } from "@/components/automatiza/RobotMessage";
import { MembersPreview } from "@/components/automatiza/MembersPreview";
import { FinalCTA } from "@/components/automatiza/FinalCTA";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-[#071A2F] font-inter text-[#DCE3EA] selection:bg-[#1E8CFF] selection:text-white">
      <Header />
      
      <main>
        <Hero />
        
        <div className="container px-4 py-8">
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
              <p className="text-lg text-[#DCE3EA]/60">Tecnologia especializada para problemas reais. Cada ferramenta da Automatiza foi desenhada para resolver uma dor específica do seu negócio.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Automatiza", cat: "WhatsApp & CRM", problem: "Tenho muitas mensagens e dificuldade para organizar.", path: "/solucoes/automacao" },
                { name: "BarberIA", cat: "Agendamento", problem: "Minha operação depende de agendamentos manuais.", path: "/solucoes/barberia" },
                { name: "Esmaltter-IA", cat: "Beleza", problem: "Preciso organizar clientes e histórico.", path: "/solucoes/esmalteria" },
                { name: "Media Indoor", cat: "Mídia", problem: "Quero criar novas oportunidades comerciais com mídia.", path: "/media-indoor" },
                { name: "Solução Oficinas", cat: "Gestão", problem: "Preciso enxergar melhor minha operação.", path: "/solucoes/oficinas" },
                { name: "PetFlow", cat: "Gestão Pet", problem: "Tenho dificuldade em organizar banho e tosa.", path: "/solucoes/petflow" },
                { name: "Sites Profissionais", cat: "Presença Digital", problem: "Preciso de um site profissional que venda.", path: "/sites" },
                { name: "Programa de Parceiros", cat: "Negócio", problem: "Quero revender tecnologia e escalar ganhos.", path: "/parceiros" }

              ].map((item, i) => (
                <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-[#1E8CFF]/30 transition-all group flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#1E8CFF] uppercase tracking-widest bg-[#1E8CFF]/10 px-3 py-1 rounded-full border border-[#1E8CFF]/20 mb-6 inline-block">
                      {item.cat}
                    </span>
                    <h4 className="text-2xl font-bold text-white mb-4 font-sora">{item.name}</h4>
                    <p className="text-[#DCE3EA]/60 text-sm mb-8 leading-relaxed italic">"{item.problem}"</p>
                  </div>
                  <Link to={item.path as any} className="w-full py-4 rounded-xl bg-white text-[#071A2F] font-bold text-xs uppercase tracking-widest text-center hover:bg-[#F7F8FA] transition-all">
                    Conhecer Solução
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PartnerProgram />
        <PartnerPricing />
        <PartnerSignup />
        <MembersPreview />



        <FinalCTA />
      </main>


      <footer className="py-12 border-t border-white/10 bg-[#071A2F]">
        <div className="container px-4 text-center">
          <p className="text-[#DCE3EA]/40 text-sm">© 2026 Automatiza Solução. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
