import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'
import CSRFProtection from './utils/csrfProtection'
import TokenManager from './services/tokenManager'

// Initialize security features
CSRFProtection.initialize();

// Clean up expired tokens on app start
if (!TokenManager.isTokenValid()) {
  TokenManager.clearTokens();
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
