import { createFileRoute } from '@tanstack/react-router'
import { ClientHeader } from '@/components/cliente/ClientHeader'

export const Route = createFileRoute('/cliente/sites/')({
  component: () => (
    <div className="min-h-screen bg-[#071A2F]">
      <ClientHeader businessName="Minha Empresa" />
      <main className="container px-4 pt-32">
        <h1 className="text-2xl font-bold text-white font-sora">Meus Sites</h1>
        <p className="text-[#DCE3EA]/60 mt-2">Em breve: a gestão completa do seu site aqui.</p>
      </main>
    </div>
  )
})
