import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/logo.png.asset.json";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#071A2F] border-t border-white/5 py-20">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoAsset.url} alt="Automatiza Solução" className="h-10 w-auto" />
            </Link>
            <p className="text-[#DCE3EA]/60 text-sm leading-relaxed max-w-xs">
              Tecnologia especializada para problemas reais. Transformando o caos operacional em sistemas inteligentes de crescimento.
            </p>
          </div>

          {/* Solutions Column */}
          <div>
            <h4 className="text-white font-bold font-sora mb-6 text-sm uppercase tracking-widest">Soluções SaaS</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/solucoes/$productSlug" params={{ productSlug: "automacao" }} className="text-[#DCE3EA]/60 hover:text-[#1E8CFF] text-sm transition-colors">Automatiza (WhatsApp)</Link>
              </li>
              <li>
                <Link to="/solucoes/$productSlug" params={{ productSlug: "barberia" }} className="text-[#DCE3EA]/60 hover:text-[#1E8CFF] text-sm transition-colors">BarberIA</Link>
              </li>
              <li>
                <Link to="/solucoes/$productSlug" params={{ productSlug: "esmalteria" }} className="text-[#DCE3EA]/60 hover:text-[#1E8CFF] text-sm transition-colors">Esmaltter-IA</Link>
              </li>
              <li>
                <Link to="/solucoes/$productSlug" params={{ productSlug: "petflow" }} className="text-[#DCE3EA]/60 hover:text-[#1E8CFF] text-sm transition-colors">PetFlow</Link>
              </li>
              <li>
                <Link to="/solucoes/$productSlug" params={{ productSlug: "oficinas" }} className="text-[#DCE3EA]/60 hover:text-[#1E8CFF] text-sm transition-colors">Solução Oficinas</Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-white font-bold font-sora mb-6 text-sm uppercase tracking-widest">Serviços</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/sites" className="text-[#DCE3EA]/60 hover:text-[#1E8CFF] text-sm transition-colors">Sites Profissionais</Link>
              </li>
              <li>
                <Link to="/media-indoor" className="text-[#DCE3EA]/60 hover:text-[#1E8CFF] text-sm transition-colors">Media Indoor</Link>
              </li>
              <li>
                <Link to="/diagnostico" className="text-[#DCE3EA]/60 hover:text-[#1E8CFF] text-sm transition-colors">Diagnóstico Comercial</Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-white font-bold font-sora mb-6 text-sm uppercase tracking-widest">Empresa</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/parceiros" className="text-[#DCE3EA]/60 hover:text-[#1E8CFF] text-sm transition-colors">Programa de Parceiros</Link>
              </li>
              <li>
                <Link to="/membros" className="text-[#DCE3EA]/60 hover:text-[#1E8CFF] text-sm transition-colors">Área de Membros</Link>
              </li>
              <li>
                <a href="#" className="text-[#DCE3EA]/60 hover:text-[#1E8CFF] text-sm transition-colors">Falar com Especialista</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#DCE3EA]/40 text-xs text-center md:text-left">
            © {currentYear} Automatiza Solução. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[#DCE3EA]/40 hover:text-white text-xs transition-colors">Termos de Uso</a>
            <a href="#" className="text-[#DCE3EA]/40 hover:text-white text-xs transition-colors">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}