import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import NoidungProvider from './context/noidung.jsx'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <NoidungProvider>
    <App />
    </NoidungProvider>
    </BrowserRouter>
 
)
