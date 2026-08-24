import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sites/aprovacao/$token')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/sites/aprovacao/$token"!</div>
}
