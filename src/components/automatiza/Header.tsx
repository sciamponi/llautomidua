import { Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import logoAsset from "@/assets/logo.png.asset.json";
import { PUBLIC_NAV } from "@/config/navigation";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getProducts } from "@/lib/products.functions";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const location = useLocation();
  const fetchProducts = useServerFn(getProducts);

  const { data: products = [] } = useQuery({
    queryKey: ['active-products'],
    queryFn: () => fetchProducts(),
  });

  const activeSaas = products.filter((p: any) => p.status === 'active' && p.type === 'SAAS');

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSolutionsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSolutionsOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[var(--z-header)] w-full border-b border-white/10 bg-[#071A2F]/90 backdrop-blur-lg">
      <div className="container flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoAsset.url} alt="Automatiza Solução" className="h-8 md:h-10 w-auto" />
          </Link>
          
          <nav className="hidden lg:flex gap-8 items-center">
            <div 
              className="relative group"
              onMouseEnter={() => setIsSolutionsOpen(true)}
              onMouseLeave={() => setIsSolutionsOpen(false)}
            >
              <button 
                className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors py-8 ${isSolutionsOpen ? 'text-white' : 'text-[#DCE3EA]/60 hover:text-white'}`}
                aria-expanded={isSolutionsOpen}
              >
                Soluções <ChevronDown className={`w-3 h-3 transition-transform ${isSolutionsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isSolutionsOpen && (
                  <>
                    {/* Backdrop */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/40 z-[-1] pointer-events-none"
                      onClick={() => setIsSolutionsOpen(false)}
                    />
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 w-[520px] bg-[#071A2F] border border-white/10 rounded-2xl shadow-2xl p-8 grid grid-cols-2 gap-10 z-[var(--z-mega-menu)]"
                    >
                      <div>
                        <h4 className="text-[9px] font-bold text-[#1E8CFF] uppercase tracking-[0.3em] mb-6">SaaS</h4>
                        <div className="space-y-4">
                          {activeSaas.map((p: any) => (
                            <Link 
                              key={p.slug}
                              to="/solucoes/$productSlug"
                              params={{ productSlug: p.slug }}
                              className="block text-sm font-medium text-[#DCE3EA]/60 hover:text-white transition-colors"
                            >
                              {p.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[9px] font-bold text-[#4CDFF2] uppercase tracking-[0.3em] mb-6">Serviços</h4>
                        <div className="space-y-4">
                          {PUBLIC_NAV.services.links.map(link => (
                            <Link 
                              key={link.href}
                              to={link.href as any}
                              className={`block text-sm font-medium transition-colors ${link.highlight ? 'text-[#1E8CFF] font-bold' : 'text-[#DCE3EA]/60 hover:text-white'}`}
                            >
                              {link.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {PUBLIC_NAV.company.map(link => (
              <Link 
                key={link.href}
                to={link.href as any} 
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#DCE3EA]/60 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/diagnostico" 
            className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-[#1E8CFF] transition-all px-4"
          >
            ENCONTRAR MINHA SOLUÇÃO
          </Link>
          <Link 
            to="/parceiros" 
            className="hidden lg:block rounded-xl bg-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#071A2F] hover:bg-[#F7F8FA] transition-all"
          >
            QUERO SER PARCEIRO
          </Link>

          <button 
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
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
            className="fixed inset-0 z-[var(--z-mobile-menu)] bg-[#071A2F] flex flex-col p-8 lg:hidden overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-12">
              <Link to="/">
                <img src={logoAsset.url} alt="Automatiza Solução" className="h-8 w-auto" />
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white">
                <X className="w-8 h-8" />
              </button>
            </div>

            <nav className="flex flex-col gap-10 text-2xl font-sora font-bold">
              <Link to="/">Início</Link>
              
              <div className="space-y-6">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#DCE3EA]/40">SaaS</p>
                <div className="grid grid-cols-1 gap-5 text-lg font-medium">
                  {activeSaas.map((p: any) => (
                    <Link key={p.slug} to="/solucoes/$productSlug" params={{ productSlug: p.slug }}>{p.name}</Link>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#DCE3EA]/40">Serviços</p>
                <div className="flex flex-col gap-5 text-lg font-medium">
                  {PUBLIC_NAV.services.links.map(link => (
                    <Link key={link.href} to={link.href as any}>{link.name}</Link>
                  ))}
                </div>
              </div>

              {PUBLIC_NAV.company.map(link => (
                <Link key={link.href} to={link.href as any}>{link.name}</Link>
              ))}
            </nav>

            <div className="mt-12 pt-12 border-t border-white/10 space-y-4">
              <Link 
                to="/diagnostico" 
                className="block w-full text-center py-5 rounded-2xl bg-[#1E8CFF] text-white font-bold uppercase tracking-widest text-sm"
              >
                ENCONTRAR MINHA SOLUÇÃO
              </Link>
              <Link 
                to="/parceiros" 
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
