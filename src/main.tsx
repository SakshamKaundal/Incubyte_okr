import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import OKRFrom from './OKRFrom.tsx'
import KeyResultProvider from "./contexts/KeyResultProvider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <KeyResultProvider>
          <OKRFrom />
      </KeyResultProvider>
  </StrictMode>,

)
