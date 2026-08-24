import { createFileRoute } from '@tanstack/react-router'
import { DiagnosticQuiz } from '@/components/automatiza/quiz/DiagnosticQuiz'

export const Route = createFileRoute('/diagnostico/')({
  component: () => (
    <div className="bg-[#071A2F] font-inter text-[#DCE3EA]">
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
    </div>
  )
})

