import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/automatiza/Header'
import { ProductSalesTemplate } from '@/components/automatiza/products/ProductSalesTemplate'

export const Route = createFileRoute('/oficinas')({
  component: () => (
    <div className="min-h-screen bg-[#071A2F] font-inter text-[#DCE3EA]">
      <Header />
      <main className="pt-20">
        <ProductSalesTemplate 
          name="Solução Oficinas"
          category="Gestão Automotiva"
          heroHeadline="Organize a operação da oficina e o relacionamento com seus clientes."
          heroSubheadline="A tecnologia que transforma o pátio da sua oficina em uma linha de produção inteligente, do checklist à entrega do veículo."
          problemHeadline="Sua oficina está perdendo peças e dinheiro?"
          problems={[
            "Orçamentos demorados e mal calculados",
            "Falta de acompanhamento do status do reparo",
            "Histórico de manutenções perdido em pastas",
            "Dificuldade em vender serviços preventivos"
          ]}
          solutions={[
            "Checklist digital na entrada do veículo",
            "Orçamento rápido com catálogo de peças",
            "Envio de status automático via WhatsApp",
            "Alertas de manutenção preventiva"
          ]}
          features={[
            { title: "Checklist Digital", desc: "Registre avarias e necessidades do veículo direto pelo tablet ou celular." },
            { title: "Ordens de Serviço", desc: "Gestão completa do fluxo de trabalho, do mecânico ao faturamento." },
            { title: "Aprovação via Link", desc: "Envie o orçamento para o WhatsApp do cliente e receba a aprovação instantânea." },
            { title: "Histórico Veicular", desc: "Tenha toda a vida útil do veículo do seu cliente gravada para consultas futuras." },
            { title: "Gestão de Peças", desc: "Integração com fornecedores e controle rigoroso de estoque e compras." },
            { title: "Financeiro", desc: "Controle de fluxo de caixa, cartões, notas fiscais e inadimplência." }
          ]}
          price="R$ 197"
          priceNote="Plano especializado para oficinas que visam alta performance."
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
