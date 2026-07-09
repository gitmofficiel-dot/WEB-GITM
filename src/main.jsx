import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Handle Vite dynamic import errors (e.g. after a new deployment)
window.addEventListener('vite:preloadError', () => {
  window.location.reload()
})
import { BrowserRouter } from 'react-router-dom'
import posthog from 'posthog-js'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'

// Initialize PostHog for Analytics and Heatmaps only if key is present
if (import.meta.env.VITE_POSTHOG_KEY && import.meta.env.VITE_POSTHOG_KEY !== 'phc_dummy_key_replace_me') {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
    autocapture: false, // Turn off locally to prevent noise, enable when deploying
    capture_pageview: false // We will handle this in App.jsx if needed, or just let PostHog handle it
  });
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
)
