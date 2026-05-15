import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apidoc')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/api"!</div>
}
