import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'
import { RobotMessage } from '@/components/automatiza/RobotMessage'
import { useState, useMemo } from 'react'
import { getProducts } from '@/lib/products.functions'
import { Search } from 'lucide-react'
import { ProductCard } from '@/components/automatiza/catalog/ProductCard'
import { ProductModal } from '@/components/automatiza/catalog/ProductModal'
import { GalleryModal } from '@/components/automatiza/catalog/GalleryModal'

export const Route = createFileRoute('/solucoes/')({
  loader: async () => {
    const products = await getProducts();
    return { products };
  },
  component: SolucoesPage
})

function SolucoesPage() {
  const { products } = useLoaderData({ from: '/solucoes/' });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('TODOS');
  
  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.problem?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = activeFilter === 'TODOS' || p.type === activeFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [products, searchTerm, activeFilter]);

  const handleConhecer = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleShowGallery = (product: any) => {
    setSelectedProduct(product);
    setIsGalleryOpen(true);
  };

  return (
    <div className="bg-[#071A2F] font-inter text-[#DCE3EA]">
      <main className="container px-4 py-12">
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white font-sora mb-6">
            Qual solução sua<br/>
            <span className="text-[#1E8CFF]">empresa precisa?</span>
          </h1>
          <p className="text-lg text-[#DCE3EA]/70">
            Da automação do WhatsApp ao site da sua empresa. Do agendamento à mídia indoor. Encontre a solução certa para sua operação.
          </p>
        </div>

        {/* Busca e Filtros */}
        <div className="mb-12 space-y-6">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#DCE3EA]/40" />
            <input 
              type="text"
              placeholder="Busque por segmento ou problema..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-[#DCE3EA]/30 focus:border-[#1E8CFF]/50 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {['TODOS', 'SAAS', 'SERVICE', 'SOLUTION', 'MEDIA'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all border ${
                  activeFilter === filter 
                    ? 'bg-[#1E8CFF] border-[#1E8CFF] text-white shadow-lg shadow-[#1E8CFF]/20' 
                    : 'bg-white/5 border-white/10 text-[#DCE3EA]/60 hover:border-white/20'
                }`}
              >
                {filter === 'SERVICE' ? 'SERVIÇOS' : filter === 'SOLUTION' ? 'SOLUÇÕES' : filter}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((p: any) => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onConhecer={handleConhecer} 
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <RobotMessage 
              type="warning"
              message="Não encontramos uma solução exata para sua busca, mas podemos construir uma para você!"
              className="max-w-2xl mx-auto justify-center"
            />
            <button className="mt-8 bg-[#1E8CFF] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#1E8CFF]/90 transition-all">
              FALAR COM A AUTOMATIZA
            </button>
          </div>
        )}

        <div className="mt-20">
          <div className="p-12 rounded-[3rem] bg-gradient-to-br from-[#1E8CFF]/10 to-transparent border border-[#1E8CFF]/20 text-center">
            <h2 className="text-3xl font-bold text-white font-sora mb-6">Não encontrou sua área?</h2>
            <p className="text-[#DCE3EA]/70 mb-8 max-w-xl mx-auto">
              Se sua empresa não aparece aqui, fale com a gente. Podemos encontrar ou construir uma solução para sua operação.
            </p>
            <button className="bg-white text-[#071A2F] px-10 py-5 rounded-2xl font-bold hover:bg-[#F7F8FA] transition-all uppercase tracking-widest text-sm">
              FALAR COM A AUTOMATIZA
            </button>
          </div>
        </div>
      </main>

      {/* Product Discovery Modals */}
      {selectedProduct && (
        <>
          <ProductModal 
            product={selectedProduct}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onShowGallery={handleShowGallery}
          />
          <GalleryModal 
            product={selectedProduct}
            isOpen={isGalleryOpen}
            onClose={() => setIsGalleryOpen(false)}
          />
        </>
      )}
    </div>
  )
}
