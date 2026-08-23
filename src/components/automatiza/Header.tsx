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
          <nav className="hidden md:flex gap-6">
            {["Início", "A Automatiza", "Soluções", "Parceiros", "Área de Membros"].map((item) => (
              <a key={item} href="#" className="text-sm font-medium text-[#DCE3EA] hover:text-[#1E8CFF] transition-colors">
                {item}
              </a>
            ))}
          </nav>
        </div>
        <Link 
          to="/" 
          className="rounded-full bg-[#1E8CFF] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1E8CFF]/90 transition-all"
        >
          QUERO SER PARCEIRO
        </Link>
      </div>
    </header>
  );
}
