import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import { DeploymentsPanel } from './components/Panels/DeploymentsPanel.tsx'
import { CommitsTable } from './components/Tables/CommitsTable.tsx'
import { customTheme } from './themes/customTheme.tsx'
import { Flowbite } from 'flowbite-react'
import { DefaultNavBar } from './components/Dashboard.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const client = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Flowbite theme={{ theme: customTheme}}>
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </Flowbite>
  </React.StrictMode>,
)
