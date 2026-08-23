import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/automatiza/Header'
import { ProductSalesTemplate } from '@/components/automatiza/products/ProductSalesTemplate'

export const Route = createFileRoute('/automedia/')({
  component: () => (
    <div className="min-h-screen bg-[#071A2F] font-inter text-[#DCE3EA]">
      <Header />
      <main className="pt-20">
        <ProductSalesTemplate 
          name="AutoMedia Indoor"
          category="Mídia & Oportunidades"
          heroHeadline="Transforme suas telas em uma nova oportunidade de negócio."
          heroSubheadline="A tecnologia completa para gestão de mídia digital out-of-home (DOOH) que coloca sua empresa no controle da comunicação."
          problemHeadline="Sua comunicação está obsoleta?"
          problems={[
            "Telas estáticas que ninguém olha",
            "Dificuldade em atualizar promoções em tempo real",
            "Falta de métricas de visualização e impacto",
            "Dependência de processos manuais para troca de conteúdo"
          ]}
          solutions={[
            "Gestão centralizada de múltiplas telas",
            "Atualização instantânea via nuvem",
            "Relatórios de exibição e engajamento",
            "Integração com dados em tempo real"
          ]}
          features={[
            { title: "Cloud Player", desc: "Gerencie centenas de telas de qualquer lugar do mundo através do nosso painel web." },
            { title: "Smart Scheduling", desc: "Agende conteúdos por horário, dia da semana ou até condições climáticas." },
            { title: "Dashboards", desc: "Monitore o status de cada tela em tempo real e receba alertas de offline." },
            { title: "Formatos Diversos", desc: "Suporte para vídeos, imagens, feeds RSS, redes sociais e widgets dinâmicos." },
            { title: "Segurança", desc: "Conteúdo criptografado e controle de acesso rigoroso para sua rede de mídia." },
            { title: "Baixo Custo", desc: "Hardware acessível e software otimizado para rodar em diversos dispositivos." }
          ]}
          price="R$ 147"
          priceNote="Por ponto de exibição ativo. Descontos para grandes redes."
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
