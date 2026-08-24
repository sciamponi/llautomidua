import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/automatiza/Header';
import { useServerFn } from '@tanstack/react-start';
import { getSiteTemplateBySlug } from '@/lib/sites.functions';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const Route = createFileRoute('/sites/$templateSlug/pedido')({
  component: OrderFormPage,
});

const STEPS = [
  "Empresa",
  "Contato",
  "Serviços",
  "Funcionamento",
  "Conteúdo",
  "Imagens",
  "Revisão",
  "Envio"
];

function OrderFormPage() {
  const { templateSlug } = Route.useParams();
  const fetchTemplate = useServerFn(getSiteTemplateBySlug);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    responsibleName: '',
    whatsapp: '',
    email: '',
    city: '',
    state: '',
    instagram: '',
    description: '',
    services: '',
    differentials: '',
    workingDays: '',
    openingHours: '',
    closingHours: ''
  });

  const { data: template } = useQuery({
    queryKey: ['site-template', templateSlug],
    queryFn: () => fetchTemplate({ data: templateSlug })
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulation
    await new Promise(r => setTimeout(r, 2000));
    toast.success("Pedido enviado com sucesso! Nossa equipe entrará em contato em breve.");
    setIsSubmitting(false);
    setCurrentStep(STEPS.length - 1); // Go to "Envio" success step
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-sora">Dados da Empresa</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nome da Empresa</label>
                <input 
                  type="text" 
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#1E8CFF] outline-none transition-all" 
                  placeholder="Ex: Minha Empresa LTDA"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nome do Responsável</label>
                <input 
                  type="text" 
                  name="responsibleName"
                  value={formData.responsibleName}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#1E8CFF] outline-none transition-all" 
                  placeholder="Seu nome completo"
                />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-sora">Contato & Localização</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">WhatsApp</label>
                <input 
                  type="text" 
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#1E8CFF] outline-none transition-all" 
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">E-mail</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#1E8CFF] outline-none transition-all" 
                  placeholder="contato@empresa.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Cidade</label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#1E8CFF] outline-none transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Estado</label>
                <input 
                  type="text" 
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#1E8CFF] outline-none transition-all" 
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-sora">Dados Comerciais</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Principais Serviços</label>
                <textarea 
                  name="services"
                  value={formData.services}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#1E8CFF] outline-none transition-all h-32" 
                  placeholder="Liste o que você oferece..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Diferenciais</label>
                <textarea 
                  name="differentials"
                  value={formData.differentials}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#1E8CFF] outline-none transition-all h-24" 
                  placeholder="Por que escolher sua empresa?"
                />
              </div>
            </div>
          </div>
        );
      case 6: // Review
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-sora text-[#4CDFF2]">Revisão Final</h3>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 text-sm">
              <p><span className="text-gray-500 uppercase text-[10px] block mb-1">Empresa</span> {formData.businessName || 'Não informado'}</p>
              <p><span className="text-gray-500 uppercase text-[10px] block mb-1">Contato</span> {formData.whatsapp} | {formData.email}</p>
              <p><span className="text-gray-500 uppercase text-[10px] block mb-1">Localização</span> {formData.city} - {formData.state}</p>
              <p><span className="text-gray-500 uppercase text-[10px] block mb-1">Template</span> {template?.name}</p>
            </div>
            <p className="text-xs text-gray-400 italic">Ao enviar, nossa equipe analisará os dados e entrará em contato via WhatsApp para iniciar a produção.</p>
          </div>
        );
      case 7: // Success
        return (
          <div className="text-center py-12 space-y-6">
            <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold font-sora">Pedido Enviado!</h3>
            <p className="text-gray-400 max-w-md mx-auto">Recebemos suas informações. Em até 24h um especialista da Automatiza entrará em contato via WhatsApp.</p>
            <Link to="/sites" className="inline-block px-8 py-4 bg-white text-[#071A2F] rounded-xl font-bold text-xs uppercase tracking-widest mt-8">
              VOLTAR AO CATÁLOGO
            </Link>
          </div>
        );
      default:
        return (
          <div className="py-20 text-center text-gray-500 italic">
            Etapa em desenvolvimento: {STEPS[currentStep]}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#071A2F] text-[#DCE3EA] font-inter">
      <Header />
      
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <Link to="/sites/$templateSlug" params={{ templateSlug }} className="inline-flex items-center text-gray-500 hover:text-white transition-all mb-8 text-xs font-bold uppercase tracking-widest">
            ← Cancelar e Voltar
          </Link>

          <div className="mb-12">
            <h1 className="text-3xl font-bold font-sora mb-2">Vamos personalizar seu site.</h1>
            <p className="text-gray-400">Preencha as informações necessárias para a produção do modelo <span className="text-[#4CDFF2]">{template?.name}</span>.</p>
          </div>

          <div className="flex justify-between mb-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2 z-0" />
            {STEPS.map((step, idx) => (
              <div key={step} className="relative z-10 flex flex-col items-center group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                  idx === currentStep ? 'bg-[#1E8CFF] border-[#1E8CFF] text-white shadow-[0_0_15px_rgba(30,140,255,0.5)]' : 
                  idx < currentStep ? 'bg-[#4CDFF2] border-[#4CDFF2] text-[#071A2F]' :
                  'bg-[#071A2F] border-white/10 text-white/30'
                }`}>
                  {idx < currentStep ? '✓' : idx + 1}
                </div>
                <span className={`absolute -bottom-6 text-[8px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                  idx === currentStep ? 'text-[#1E8CFF]' : 'text-gray-600'
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 mb-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {currentStep < STEPS.length - 1 && (
            <div className="flex justify-between gap-4">
              <button
                onClick={prevStep}
                disabled={currentStep === 0 || isSubmitting}
                className="px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border border-white/10 hover:bg-white/5 disabled:opacity-30"
              >
                Anterior
              </button>
              
              {currentStep === 6 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-[#4CDFF2] text-[#071A2F] rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-[#4CDFF2]/90 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? 'Enviando...' : 'ENVIAR PARA APROVAÇÃO'}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-[#1E8CFF] text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-[#1E8CFF]/90"
                >
                  Próximo
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
