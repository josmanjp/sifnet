import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CatalogoPage from './pages/CatalogPage'
import CarPage from './pages/CarPage'
import ProductPage from './pages/ProductPage'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'sonner';

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
  <AuthProvider>
    <CartProvider>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogoPage />} />
        <Route path="/car" element={<CarPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
      <Toaster richColors position="bottom-center" />
    </CartProvider>
  </AuthProvider>
)
}