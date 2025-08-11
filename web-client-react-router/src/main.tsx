import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css'
import '@mantine/notifications/styles.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorSchemeScript/>
      <BrowserRouter>
        <MantineProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </MantineProvider>
      </BrowserRouter>
  </StrictMode>
)
