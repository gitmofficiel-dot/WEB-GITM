import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Handle Vite dynamic import errors (e.g. after a new deployment)
window.addEventListener('vite:preloadError', () => {
  window.location.reload()
})
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
)
