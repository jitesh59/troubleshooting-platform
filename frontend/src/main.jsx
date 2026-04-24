import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1d21',
            color: '#d7dadc',
            border: '1px solid #2a2e32',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#46d160', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ea0027', secondary: '#fff' },
          },
        }}
      />
    </AuthProvider>
  </StrictMode>,
)
