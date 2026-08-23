import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/automatiza/Header'
import { ProductSalesTemplate } from '@/components/automatiza/products/ProductSalesTemplate'

export const Route = createFileRoute('/barberia')({
  component: () => (
    <div className="min-h-screen bg-[#071A2F] font-inter text-[#DCE3EA]">
      <Header />
      <main className="pt-20">
        <ProductSalesTemplate 
          name="BarberIA"
          category="Agendamento & Gestão"
          heroHeadline="Menos mensagens. Mais agendamentos organizados."
          heroSubheadline="O sistema completo de gestão e agendamento online feito exclusivamente para barbearias que querem crescer."
          problemHeadline="Por que você ainda usa o papel?"
          problems={[
            "Horas perdidas respondendo 'qual horário você tem?'",
            "Esquecimento de clientes e cadeiras vazias",
            "Confusão financeira e falta de controle de estoque",
            "Dificuldade em fidelizar o cliente"
          ]}
          solutions={[
            "Link de agendamento online 24h",
            "Lembretes automáticos via WhatsApp",
            "Fluxo de caixa e comissões automáticas",
            "Histórico de serviços e preferências"
          ]}
          features={[
            { title: "Link Exclusivo", desc: "Seu cliente agenda em segundos sem precisar baixar nenhum aplicativo." },
            { title: "Lembretes", desc: "Reduza as faltas em até 80% com notificações automáticas antes do horário." },
            { title: "Gestão Financeira", desc: "Controle entradas, saídas e comissões de barbeiros de forma simplificada." },
            { title: "App Profissional", desc: "Interface otimizada para o barbeiro ver sua agenda e clientes pelo celular." },
            { title: "Controle de Estoque", desc: "Nunca fique sem os produtos essenciais da sua bancada ou revenda." },
            { title: "Marketing", desc: "Ferramentas para enviar promoções e avisos para sua base de clientes." }
          ]}
          price="R$ 97"
          priceNote="Plano base com todas as funcionalidades inclusas."
        />
      </main>
      <footer className="py-12 border-t border-white/10">
        <div className="container px-4 text-center">
          <p className="text-[#DCE3EA]/40 text-sm">© 2026 Automatiza Solução. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
})
