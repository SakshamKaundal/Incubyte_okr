import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import KeyResultProvider from "./contexts/KeyResultProvider.tsx";
import Home from "@/Home.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <KeyResultProvider>
            <Home/>
        </KeyResultProvider>
    </StrictMode>,
)
