import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import logoAsset from "@/assets/logo.png.asset.json";
import { PUBLIC_NAV } from "@/config/navigation";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getProducts } from "@/lib/products.functions";
import { getSession, logout } from "@/lib/auth.functions";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const fetchProducts = useServerFn(getProducts);
  const fetchSession = useServerFn(getSession);
  const performLogout = useServerFn(logout);

  const { data: products = [] } = useQuery({
    queryKey: ['active-products'],
    queryFn: () => fetchProducts(),
  });

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: () => fetchSession(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const activeSaas = products.filter((p: any) => p.status === 'active' && p.type === 'SAAS');

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSolutionsOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSolutionsOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLogout = async () => {
    const result = await performLogout();
    if (result.success) {
      navigate({ to: (result.redirect as any) || '/login' });
    }
  };

  const getDashboardLink = () => {
    if (!session) return "/";
    const role = session.user.roles[0]?.role;
    if (['MASTER_ADMIN', 'ADMIN', 'OPERATOR'].includes(role)) return "/admin";
    if (role === 'PARTNER') return "/membros";
    if (role === 'CUSTOMER') return "/cliente";
    return "/";
  };

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
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/40 z-[-1] pointer-events-none"
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
          
          {session ? (
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-2 hover:bg-white/10 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-[#1E8CFF]/20 border border-[#1E8CFF]/30 flex items-center justify-center text-[#1E8CFF] text-[10px] font-bold">
                  {session.user.name?.[0] || 'U'}
                </div>
                <span className="hidden sm:inline text-[10px] font-bold text-white uppercase tracking-widest">
                  {session.user.name?.split(' ')[0] || 'Usuário'}
                </span>
                <ChevronDown className={`w-3 h-3 text-[#DCE3EA]/40 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-[#071A2F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[var(--z-mega-menu)]"
                  >
                    <div className="p-4 border-b border-white/5 bg-white/5">
                      <p className="text-xs font-bold text-white truncate">{session.user.name || 'Usuário'}</p>
                      <p className="text-[9px] text-[#DCE3EA]/40 uppercase tracking-widest mt-0.5">{session.user.roles[0]?.role}</p>
                    </div>
                    <div className="p-2">
                      <Link 
                        to={getDashboardLink() as any}
                        className="flex items-center gap-2 w-full px-3 py-2 text-[10px] font-bold text-[#DCE3EA]/60 hover:text-white hover:bg-white/5 rounded-lg transition-all uppercase tracking-widest"
                      >
                        <LayoutDashboard className="w-3 h-3" /> Dashboard
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 text-[10px] font-bold text-red-400 hover:text-red-300 hover:bg-red-400/5 rounded-lg transition-all uppercase tracking-widest"
                      >
                        <LogOut className="w-3 h-3" /> Sair
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="hidden lg:block rounded-xl bg-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#071A2F] hover:bg-[#F7F8FA] transition-all"
            >
              ÁREA DO CLIENTE
            </Link>
          )}

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
              {session ? (
                <>
                  <Link 
                    to={getDashboardLink() as any}
                    className="block w-full text-center py-5 rounded-2xl bg-[#1E8CFF] text-white font-bold uppercase tracking-widest text-sm"
                  >
                    DASHBOARD
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-center py-5 rounded-2xl border border-red-500/20 text-red-400 font-bold uppercase tracking-widest text-sm"
                  >
                    SAIR DA CONTA
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/diagnostico" 
                    className="block w-full text-center py-5 rounded-2xl bg-[#1E8CFF] text-white font-bold uppercase tracking-widest text-sm"
                  >
                    ENCONTRAR MINHA SOLUÇÃO
                  </Link>
                  <Link 
                    to="/login" 
                    className="block w-full text-center py-5 rounded-2xl border border-white/20 text-white font-bold uppercase tracking-widest text-sm"
                  >
                    ENTRAR NO PAINEL
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
