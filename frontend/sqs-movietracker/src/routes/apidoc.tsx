import { ClientOnly, createFileRoute } from '@tanstack/react-router'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

export const Route = createFileRoute('/apidoc')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ClientOnly>
      <SwaggerUI
        url="/api/openapi.json"
        tryItOutEnabled={false}
      />
    </ClientOnly>
  )
}