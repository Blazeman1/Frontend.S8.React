import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// 1) Bootstrap instalado con npm: se importa primero para que nuestros estilos
//    propios (app.css) puedan sobrescribirlo cuando sea necesario.
import 'bootstrap/dist/css/bootstrap.min.css'
// 2) Estilos propios de la marca GameZone.
import './styles/app.css'

import App from './App.jsx'

// Punto de entrada de la aplicación: createRoot (API de React 18) monta el
// componente raíz <App /> dentro del <div id="root"> de index.html.
// StrictMode activa comprobaciones extra durante el desarrollo (por ejemplo,
// ejecuta dos veces los efectos al montar para detectar efectos sin limpieza).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
