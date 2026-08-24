import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { ClientHeader } from '@/components/cliente/ClientHeader'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/cliente')({
  component: ClientLayout,
})

function ClientLayout() {
  const location = useLocation()
  
  // O layout isolado do cliente não usa o header público institucional
  // mas tem seu próprio ClientHeader injetado aqui
  
  return (
    <div className="flex flex-col min-h-screen bg-[#071A2F]">
      <ClientHeader businessName="Portal do Cliente" />
      <main className="flex-grow pt-[var(--header-height)]">
        <Outlet />
      </main>
    </div>
  )
}
