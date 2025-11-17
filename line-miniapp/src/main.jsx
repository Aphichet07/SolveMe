import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Header from './components/header.jsx'
import Footer from './components/footer.jsx'
import Home from './pages/Home.jsx'
import LoadingPage from './pages/loading.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingPage/>
  </StrictMode>,
)
