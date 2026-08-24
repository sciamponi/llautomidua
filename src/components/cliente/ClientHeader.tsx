import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import logoAsset from "@/assets/logo.png.asset.json";
import { LogOut, Globe, MessageSquare, ShieldCheck } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { logout } from "@/lib/auth.functions";

interface ClientHeaderProps {
  businessName: string;
}

export function ClientHeader({ businessName }: ClientHeaderProps) {
  const navigate = useNavigate();
  const performLogout = useServerFn(logout);

  const handleLogout = async () => {
    const result = await performLogout();
    if (result.success) {
      navigate({ to: (result.redirect as any) || '/login' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[var(--z-header)] w-full border-b border-white/10 bg-[#071A2F]/90 backdrop-blur-lg">
      <div className="container flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoAsset.url} alt="Automatiza Solução" className="h-8 md:h-10 w-auto" />
          </Link>
          
          <div className="hidden md:flex flex-col">
            <span className="text-[10px] font-bold text-[#1E8CFF] uppercase tracking-[0.2em]">Painel do Cliente</span>
            <span className="text-sm font-bold text-white font-sora">{businessName}</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          <Link 
            to="/cliente/sites" 
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#DCE3EA]/60 hover:text-white transition-colors"
          >
            <Globe className="w-3 h-3" /> Meu Site
          </Link>
          <Link 
            to="/solucoes" 
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#DCE3EA]/60 hover:text-white transition-colors"
          >
            <ShieldCheck className="w-3 h-3" /> Soluções
          </Link>
          <a 
            href="https://wa.me/5500000000000" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#DCE3EA]/60 hover:text-white transition-colors"
          >
            <MessageSquare className="w-3 h-3" /> Suporte
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all"
          >
            <LogOut className="w-3 h-3 text-red-400" /> Sair
          </button>
        </div>
      </div>
    </header>
  );
}
