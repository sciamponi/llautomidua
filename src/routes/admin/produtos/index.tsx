import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router';
import { getProducts } from '@/lib/products.functions';
import { 
  ChevronLeft, 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  XCircle,
  Camera,
  Layers,
  Settings
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Route = createFileRoute('/admin/produtos/')({
  loader: async () => {
    const products = await getProducts();
    return { products };
  },
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const { products } = useLoaderData({ from: '/admin/produtos/' });

  return (
    <div className="min-h-screen bg-[#071A2F] text-[#DCE3EA] font-inter">
      <header className="border-b border-white/10 bg-[#071A2F]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 hover:bg-white/5 rounded-xl transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-white font-sora">Catálogo de Produtos</h1>
          </div>
          <Button className="bg-[#1E8CFF] hover:bg-[#1E8CFF]/90 text-white font-bold rounded-xl gap-2">
            <Plus className="w-5 h-5" /> NOVO PRODUTO
          </Button>
        </div>
      </header>

      <main className="container px-4 py-8 md:py-12">
        {/* Filters and Search */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#DCE3EA]/40" />
            <Input 
              placeholder="Filtrar por nome, categoria ou nicho..." 
              className="bg-[#071A2F] border-white/10 pl-12 h-12 rounded-xl focus:border-[#1E8CFF]/50"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/10 bg-white/5 h-12 rounded-xl gap-2">
              <Filter className="w-4 h-4" /> Filtros
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <div key={product.id} className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden group hover:border-[#1E8CFF]/30 transition-all flex flex-col">
              {/* Product Header/Image Placeholder */}
              <div className="aspect-[21/9] bg-white/5 border-b border-white/5 flex items-center justify-center relative">
                {product.coverImage ? (
                  <img src={product.coverImage} className="w-full h-full object-cover opacity-50" />
                ) : (
                  <Camera className="w-8 h-8 text-white/10" />
                )}
                <div className="absolute top-4 right-4">
                  <Badge variant={product.status === 'active' ? 'default' : 'secondary'} className={product.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : ''}>
                    {product.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="p-8 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white font-sora group-hover:text-[#1E8CFF] transition-colors">{product.name}</h3>
                    <p className="text-[10px] font-bold text-[#1E8CFF] uppercase tracking-widest mt-1">{product.category}</p>
                  </div>
                  {product.featured && <Badge className="bg-[#1E8CFF] text-white">DESTAQUE</Badge>}
                </div>

                <p className="text-sm text-[#DCE3EA]/60 mb-6 line-clamp-2">{product.shortDescription}</p>

                <div className="space-y-3 pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#DCE3EA]/40 flex items-center gap-2"><Layers className="w-3 h-3" /> Tipo</span>
                    <span className="text-white font-medium">{product.type}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#DCE3EA]/40 flex items-center gap-2"><Settings className="w-3 h-3" /> Demo</span>
                    <span className={product.demoActive ? "text-green-500 font-bold" : "text-red-500"}>
                      {product.demoActive ? "ATIVA" : "INATIVA"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/5 border-t border-white/5 flex gap-2">
                <Button variant="outline" className="flex-1 border-white/10 bg-white/5 hover:bg-[#1E8CFF]/10 hover:text-[#1E8CFF] text-white rounded-xl gap-2 text-xs">
                  <Edit className="w-4 h-4" /> EDITAR
                </Button>
                <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-red-500/10 hover:text-red-500 text-white rounded-xl p-3">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
