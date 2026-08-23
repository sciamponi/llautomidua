import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/automatiza/Header'
import { DiagnosticQuiz } from '@/components/automatiza/quiz/DiagnosticQuiz'

export const Route = createFileRoute('/diagnostico/')({
  component: () => (
    <div className="min-h-screen bg-[#071A2F] font-inter text-[#DCE3EA]">
      <Header />
      <main className="container px-4 py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-sora mb-6">
            Qual solução Automatiza combina com sua empresa?
          </h1>
          <p className="text-lg text-[#DCE3EA]/70">
            Responda 4 perguntas rápidas e receba uma recomendação baseada na sua necessidade real.
          </p>
        </div>
        
        <DiagnosticQuiz />
      </main>

      <footer className="py-12 border-t border-white/10 mt-20">
        <div className="container px-4 text-center">
          <p className="text-[#DCE3EA]/40 text-sm">© 2026 Automatiza Solução. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
})
