import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/automatiza/Header'
import { ProductSalesTemplate } from '@/components/automatiza/products/ProductSalesTemplate'
import { useLoaderData } from '@tanstack/react-router'
import { getProductBySlug } from '@/lib/products.functions'

export const Route = createFileRoute('/solucoes/$productSlug')({
  loader: async ({ params }) => {
    const product = await getProductBySlug({ data: params.productSlug });
    if (!product) throw new Error('Produto não encontrado');
    return { product };
  },
  component: ProductPage
})

function ProductPage() {
  const { product } = useLoaderData({ from: '/solucoes/$productSlug' });

  // Customizing template data based on the dynamic product
  // For now, mapping some fields, but in a real app, the product object would contain all these fields
  const templateData = {
    name: product.name,
    category: product.category,
    heroHeadline: product.shortDescription,
    heroSubheadline: product.description,
    problemHeadline: "Qual o seu desafio hoje?",
    problems: [
      product.problem || "Falta de organização na operação",
      "Processos manuais que consomem tempo",
      "Dificuldade em escalar o atendimento",
      "Falta de visão sobre os resultados"
    ],
    solutions: [
      "Processos automatizados e eficientes",
      "Visão clara da sua operação",
      "Escalabilidade para seu negócio",
      "Suporte especializado Automatiza"
    ],
    features: [
      { title: "Dashboard", desc: "Acompanhe tudo em tempo real através de um painel intuitivo." },
      { title: "Automação", desc: "Reduza o trabalho manual e foque no que realmente importa." },
      { title: "Integração", desc: "Conecte com as ferramentas que você já utiliza no dia a dia." },
      { title: "Relatórios", desc: "Dados precisos para tomar as melhores decisões para seu negócio." },
      { title: "Suporte", desc: "Equipe técnica dedicada para garantir que tudo funcione perfeitamente." },
      { title: "Segurança", desc: "Seus dados protegidos com os mais altos padrões de tecnologia." }
    ],
    price: product.pricing ? `R$ ${product.pricing}` : "Consulte",
    priceNote: product.pricingType === 'SUBSCRIPTION' ? 'Assinatura mensal recorrente.' : 'Valor sob consulta.'
  };

  return (
    <div className="min-h-screen bg-[#071A2F] font-inter text-[#DCE3EA]">
      <Header />
      <main className="pt-20">
        <ProductSalesTemplate {...templateData} />
      </main>
      <footer className="py-12 border-t border-white/10">
        <div className="container px-4 text-center">
          <p className="text-[#DCE3EA]/40 text-sm">© 2026 Automatiza Solução. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
