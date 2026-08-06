import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppRouter } from './router'
import { AuthProvider } from './components/auth/authContexts'
import { ToastProvider } from './components/ToastProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
)

