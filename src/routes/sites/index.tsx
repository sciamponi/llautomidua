import { createFileRoute } from '@tanstack/react-router';
import { Hero } from '@/components/automatiza/Hero';
import { PartnerSignup } from '@/components/automatiza/PartnerSignup';

export const Route = createFileRoute('/sites/')({
  component: SitesPage,
});

function SitesPage() {
  return (
    <div className="min-h-screen bg-[#071A2F] text-white">
      <Hero 
        title="Seu negócio já existe. Agora precisa de uma presença digital à altura."
        subtitle="Escolha um modelo pensado para o seu segmento, envie os dados da sua empresa e a Automatiza transforma a estrutura em uma página profissional."
        ctaText="ESCOLHER MEU SITE"
      />
      
      <section className="py-20 px-6 container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Catálogo por Nicho</h2>
        {/* Grid and filters will go here */}
        <div className="text-center text-gray-400">Em breve: Catálogo completo de templates.</div>
      </section>

      <PartnerSignup />
    </div>
  );
}
