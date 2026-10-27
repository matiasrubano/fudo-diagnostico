import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// El HTML de producción trae la home prerenderizada dentro de #root (para crawlers sin JS);
// al montar React, se reemplaza por la app real.
createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
