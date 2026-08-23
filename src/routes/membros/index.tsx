import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/automatiza/Header'

export const Route = createFileRoute('/membros/')({
  component: () => (
    <div className="min-h-screen bg-[#071A2F] font-inter text-[#DCE3EA]">
      <Header />
      <main className="container px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-white mb-6 font-sora">Área de Membros</h1>
        <p>Acesse seus treinamentos e ferramentas.</p>
      </main>
    </div>
  )
})
