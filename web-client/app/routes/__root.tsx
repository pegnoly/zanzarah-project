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
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';

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
    links: [
      { rel: 'stylesheet', href: mantineCssUrl },
      { rel: 'preconnect', href: "https://fonts.googleapis.com"},
      { rel: 'preconnect', href: "https://fonts.gstatic.com", crossOrigin: 'true'},
      { rel: 'stylesheet', href: "https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&family=Yanone+Kaffeesatz:wght@200..700&family=Ysabeau+SC:wght@1..1000&display=swap"}
    ]
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <MantineProvider>
        <Notifications/>
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