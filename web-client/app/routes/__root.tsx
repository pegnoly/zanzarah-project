// app/routes/__root.tsx
import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import '@mantine/core/styles.css';
import { QueryClient } from '@tanstack/react-query'
import { MantineProvider } from "@mantine/core"
import mantineCssUrl from '@mantine/core/styles.css?url'

export const Route = createRootRouteWithContext<{queryClient: QueryClient}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [{ rel: 'stylesheet', href: mantineCssUrl }]
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <MantineProvider>
        <Outlet />
        <TanStackRouterDevtools/>
      </MantineProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}