import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Import Fonts for v1.3
import '@fontsource/poppins'
import '@fontsource/playfair-display'
import '@fontsource/fira-code'
import '@fontsource/lora'
import 'katex/dist/katex.min.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
