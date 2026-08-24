import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/sites/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/sites/"!</div>
}
