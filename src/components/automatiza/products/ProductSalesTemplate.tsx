import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductSalesTemplateProps {
  name: string;
  category: string;
  heroHeadline: string;
  heroSubheadline: string;
  problemHeadline: string;
  problems: string[];
  solutions: string[];
  features: { title: string; desc: string }[];
  price: string;
  priceNote?: string;
}

export function ProductSalesTemplate({
  name,
  category,
  heroHeadline,
  heroSubheadline,
  problemHeadline,
  problems,
  solutions,
  features,
  price,
  priceNote
}: ProductSalesTemplateProps) {
  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative pt-20 overflow-hidden">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#1E8CFF]/10 border border-[#1E8CFF]/20 text-[#1E8CFF] text-xs font-bold uppercase tracking-widest">
              {category}
            </span>
            <h1 className="text-4xl md:text-7xl font-bold text-white font-sora leading-tight">
              {heroHeadline}
            </h1>
            <p className="text-lg md:text-xl text-[#DCE3EA]/80 max-w-2xl mx-auto leading-relaxed">
              {heroSubheadline}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
              <button className="bg-[#1E8CFF] text-white px-10 py-5 rounded-2xl font-bold hover:bg-[#1E8CFF]/90 transition-all shadow-xl shadow-[#1E8CFF]/20">
                COMEÇAR AGORA
              </button>
              <button className="border border-white/20 text-white px-10 py-5 rounded-2xl font-bold hover:bg-white/5 transition-all">
                FALAR COM CONSULTOR
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Comparison */}
      <section className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-sora">{problemHeadline}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-10 rounded-[2.5rem] bg-red-950/10 border border-red-500/10 relative overflow-hidden group">
            <h3 className="text-xl font-bold text-white mb-8 font-sora flex items-center gap-3">
              <span className="p-2 rounded-lg bg-red-500/10 text-red-500">✕</span> O Problema
            </h3>
            <ul className="space-y-5">
              {problems.map((p, i) => (
                <li key={i} className="text-[#DCE3EA]/70 flex items-start gap-3">
                  <span className="text-red-500 mt-1.5">•</span> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-10 rounded-[2.5rem] bg-[#1E8CFF]/5 border border-[#1E8CFF]/10 relative overflow-hidden group">
            <h3 className="text-xl font-bold text-white mb-8 font-sora flex items-center gap-3">
              <span className="p-2 rounded-lg bg-[#4CDFF2]/10 text-[#4CDFF2]">✓</span> A Solução {name}
            </h3>
            <ul className="space-y-5">
              {solutions.map((s, i) => (
                <li key={i} className="text-[#DCE3EA] flex items-start gap-3 font-medium">
                  <span className="text-[#4CDFF2] mt-1.5">•</span> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white/[0.02] py-32 border-y border-white/5">
        <div className="container px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white font-sora mb-6">Funcionalidades Prontas</h2>
            <p className="text-[#DCE3EA]/60 max-w-xl mx-auto">Tudo o que você precisa para sair do manual e escalar sua operação.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#1E8CFF]/30 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-[#1E8CFF]/10 flex items-center justify-center text-[#1E8CFF] mb-6 group-hover:bg-[#1E8CFF] group-hover:text-white transition-all">
                  ⚡
                </div>
                <h4 className="text-xl font-bold text-white mb-4">{f.title}</h4>
                <p className="text-[#DCE3EA]/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-white/10 to-transparent p-1 px-1 rounded-[3rem]">
          <div className="bg-[#071A2F] p-12 md:p-20 rounded-[2.9rem] text-center space-y-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white font-sora">Invista no seu Crescimento</h2>
            <div className="space-y-4">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-bold text-white font-sora">{price}</span>
                <span className="text-xl text-[#DCE3EA]/40">/mês</span>
              </div>
              {priceNote && <p className="text-[#DCE3EA]/60">{priceNote}</p>}
            </div>
            <button className="w-full max-w-md bg-[#1E8CFF] text-white py-6 rounded-2xl font-bold text-xl hover:bg-[#1E8CFF]/90 transition-all shadow-2xl shadow-[#1E8CFF]/20">
              CONTRATAR AGORA
            </button>
            <p className="text-xs text-[#DCE3EA]/40">Sem fidelidade. Cancele quando quiser.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
