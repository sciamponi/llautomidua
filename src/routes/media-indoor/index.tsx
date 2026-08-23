import { createFileRoute, Link } from '@tanstack/react-router'
import { Header } from '@/components/automatiza/Header'
import { RobotMessage } from '@/components/automatiza/RobotMessage'
import { useState } from 'react'
import { captureLead } from '@/lib/leads.functions'
import { toast } from 'sonner'

export const Route = createFileRoute('/media-indoor/')({
  component: MediaIndoorPage
})

function MediaIndoorPage() {
  const [selectedOffer, setSelectedOffer] = useState<'INSTALL' | 'ADVERTISE' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await captureLead({
        name: data.name as string,
        company: data.company as string,
        whatsapp: data.whatsapp as string,
        city: data.city as string,
        address: data.address as string,
        establishmentType: data.establishmentType as string,
        screenCount: Number(data.screenCount) || 0,
        segment: data.segment as string,
        objective: data.objective as string,
        type: selectedOffer === 'INSTALL' ? 'SCREEN_INSTALLATION' : 'SCREEN_ADVERTISING',
      });
      toast.success("Solicitação enviada com sucesso! Entraremos em contato.");
      setSelectedOffer(null);
    } catch (error) {
      toast.error("Erro ao enviar solicitação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071A2F] font-inter text-[#DCE3EA]">
      <Header />
      <main className="container px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <span className="text-[#1E8CFF] font-bold tracking-[0.3em] uppercase text-xs mb-4 block">MEDIA INDOOR</span>
          <h1 className="text-5xl md:text-7xl font-bold text-white font-sora mb-8">
            Uma tela.<br/>
            <span className="text-[#1E8CFF]">Duas oportunidades.</span>
          </h1>
          <p className="text-xl text-[#DCE3EA]/60 max-w-2xl mx-auto">
            Transforme seu estabelecimento em um ponto de mídia ou coloque sua marca na frente das pessoas certas.
          </p>
        </div>

        {!selectedOffer ? (
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Oferta 1: Instalar */}
            <div 
              onClick={() => setSelectedOffer('INSTALL')}
              className="p-12 rounded-[3rem] bg-white/5 border border-white/10 hover:border-[#1E8CFF]/50 transition-all cursor-pointer group flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-[#1E8CFF]/10 flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform">
                📺
              </div>
              <h2 className="text-3xl font-bold text-white font-sora mb-4">Instale uma tela</h2>
              <p className="text-[#DCE3EA]/60 mb-10 leading-relaxed">
                Transforme seu estabelecimento em um ponto de mídia digital e monetize seu espaço físico.
              </p>
              <button className="bg-white text-[#071A2F] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs">
                QUERO INSTALAR UMA TELA
              </button>
            </div>

            {/* Oferta 2: Anunciar */}
            <div 
              onClick={() => setSelectedOffer('ADVERTISE')}
              className="p-12 rounded-[3rem] bg-white/5 border border-white/10 hover:border-[#4CDFF2]/50 transition-all cursor-pointer group flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-[#4CDFF2]/10 flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform">
                📈
              </div>
              <h2 className="text-3xl font-bold text-white font-sora mb-4">Anuncie em uma tela</h2>
              <p className="text-[#DCE3EA]/60 mb-10 leading-relaxed">
                Coloque sua marca na frente das pessoas certas, em pontos estratégicos de alta circulação.
              </p>
              <button className="bg-[#1E8CFF] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs">
                QUERO ANUNCIAR
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto">
            <button 
              onClick={() => setSelectedOffer(null)}
              className="mb-8 text-[#DCE3EA]/60 hover:text-white flex items-center gap-2 transition-colors"
            >
              ← Voltar para as opções
            </button>
            
            <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10">
              <h2 className="text-2xl font-bold text-white font-sora mb-2">
                {selectedOffer === 'INSTALL' ? 'Instale uma tela' : 'Anuncie em uma tela'}
              </h2>
              <p className="text-[#DCE3EA]/60 mb-8">
                {selectedOffer === 'INSTALL' 
                  ? 'Preencha os dados do seu estabelecimento para análise.' 
                  : 'Diga-nos seu objetivo e entraremos em contato com a melhor estratégia.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input required name="name" placeholder="Seu nome" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#1E8CFF]/50" />
                <input required name="company" placeholder="Sua empresa" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#1E8CFF]/50" />
                <input required name="whatsapp" placeholder="Seu WhatsApp" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#1E8CFF]/50" />
                <input required name="city" placeholder="Sua cidade" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#1E8CFF]/50" />

                {selectedOffer === 'INSTALL' ? (
                  <>
                    <input required name="address" placeholder="Endereço do estabelecimento" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#1E8CFF]/50" />
                    <input required name="establishmentType" placeholder="Tipo de estabelecimento (Ex: Academia, Salão)" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#1E8CFF]/50" />
                    <input required name="screenCount" type="number" placeholder="Quantidade de telas desejadas" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#1E8CFF]/50" />
                  </>
                ) : (
                  <>
                    <input required name="segment" placeholder="Segmento da sua marca" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#1E8CFF]/50" />
                    <textarea required name="objective" placeholder="Mensagem / objetivo da campanha" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#1E8CFF]/50 min-h-[100px]" />
                  </>
                )}

                <button 
                  disabled={loading}
                  className="w-full bg-[#1E8CFF] text-white py-5 rounded-xl font-bold hover:bg-[#1E8CFF]/90 transition-all disabled:opacity-50"
                >
                  {loading ? 'ENVIANDO...' : selectedOffer === 'INSTALL' ? 'QUERO INSTALAR' : 'QUERO ANUNCIAR'}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="mt-32 text-center">
          <RobotMessage 
            type="success"
            message="Consulte disponibilidade ou fale com um especialista para sua região."
            className="max-w-2xl mx-auto justify-center"
          />
        </div>
      </main>
    </div>
  )
}
