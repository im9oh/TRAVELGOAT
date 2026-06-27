import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StoreProvider } from './store.tsx'
import { RewardProvider } from './components/toast.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <RewardProvider>
        <App />
      </RewardProvider>
    </StoreProvider>
  </StrictMode>,
)
