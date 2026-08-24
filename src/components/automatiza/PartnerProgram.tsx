import { motion } from "framer-motion";

export function PartnerProgram() {
  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white font-sora mb-4"
          >
            Programa de Parceiros
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#DCE3EA] text-lg max-w-2xl mx-auto"
          >
            Você pode vender tecnologia sem precisar criar a tecnologia.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { step: "01", title: "Você entra", desc: "Faz seu cadastro no programa" },
            { step: "02", title: "Recebe acesso", desc: "Acesso total às ferramentas" },
            { step: "03", title: "Encontra clientes", desc: "Oferece solução para empresas" },
            { step: "04", title: "Acompanha", desc: "Gerencia sua carteira ativa" },
            { step: "05", title: "Você cresce", desc: "Escala junto com a Automatiza" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-[#071A2F] border border-white/5 text-center group hover:border-[#1E8CFF]/30 transition-all"
            >
              <span className="block text-4xl font-bold text-[#1E8CFF]/20 group-hover:text-[#1E8CFF]/50 transition-colors mb-4">{item.step}</span>
              <h4 className="text-white font-bold mb-2">{item.title}</h4>
              <p className="text-sm text-[#DCE3EA]/60">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

