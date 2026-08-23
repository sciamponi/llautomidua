import { createFileRoute } from "@tanstack/react-router";
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

        
        <section className="py-24 bg-[#071A2F]">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white font-sora mb-4">O que a Automatiza faz?</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Automação", desc: "Soluções para automatizar tarefas e processos repetitivos." },
                { title: "WhatsApp e Atendimento", desc: "Ferramentas para melhorar comunicação, atendimento e vendas." },
                { title: "CRM e Gestão", desc: "Organização de leads, clientes, equipes e processos." },
                { title: "Mídia e Soluções Digitais", desc: "Tecnologia aplicada para criar novas oportunidades de negócio." },
                { title: "Produtos SaaS", desc: "Sistemas desenvolvidos para resolver problemas reais." },
                { title: "Programa de Parceiros", desc: "Uma oportunidade para transformar tecnologia em fonte de renda." }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-[#1E8CFF]/30 transition-all group">
                  <h4 className="text-xl font-bold text-white mb-4 group-hover:text-[#1E8CFF] transition-colors">{item.title}</h4>
                  <p className="text-[#DCE3EA]/70 leading-relaxed">{item.desc}</p>
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
