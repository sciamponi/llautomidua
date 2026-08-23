import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/logo.png.asset.json";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#071A2F]/90 backdrop-blur-lg">
      <div className="container flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoAsset.url} alt="Automatiza Solução" className="h-10 w-auto" />
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link to="/" className="text-xs font-bold uppercase tracking-widest text-[#DCE3EA]/60 hover:text-white transition-colors">Início</Link>
            <Link to="/solucoes" className="text-xs font-bold uppercase tracking-widest text-[#DCE3EA]/60 hover:text-white transition-colors">Soluções</Link>
            <Link to="/parceiros" className="text-xs font-bold uppercase tracking-widest text-[#DCE3EA]/60 hover:text-white transition-colors">Parceiros</Link>
            <Link to="/membros" className="text-xs font-bold uppercase tracking-widest text-[#DCE3EA]/60 hover:text-white transition-colors">Área de Membros</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/diagnostico" 
            className="hidden sm:block text-xs font-bold uppercase tracking-widest text-[#1E8CFF] hover:text-[#1E8CFF]/80 transition-all mr-4"
          >
            Fazer Diagnóstico
          </Link>
          <Link 
            to="/parceiros" 
            className="rounded-xl bg-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#071A2F] hover:bg-[#F7F8FA] transition-all"
          >
            QUERO SER PARCEIRO
          </Link>
        </div>
      </div>
    </header>
  );
}
