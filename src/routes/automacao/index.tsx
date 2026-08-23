import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/automatiza/Header'
import { ProductSalesTemplate } from '@/components/automatiza/products/ProductSalesTemplate'

export const Route = createFileRoute('/automacao/')({
  component: () => (
    <div className="min-h-screen bg-[#071A2F] font-inter text-[#DCE3EA]">
      <Header />
      <main className="pt-20">
        <ProductSalesTemplate 
          name="Automatiza"
          category="WhatsApp & CRM"
          heroHeadline="Seu WhatsApp não precisa de mais correria. Precisa de processo."
          heroSubheadline="Transforme o aplicativo mais usado da sua empresa em uma operação organizada de atendimento, vendas e relacionamento."
          problemHeadline="Como está sua operação hoje?"
          problems={[
            "Mensagens acumuladas que ninguém responde",
            "Leads esfriando por falta de follow-up",
            "Sua equipe perdida em dezenas de janelas",
            "Você não sabe o que está sendo falado com o cliente"
          ]}
          solutions={[
            "Multi-atendimento com um único número",
            "Funil de vendas visual e intuitivo",
            "Chatbots inteligentes para triagem",
            "Relatórios completos de performance"
          ]}
          features={[
            { title: "Multi-agentes", desc: "Toda sua equipe atendendo em um único número de WhatsApp de forma organizada." },
            { title: "Funil de Vendas", desc: "Visualize em qual etapa cada cliente está e nunca perca um lead por falta de acompanhamento." },
            { title: "Automações", desc: "Crie fluxos de mensagens automáticas para dúvidas frequentes e triagem inicial." },
            { title: "Dashboard", desc: "Saiba exatamente quem está sendo atendido, tempo de resposta e conversão." },
            { title: "API Oficial", desc: "Segurança total para sua operação com a conexão oficial da Meta." },
            { title: "CRM Integrado", desc: "Histórico completo de cada cliente acessível para toda a equipe autorizada." }
          ]}
          price="R$ 297"
          priceNote="Até 5 usuários inclusos. R$ 49 por usuário extra."
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
