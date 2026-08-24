import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import logoAsset from "@/assets/logo.png.asset.json";

const SAAS_PRODUCTS = [
  { name: "Automatiza (WhatsApp)", slug: "automacao" },
  { name: "BarberIA", slug: "barberia" },
  { name: "Esmaltter-IA", slug: "esmalteria" },
  { name: "PetFlow", slug: "petflow" },
  { name: "Solução Oficinas", slug: "oficinas" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);

  // Close mobile menu on route change would be ideal, but for now we close on simple clicks
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#071A2F]/90 backdrop-blur-lg">
      <div className="container flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <img src={logoAsset.url} alt="Automatiza Solução" className="h-8 md:h-10 w-auto" />
          </Link>
          
          <nav className="hidden lg:flex gap-8 items-center">
            {/* Solutions Mega Menu Trigger */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsSolutionsOpen(true)}
              onMouseLeave={() => setIsSolutionsOpen(false)}
            >
              <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#DCE3EA]/60 group-hover:text-white transition-colors cursor-default py-8">
                Soluções <ChevronDown className="w-3 h-3" />
              </button>
              
              <AnimatePresence>
                {isSolutionsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-[480px] bg-[#071A2F] border border-white/10 rounded-2xl shadow-2xl p-6 grid grid-cols-2 gap-8"
                  >
                    <div>
                      <h4 className="text-[10px] font-bold text-[#1E8CFF] uppercase tracking-widest mb-4">SaaS</h4>
                      <div className="space-y-3">
                        {SAAS_PRODUCTS.map(p => (
                          <Link 
                            key={p.slug}
                            to="/solucoes/$productSlug"
                            params={{ productSlug: p.slug }}
                            className="block text-sm text-[#DCE3EA]/60 hover:text-white transition-colors"
                          >
                            {p.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-[#4CDFF2] uppercase tracking-widest mb-4">Serviços</h4>
                      <div className="space-y-3">
                        <Link to="/sites" className="block text-sm text-[#DCE3EA]/60 hover:text-white transition-colors">Sites Profissionais</Link>
                        <Link to="/media-indoor" className="block text-sm text-[#DCE3EA]/60 hover:text-white transition-colors">Media Indoor</Link>
                        <Link to="/diagnostico" className="block text-sm text-[#1E8CFF] font-bold hover:text-[#1E8CFF]/80 transition-colors">Diagnóstico</Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/sites" className="text-xs font-bold uppercase tracking-widest text-[#DCE3EA]/60 hover:text-white transition-colors">Sites</Link>
            <Link to="/media-indoor" className="text-xs font-bold uppercase tracking-widest text-[#DCE3EA]/60 hover:text-white transition-colors">Media Indoor</Link>
            <Link to="/parceiros" className="text-xs font-bold uppercase tracking-widest text-[#DCE3EA]/60 hover:text-white transition-colors">Parceiros</Link>
            <Link to="/membros" className="text-xs font-bold uppercase tracking-widest text-[#DCE3EA]/60 hover:text-white transition-colors">Área de Membros</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/diagnostico" 
            className="hidden sm:block text-xs font-bold uppercase tracking-widest text-white hover:text-[#1E8CFF] transition-all px-4"
          >
            ENCONTRAR MINHA SOLUÇÃO
          </Link>
          <Link 
            to="/parceiros" 
            className="hidden lg:block rounded-xl bg-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#071A2F] hover:bg-[#F7F8FA] transition-all"
          >
            QUERO SER PARCEIRO
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-[60] bg-[#071A2F] flex flex-col p-8 lg:hidden overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-12">
              <Link to="/" onClick={closeMenu}>
                <img src={logoAsset.url} alt="Automatiza Solução" className="h-8 w-auto" />
              </Link>
              <button onClick={closeMenu} className="p-2 text-white">
                <X className="w-8 h-8" />
              </button>
            </div>

            <nav className="flex flex-col gap-8 text-2xl font-sora font-bold">
              <Link to="/" onClick={closeMenu} className="hover:text-[#1E8CFF]">Início</Link>
              
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#DCE3EA]/40">SaaS</p>
                <div className="grid grid-cols-1 gap-4 text-lg">
                  {SAAS_PRODUCTS.map(p => (
                    <Link key={p.slug} to="/solucoes/$productSlug" params={{ productSlug: p.slug }} onClick={closeMenu}>{p.name}</Link>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#DCE3EA]/40">Serviços</p>
                <div className="flex flex-col gap-4 text-lg">
                  <Link to="/sites" onClick={closeMenu}>Sites Profissionais</Link>
                  <Link to="/media-indoor" onClick={closeMenu}>Media Indoor</Link>
                </div>
              </div>

              <Link to="/parceiros" onClick={closeMenu} className="hover:text-[#1E8CFF]">Parceiros</Link>
              <Link to="/membros" onClick={closeMenu} className="hover:text-[#1E8CFF]">Área de Membros</Link>
            </nav>

            <div className="mt-auto pt-12 space-y-4">
              <Link 
                to="/diagnostico" 
                onClick={closeMenu}
                className="block w-full text-center py-5 rounded-2xl bg-[#1E8CFF] text-white font-bold uppercase tracking-widest text-sm"
              >
                ENCONTRAR MINHA SOLUÇÃO
              </Link>
              <Link 
                to="/parceiros" 
                onClick={closeMenu}
                className="block w-full text-center py-5 rounded-2xl border border-white/20 text-white font-bold uppercase tracking-widest text-sm"
              >
                QUERO SER PARCEIRO
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}