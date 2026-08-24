import { createFileRoute } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/membros/dashboard')({
  component: MembersDashboardPage
})

function MembersDashboardPage() {
  const { session } = Route.useRouteContext();
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-sora mb-2">Área de Membros</h1>
          <p className="text-[#DCE3EA]/60 text-lg">Bem-vindo de volta, {session?.user.name?.split(' ')[0] || 'parceiro'}.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all text-sm">
            Meus Dados
          </button>
          <button className="px-6 py-3 rounded-xl bg-[#1E8CFF] text-white font-bold hover:bg-[#1E8CFF]/90 transition-all shadow-lg shadow-[#1E8CFF]/20 text-sm">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {[
              { label: "Clientes Ativos", value: "0", color: "text-[#4CDFF2]" },
              { label: "Comissões (Mês)", value: "R$ 0,00", color: "text-[#F0A820]" },
              { label: "Pontos Clube", value: "0", color: "text-[#1E8CFF]" }
            ].map((stat, i) => (
              <div key={i} className="p-6 md:p-8 rounded-[2rem] bg-white/5 border border-white/10">
                <p className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest mb-2">{stat.label}</p>
                <p className={cn("text-2xl md:text-3xl font-bold font-sora", stat.color)}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h3 className="text-xl md:text-2xl font-bold text-white font-sora">Treinamentos Sugeridos</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Dominando o Ecossistema", progress: 0, cat: "Tutorial" },
                { title: "Scripts de Vendas 2.0", progress: 0, cat: "Vendas" }
              ].map((course, i) => (
                <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-[#1E8CFF]/30 transition-all group cursor-pointer">
                  <div className="aspect-video bg-[#071A2F] rounded-xl mb-6 border border-white/5 flex items-center justify-center">
                    <span className="text-white/20 text-3xl group-hover:text-[#1E8CFF] transition-colors">▶</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-[#1E8CFF] uppercase tracking-widest">{course.cat}</span>
                      <h4 className="text-lg md:text-xl font-bold text-white font-sora group-hover:text-[#1E8CFF] transition-colors">{course.title}</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] text-[#DCE3EA]/40">
                        <span>Progresso</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#1E8CFF] to-[#4CDFF2]" style={{ width: `${course.progress}%` }} />
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
  )
}
