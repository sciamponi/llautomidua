import { createFileRoute, Outlet, useLocation, redirect } from '@tanstack/react-router'
import { ClientHeader } from '@/components/cliente/ClientHeader'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/cliente')({
  beforeLoad: async ({ context }) => {
    const session = context.session;
    
    if (!session) {
      throw redirect({ to: '/login', search: { redirect: '/cliente' } });
    }

    const hasClientRole = session.user.roles.some((r: any) => 
      ['CUSTOMER', 'MASTER_ADMIN', 'ADMIN'].includes(r.role)
    );

    if (!hasClientRole) {
      throw redirect({ to: '/' });
    }
  },
  component: ClientLayout,
})

function ClientLayout() {
  const { session } = Route.useRouteContext();
  
  return (
    <div className="flex flex-col min-h-screen bg-[#071A2F]">
      <ClientHeader businessName={session?.user.name || "Portal do Cliente"} />
      <main className="flex-grow pt-[var(--header-height)]">
        <Outlet />
      </main>
    </div>
  )
}
