import { useState } from "react";
import { RobotMessage } from "./RobotMessage";

export function PartnerSignup() {
  const [submitted, setSubmitted] = useState(false);
  
  if (submitted) {
    return (
      <section className="py-24 bg-[#071A2F]">
        <div className="container px-4 max-w-xl mx-auto">
          <RobotMessage 
            type="success" 
            message="Cadastro recebido! 🤖🚀 Agora é só acompanhar os próximos passos."
            className="w-full justify-center py-12"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-[#071A2F]">
      <div className="container px-4">
        <div className="max-w-2xl mx-auto bg-white/5 p-8 md:p-12 rounded-[2rem] border border-white/10">
          <h2 className="text-3xl font-bold text-white font-sora mb-8 text-center">Entre para o Programa</h2>
          <form className="grid gap-6" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#DCE3EA]">Nome</label>
                <input required type="text" className="w-full bg-[#071A2F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#1E8CFF] outline-none" placeholder="Seu nome" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#DCE3EA]">E-mail</label>
                <input required type="email" className="w-full bg-[#071A2F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#1E8CFF] outline-none" placeholder="seu@email.com" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#DCE3EA]">WhatsApp</label>
                <input required type="tel" className="w-full bg-[#071A2F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#1E8CFF] outline-none" placeholder="(00) 00000-0000" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#DCE3EA]">Nome da empresa</label>
                <input required type="text" className="w-full bg-[#071A2F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#1E8CFF] outline-none" placeholder="Sua empresa" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#DCE3EA]">Cidade</label>
                <input required type="text" className="w-full bg-[#071A2F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#1E8CFF] outline-none" placeholder="Sua cidade" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#DCE3EA]">Como conheceu a Automatiza?</label>
                <select className="w-full bg-[#071A2F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#1E8CFF] outline-none appearance-none">
                  <option>Indicação</option>
                  <option>Redes Sociais</option>
                  <option>Google</option>
                  <option>Outros</option>
                </select>
              </div>
            </div>
            <button type="submit" className="mt-4 w-full bg-[#1E8CFF] text-white py-4 rounded-xl font-bold hover:bg-[#1E8CFF]/90 transition-all uppercase tracking-wider">
              QUERO ENTRAR PARA O PROGRAMA
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
