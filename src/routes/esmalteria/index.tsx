import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/automatiza/Header'
import { ProductSalesTemplate } from '@/components/automatiza/products/ProductSalesTemplate'

export const Route = createFileRoute('/esmalteria')({
  component: () => (
    <div className="min-h-screen bg-[#071A2F] font-inter text-[#DCE3EA]">
      <Header />
      <main className="pt-20">
        <ProductSalesTemplate 
          name="Esmaltter-IA"
          category="Beleza & Estética"
          heroHeadline="Organize atendimento, clientes e agendamentos do seu negócio de beleza."
          heroSubheadline="O sistema inteligente desenvolvido para esmalterias, salões e clínicas de estética que buscam excelência operacional."
          problemHeadline="O operacional está travando seu salão?"
          problems={[
            "Telefone tocando sem parar e mensagens ignoradas",
            "Conflito de agendas e atrasos constantes",
            "Falta de controle de comissões e produtividade",
            "Clientes que não voltam por falta de relacionamento"
          ]}
          solutions={[
            "Agendamento via WhatsApp 24/7",
            "Confirmação automática de presença",
            "Painel administrativo para gestão financeira",
            "Ficha de anamnese e histórico digital"
          ]}
          features={[
            { title: "Agendamento Automático", desc: "Seu cliente escolhe o serviço e a profissional direto pelo WhatsApp ou link." },
            { title: "Gestão de Equipe", desc: "Organize as escalas e comissões de cada profissional de forma justa e transparente." },
            { title: "Fidelidade", desc: "Programas de pontos e promoções automatizadas para fazer sua cliente voltar sempre." },
            { title: "Controle Financeiro", desc: "Acompanhe faturamento diário, ticket médio e lucratividade em tempo real." },
            { title: "Estoque", desc: "Gestão inteligente de insumos para você nunca ficar sem o esmalte favorito." },
            { title: "Relacionamento", desc: "Envie mensagens automáticas de aniversário e pós-atendimento personalizado." }
          ]}
          price="R$ 127"
          priceNote="Plano completo para negócios que buscam crescer com organização."
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
