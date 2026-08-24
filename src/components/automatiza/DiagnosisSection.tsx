import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export function DiagnosisSection() {
  return (
    <section className="py-24 bg-[#071A2F]/50">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white font-sora mb-6">
            Qual problema você quer resolver?
          </h2>
          <p className="text-lg text-[#DCE3EA]/60">
            A Automatiza Solução existe para tirar empresas do operacional manual e colocar crescimento no sistema.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              icon: "💬", 
              title: "WHATSAPP E ATENDIMENTO", 
              desc: "Tenho muitas mensagens e dificuldade para organizar os atendimentos.",
              path: "/solucoes/automacao"
            },
            { 
              icon: "📅", 
              title: "AGENDAMENTOS", 
              desc: "Minha operação depende de confirmações e agendamentos manuais.",
              path: "/solucoes/barberia"
            },
            { 
              icon: "👥", 
              title: "CLIENTES", 
              desc: "Preciso organizar clientes, histórico e relacionamento.",
              path: "/solucoes/esmalteria"
            },
            { 
              icon: "💰", 
              title: "VENDAS", 
              desc: "Tenho leads, mas perco oportunidades no caminho.",
              path: "/solucoes/automacao"
            },
            { 
              icon: "📊", 
              title: "GESTÃO", 
              desc: "Preciso enxergar melhor minha operação e organizar os processos.",
              path: "/solucoes/oficinas"
            },
            { 
              icon: "🌐", 
              title: "PRESENÇA DIGITAL", 
              desc: "Preciso de um site profissional para minha empresa aparecer e vender.",
              path: "/sites"
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-[#1E8CFF]/30 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-4xl mb-6 block">{item.icon}</span>
                <h3 className="text-lg font-bold text-white mb-4 font-sora uppercase tracking-wider">{item.title}</h3>
                <p className="text-[#DCE3EA]/60 text-sm mb-8 leading-relaxed">"{item.desc}"</p>
              </div>
              <Link 
                to="/diagnostico"
                className="w-full py-3 rounded-xl border border-white/10 text-white text-xs font-bold uppercase tracking-widest text-center hover:bg-white/5 transition-all"
              >
                Identificar Minha Solução
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-[2.5rem] bg-red-950/10 border border-red-500/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 text-[10px] font-bold text-red-500 uppercase tracking-[0.3em] opacity-30">Caos</div>
            <h3 className="text-2xl font-bold text-white mb-8 font-sora">O Cenário Atual</h3>
            <ul className="space-y-4">
              {[
                "Mensagens não respondidas acumuladas",
                "Leads qualificados esfriando sem resposta",
                "Orçamentos enviados e nunca cobrados",
                "Equipe perdida em dezenas de janelas",
                "Gestor sem visão do que está acontecendo"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#DCE3EA]/70">
                  <span className="text-red-500">✕</span> {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-[2.5rem] bg-[#1E8CFF]/5 border border-[#1E8CFF]/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 text-[10px] font-bold text-[#4CDFF2] uppercase tracking-[0.3em] opacity-30">Controle</div>
            <h3 className="text-2xl font-bold text-white mb-8 font-sora">Com Automatiza Solução</h3>
            <ul className="space-y-4">
              {[
                "Triagem automática e distribuição de leads",
                "CRM integrado com histórico completo",
                "Follow-up agendado e automatizado",
                "Indicadores de performance em tempo real",
                "Operação profissional e escalável"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#DCE3EA]">
                  <span className="text-[#4CDFF2]">✓</span> {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

