import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/automatiza/Header'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/membros')({
  component: MembersPage
})

function MembersPage() {
  return (
    <div className="min-h-screen bg-[#071A2F] font-inter text-[#DCE3EA]">
      <Header />
      <main className="container px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-bold text-white font-sora mb-2">Área de Membros</h1>
              <p className="text-[#DCE3EA]/60 text-lg">Bem-vindo de volta, parceiro.</p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all">
                Meus Dados
              </button>
              <button className="px-6 py-3 rounded-xl bg-[#1E8CFF] text-white font-bold hover:bg-[#1E8CFF]/90 transition-all">
                Acessar Hub
              </button>
            </div>
          </header>

          <div className="grid lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1 space-y-2">
              {[
                { label: "Dashboard", active: true },
                { label: "Treinamentos", active: false },
                { label: "Marketing Kit", active: false },
                { label: "Carteira de Clientes", active: false },
                { label: "Suporte", active: false }
              ].map((item, i) => (
                <button 
                  key={i}
                  className={cn(
                    "w-full text-left px-6 py-4 rounded-2xl transition-all font-medium",
                    item.active 
                      ? "bg-[#1E8CFF] text-white shadow-lg shadow-[#1E8CFF]/20" 
                      : "text-[#DCE3EA]/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </aside>

            <div className="lg:col-span-3 space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { label: "Clientes Ativos", value: "12", color: "text-[#4CDFF2]" },
                  { label: "Comissões (Mês)", value: "R$ 588,00", color: "text-[#F0A820]" },
                  { label: "Pontos Clube", value: "1.240", color: "text-[#1E8CFF]" }
                ].map((stat, i) => (
                  <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10">
                    <p className="text-xs font-bold text-[#DCE3EA]/40 uppercase tracking-widest mb-2">{stat.label}</p>
                    <p className={cn("text-3xl font-bold font-sora", stat.color)}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white font-sora">Continuar Assistindo</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { title: "Dominando o BarberIA", progress: 65, cat: "Tutorial" },
                    { title: "Scripts de Alta Conversão", progress: 20, cat: "Vendas" }
                  ].map((course, i) => (
                    <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-[#1E8CFF]/30 transition-all group cursor-pointer">
                      <div className="aspect-video bg-[#071A2F] rounded-xl mb-6 border border-white/5 flex items-center justify-center">
                        <span className="text-white/20">▶</span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] font-bold text-[#1E8CFF] uppercase tracking-widest">{course.cat}</span>
                          <h4 className="text-xl font-bold text-white font-sora">{course.title}</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-[#DCE3EA]/40">
                            <span>Progresso</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-[#1E8CFF]" style={{ width: `${course.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
