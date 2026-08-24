import { createFileRoute, Link } from '@tanstack/react-router';
import { Hero } from '@/components/automatiza/Hero';
import { PartnerSignup } from '@/components/automatiza/PartnerSignup';
import { useServerFn } from '@tanstack/react-start';
import { getSiteTemplates } from '@/lib/sites.functions';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Route = createFileRoute('/sites/')({
  component: SitesPage,
});

const CATEGORIES = [
  "TODOS",
  "NEGÓCIOS LOCAIS",
  "SAÚDE",
  "BELEZA",
  "CASA & SERVIÇOS",
  "AUTOMOTIVO",
  "PROFISSIONAIS",
  "EVENTOS",
  "TECNOLOGIA",
  "VENDAS",
  "CAPTURA DE LEADS",
  "OUTROS"
];

function SitesPage() {
  const fetchTemplates = useServerFn(getSiteTemplates);
  const [selectedCategory, setSelectedCategory] = useState("TODOS");

  const { data: templates = [] } = useQuery({
    queryKey: ['site-templates'],
    queryFn: () => fetchTemplates()
  });

  const filteredTemplates = selectedCategory === "TODOS" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="bg-[#071A2F] text-white">
      <Hero 
        title={
          <>
            Sua empresa merece um <br/> 
            <span className="text-[#4CDFF2]">site que venda.</span>
          </>
        }
        subtitle="Escolha um modelo pensado para o seu segmento, envie as informações da sua empresa e deixe a Automatiza cuidar do restante."
        ctaText="ESCOLHER MEU SITE"
        onCtaClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
      />
      
      <section id="catalog" className="py-20 px-6 container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-sora">Catálogo de Soluções</h2>
            <p className="text-gray-400">Modelos validados para alta performance no seu nicho.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat 
                    ? 'bg-[#1E8CFF] text-white' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={template.id}
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#1E8CFF]/50 transition-all flex flex-col"
              >
                <div className="aspect-video bg-gray-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071A2F] to-transparent opacity-60 z-10" />
                  {template.previewImage ? (
                    <img src={template.previewImage} alt={template.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm italic">
                      Prévia em preparação
                    </div>
                  )}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-[#1E8CFF] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                      {template.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-2 font-sora uppercase tracking-tight">{template.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 flex-1">{template.description}</p>
                  
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Aplicação:</span>
                      <span className="text-[#4CDFF2] font-medium">{template.application}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Link
                        to="/sites/$templateSlug"
                        params={{ templateSlug: template.slug }}
                        className="text-center py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-semibold transition-all border border-white/10"
                      >
                        VER DETALHES
                      </Link>
                      <Link
                        to="/sites/$templateSlug/pedido"
                        params={{ templateSlug: template.slug }}
                        className="text-center py-3 bg-[#1E8CFF] hover:bg-[#1E8CFF]/90 text-white rounded-xl text-sm font-semibold transition-all"
                      >
                        QUERO ESSA
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <section className="py-20 bg-white/5 border-y border-white/10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-sora">
              Você escolhe. <br/>
              <span className="text-[#4CDFF2]">A gente coloca sua empresa dentro.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { step: "01", title: "Escolha seu modelo", desc: "Selecione a estrutura ideal para seu segmento." },
              { step: "02", title: "Envie os dados", desc: "Envie informações e mídias da sua empresa." },
              { step: "03", title: "Personalização", desc: "Nossa equipe adapta a estrutura à sua marca." },
              { step: "04", title: "Você aprova", desc: "Revise e peça ajustes se necessário." },
              { step: "05", title: "Publicamos", desc: "Seu site no ar pronto para vender." }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-4xl font-bold text-white/10 mb-4 font-sora">{item.step}</div>
                <h4 className="text-lg font-bold mb-2 text-[#4CDFF2]">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
                {idx < 4 && <div className="hidden md:block absolute top-6 -right-4 w-8 h-[2px] bg-white/10" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <PartnerSignup />
    </div>
  );
}

