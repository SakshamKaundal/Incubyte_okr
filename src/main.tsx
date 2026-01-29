import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import OKRFrom from './OKRFrom.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OKRFrom />
  </StrictMode>,
)
