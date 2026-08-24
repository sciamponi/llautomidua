import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <section className="py-24 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1E8CFF]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="inline-block p-4 rounded-full bg-white/5 border border-white/10 mb-4">
             <span className="text-4xl">🤖</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white font-sora leading-tight">
            Seu WhatsApp não precisa de mais correria. <br/>
            <span className="text-[#1E8CFF]">Precisa de processo.</span>
          </h2>
          
          <p className="text-[#DCE3EA]/70 text-lg max-w-2xl mx-auto">
            Junte-se a centenas de empresas que transformaram o caos em uma operação inteligente e lucrativa.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button 
              onClick={() => window.location.href = '/solucoes'}
              className="bg-[#1E8CFF] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#1E8CFF]/90 transition-all uppercase tracking-wider"
            >
              ENCONTRAR MINHA SOLUÇÃO
            </button>
            <button 
              onClick={() => window.location.href = '/parceiros'}
              className="border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/5 transition-all uppercase tracking-wider"
            >
              QUERO SER PARCEIRO
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
