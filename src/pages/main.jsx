import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import ComponentsPreview from './ComponentsPreview'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ComponentsPreview />
  </StrictMode>,
)
