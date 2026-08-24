import { createFileRoute } from '@tanstack/react-router'
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
    solutions: product.features ? product.features.map((f: any) => f.title) : [
      "Processos automatizados e eficientes",
      "Visão clara da sua operação",
      "Escalabilidade para seu negócio",
      "Suporte especializado Automatiza"
    ],
    features: product.features || [
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
    <div className="bg-[#071A2F] font-inter text-[#DCE3EA]">
      <main className="pt-20">
        <ProductSalesTemplate {...templateData} />
      </main>
    </div>
  );
}

