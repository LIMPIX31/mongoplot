import React                   from 'react'
import { StrictMode }          from 'react'

import                              'reactflow/dist/style.css'

import { QueryClient }         from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { App }                 from 'app/index.js'
import { createRoot }          from 'react-dom/client'
import { BrowserRouter }       from 'react-router-dom'
import { Routes }              from 'react-router-dom'
import { Route }               from 'react-router-dom'
import { ThemeProvider }       from 'theme/provider/index.js'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route index element={<span>Error</span>} />
            <Route path='/:uri' element={<App />} />
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
