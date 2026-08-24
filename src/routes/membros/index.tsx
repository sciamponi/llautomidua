import { createFileRoute, redirect, Link, Outlet } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/membros/')({
  beforeLoad: async ({ context }) => {
    const session = context.session;
    
    if (!session) {
      throw redirect({ to: '/login', search: { redirect: '/membros' } });
    }

    const hasPartnerRole = session.user.roles.some((r: any) => 
      ['PARTNER', 'MASTER_ADMIN', 'ADMIN'].includes(r.role)
    );

    if (!hasPartnerRole) {
      throw redirect({ to: '/' });
    }
  },
  component: MembersLayout
})

function MembersLayout() {
  return (
    <div className="bg-[#071A2F] font-inter text-[#DCE3EA] min-h-screen">
      <main className="container px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
