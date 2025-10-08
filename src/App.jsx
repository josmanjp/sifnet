import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CatalogoPage from './pages/CatalogPage'
import CarPage from './pages/CarPage'
import { CartProvider } from './context/CartContext'

// Componente para manejar el scroll automático
function ScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const timer = setTimeout(() => {
        const sectionId = location.hash.replace('#', '')
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 300)
      
      return () => clearTimeout(timer)
    }
  }, [location])

  return null
}

export default function App(){
return (
<CartProvider>
  <ScrollToHash />
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/catalog" element={<CatalogoPage />} />
    <Route path="/car" element={<CarPage />} />
  </Routes>
</CartProvider>
)
}