import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/automatiza/Header'
import { RobotMessage } from '@/components/automatiza/RobotMessage'
import { cn } from '@/lib/utils'

const solutions = [
  {
    id: 'automacao',
    name: 'Automatiza',
    category: 'WhatsApp & CRM',
    description: 'Transforme seu WhatsApp em uma operação organizada de atendimento e vendas.',
    problem: 'Tenho muitas mensagens e dificuldade para organizar os atendimentos.',
    path: '/automacao'
  },
  {
    id: 'barberia',
    name: 'BarberIA',
    category: 'Agendamento & Gestão',
    description: 'Agendamento e gestão para barbearias que querem parar de depender de mensagens manuais.',
    problem: 'Minha operação depende de confirmações e agendamentos manuais.',
    path: '/barberia'
  },
  {
    id: 'esmalteria',
    name: 'Esmaltter-IA',
    category: 'Beleza & Estética',
    description: 'Organize atendimento, clientes e agendamentos do seu negócio de beleza.',
    problem: 'Preciso organizar clientes, histórico e relacionamento.',
    path: '/esmalteria'
  },
  {
    id: 'automedia',
    name: 'AutoMedia Indoor',
    category: 'Mídia & Oportunidades',
    description: 'Tecnologia para transformar mídia indoor em oportunidade comercial.',
    problem: 'Quero criar novas oportunidades comerciais através de mídia e tecnologia.',
    path: '/automedia'
  },
  {
    id: 'oficinas',
    name: 'Solução para Oficinas',
    category: 'Gestão Automotiva',
    description: 'Organize a operação da oficina e o relacionamento com seus clientes.',
    problem: 'Preciso enxergar melhor minha operação e organizar os leads.',
    path: '/oficinas'
  }
];

export const Route = createFileRoute('/solucoes')({
  component: SolucoesPage
})

function SolucoesPage() {
  return (
    <div className="min-h-screen bg-[#071A2F] font-inter text-[#DCE3EA]">
      <Header />
      <main className="container px-4 py-20">
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white font-sora mb-6">
            Uma empresa.<br/>
            <span className="text-[#1E8CFF]">Várias soluções.</span>
          </h1>
          <p className="text-lg text-[#DCE3EA]/70">
            Tecnologia especializada para problemas reais. Escolha a solução que sua empresa precisa hoje.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((s) => (
            <div key={s.id} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-[#1E8CFF]/30 transition-all group flex flex-col">
              <div className="mb-6">
                <span className="text-[10px] font-bold text-[#1E8CFF] uppercase tracking-widest bg-[#1E8CFF]/10 px-3 py-1 rounded-full border border-[#1E8CFF]/20">
                  {s.category}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-sora">{s.name}</h3>
              <div className="p-4 rounded-xl bg-[#071A2F]/50 border border-white/5 mb-6">
                <p className="text-xs text-[#1E8CFF] font-bold uppercase mb-1">O Problema:</p>
                <p className="text-sm text-[#DCE3EA]/80 italic">"{s.problem}"</p>
              </div>
              <p className="text-[#DCE3EA]/60 mb-8 flex-grow">{s.description}</p>
              <a 
                href={s.path}
                className="inline-flex items-center justify-center w-full bg-white text-[#071A2F] py-4 rounded-xl font-bold hover:bg-[#F7F8FA] transition-all uppercase text-sm tracking-wider"
              >
                Conhecer {s.name}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <RobotMessage 
            type="success"
            message="Não encontrou o que procurava? Estamos sempre desenvolvendo novas soluções baseadas nas dores do mercado."
            className="max-w-2xl mx-auto justify-center"
          />
        </div>
      </main>

      <footer className="py-12 border-t border-white/10 mt-20">
        <div className="container px-4 text-center">
          <p className="text-[#DCE3EA]/40 text-sm">© 2026 Automatiza Solução. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
