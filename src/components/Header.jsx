import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import LoginModal from './LoginModal'

export default function Header(){
    const { cart, getTotalItems } = useCart()
    const { user, isAuthenticated, login, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const totalItems = getTotalItems()
    const [isVisible, setIsVisible] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [loginModalOpen, setLoginModalOpen] = useState(false)
    const [configDropdownOpen, setConfigDropdownOpen] = useState(false)

    // Función para manejar navegación inteligente
    const handleNavClick = (e, sectionId) => {
        e.preventDefault()
        
        // Cerrar menú móvil
        setMobileMenuOpen(false)
        
        // Si no estamos en la homepage, navegar primero a home
        if (location.pathname !== '/') {
            navigate(`/#${sectionId}`)
        } else {
            // Si ya estamos en home, solo hacer scroll
            const element = document.getElementById(sectionId)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }

    const handleLoginClick = (e) => {
        e.preventDefault()
        setMobileMenuOpen(false)
        setLoginModalOpen(true)
    }

    const handleLogout = () => {
        logout()
        setMobileMenuOpen(false)
    }


    useEffect(() => {
        // Triggear la animación después de que el componente se monte
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 100)

        // Detectar scroll para cambiar el fondo
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50
            setScrolled(isScrolled)
        }

        // Manejar clic fuera del menú móvil y dropdown de configuración
        const handleClickOutside = (event) => {
            if (mobileMenuOpen && !event.target.closest('header')) {
                setMobileMenuOpen(false)
            }
            if (configDropdownOpen && !event.target.closest('.config-dropdown')) {
                setConfigDropdownOpen(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        document.addEventListener('click', handleClickOutside)
        
        return () => {
            clearTimeout(timer)
            window.removeEventListener('scroll', handleScroll)
            document.removeEventListener('click', handleClickOutside)
        }
    }, [mobileMenuOpen])

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-1000 ${
                isVisible 
                    ? 'translate-y-0 opacity-100 animate-bounce-in' 
                    : '-translate-y-full opacity-0'
            }`} 
            style={{ 
                background: scrolled ? 'rgba(47, 72, 112, 0.95)' : '#2f4870',
                backdropFilter: scrolled ? 'blur(10px)' : 'none',
                boxShadow: isVisible ? (scrolled ? '0 8px 30px rgba(47, 72, 112, 0.4)' : '0 4px 20px rgba(47, 72, 112, 0.3)') : 'none',
                transition: 'all 0.3s ease-in-out'
            }}
        >
            <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
                <Link 
                    to="/" 
                    className={`text-white font-bold text-xl flex items-center gap-3 transition-all duration-500 ${
                        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                    }`}
                    style={{ transitionDelay: '200ms' }}
                >
                    <img src="/assets/images/logopngmd.png" alt="logo" className="w-10 h-10 md:w-12 md:h-12 rounded" />
                    <span className="hidden sm:inline">SIFnet</span>
                    <span className="sm:hidden">SIFnet</span>
                </Link>

                {/* Botón hamburguesa para móvil */}
                <div className="md:hidden flex items-center gap-3">
                    {/* Carrito móvil */}
                    <Link to="/car" className="relative text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0L17 21" />
                        </svg>
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full text-xs px-1.5 animate-pulse">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                    
                    {/* Botón hamburguesa */}
                    <button 
                        className="text-white text-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 rounded transition-transform duration-200"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-menu"
                        style={{ transform: mobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                    >
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Navegación desktop */}
                <nav 
                    className={`hidden md:flex items-center gap-4 transition-all duration-500 ${
                        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                    }`}
                    style={{ transitionDelay: '400ms' }}
                    role="navigation"
                    aria-label="Navegación principal"
                > 
                    <a href="#top" onClick={(e) => handleNavClick(e, 'top')} className="text-white hover:text-blue-200 transition-colors duration-300 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2 py-1" aria-label="Ir a inicio">Inicio</a>
                    <a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="text-white hover:text-blue-200 transition-colors duration-300 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2 py-1" aria-label="Ir a estudios">Estudios</a>
                    <a href="#products" onClick={(e) => handleNavClick(e, 'products')} className="text-white hover:text-blue-200 transition-colors duration-300 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2 py-1" aria-label="Ir a catálogo">Catálogo</a>
                    <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="text-white hover:text-blue-200 transition-colors duration-300 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2 py-1" aria-label="Ir a contacto">Contacto</a>
                    <Link to="/catalog" className="text-white hover:text-blue-200 transition-colors duration-300 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2 py-1" aria-label="Ver catálogo completo">Ver todo</Link>
                    
                    {isAuthenticated() ? (
                        <div className="flex items-center gap-4">
                            <span className="text-white text-sm">Hola, {user?.nombre}</span>
                            
                            {/* Ícono de configuración solo para Admin Sistema */}
                            {user?.tipo === "Adm. Sistema" && (
                                <div className="relative config-dropdown">
                                    <button
                                        onClick={() => setConfigDropdownOpen(!configDropdownOpen)}
                                        className="text-white hover:text-blue-200 transition-all duration-300 hover:scale-110 transform p-1 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                                        aria-label="Menú de configuración de administrador"
                                        aria-expanded={configDropdownOpen}
                                        aria-haspopup="true"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>
                                    
                                    {/* Dropdown menu */}
                                    {configDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50" role="menu" aria-label="Opciones de administración">
                                            <Link
                                                to="/admin/productos"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:bg-gray-100"
                                                onClick={() => setConfigDropdownOpen(false)}
                                                role="menuitem"
                                                aria-label="Administrar productos"
                                            >
                                                📦 Adm. Productos
                                            </Link>
                                            <Link
                                                to="/admin/categorias"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:bg-gray-100"
                                                onClick={() => setConfigDropdownOpen(false)}
                                                role="menuitem"
                                                aria-label="Administrar categorías"
                                            >
                                                📂 Adm. Categorías
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            <button 
                                onClick={handleLogout}
                                className="text-white hover:text-blue-200 transition-colors duration-300 hover:scale-105 transform"
                            >
                                Salir
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={handleLoginClick}
                            className="text-white hover:text-blue-200 transition-colors duration-300 hover:scale-105 transform"
                        >
                            Ingresar
                        </button>
                    )}
                    
                    <Link to="/car" className="relative text-white hover:text-blue-200 transition-all duration-300 hover:scale-110 transform">
                        <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0L17 21" />
                        </svg>
                        {totalItems>0 && (
                            <span className="absolute -top-1 -right-2 md:-top-2 md:-right-3 bg-red-600 text-white rounded-full text-xs px-1.5 md:px-2 animate-pulse">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </nav>
            </div>

            {/* Navegación móvil */}
            <div className={`md:hidden transition-all duration-300 overflow-hidden ${
                mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
                <nav className="px-4 py-2 space-y-2" style={{ 
                    background: 'rgba(47, 72, 112, 0.98)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <a 
                        href="#top" 
                        onClick={(e) => handleNavClick(e, 'top')} 
                        className="block text-white hover:text-blue-200 transition-colors duration-300 py-2 border-b border-blue-800/30"
                    >
                        🏠 Inicio
                    </a>
                    <a 
                        href="#features" 
                        onClick={(e) => handleNavClick(e, 'features')} 
                        className="block text-white hover:text-blue-200 transition-colors duration-300 py-2 border-b border-blue-800/30"
                    >
                        📚 Estudios
                    </a>
                    <a 
                        href="#products" 
                        onClick={(e) => handleNavClick(e, 'products')} 
                        className="block text-white hover:text-blue-200 transition-colors duration-300 py-2 border-b border-blue-800/30"
                    >
                        📋 Catalogo
                    </a>
                    <a 
                        href="#contact" 
                        onClick={(e) => handleNavClick(e, 'contact')} 
                        className="block text-white hover:text-blue-200 transition-colors duration-300 py-2 border-b border-blue-800/30"
                    >
                        📞 Contacto
                    </a>
                    <Link 
                        to="/catalog" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-white hover:text-blue-200 transition-colors duration-300 py-2 border-b border-blue-800/30"
                    >
                        🔍 Ver todo
                    </Link>
                    
                    {isAuthenticated() ? (
                        <>
                            <div className="py-2 border-b border-blue-800/30">
                                <span className="text-white text-sm">👤 Hola, {user?.nombre}</span>
                            </div>
                            
                            {/* Opciones de configuración para Admin Sistema en móvil */}
                            {user?.tipo === "Adm. Sistema" && (
                                <>
                                    <Link
                                        to="/admin/categorias"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block text-white hover:text-blue-200 transition-colors duration-300 py-2 border-b border-blue-800/30"
                                    >
                                        📂 Adm. Categorías
                                    </Link>

                                    <Link
                                        to="/admin/productos"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block text-white hover:text-blue-200 transition-colors duration-300 py-2 border-b border-blue-800/30"
                                    >
                                        📦 Adm. Productos
                                    </Link>
                                </>
                            )}
                            
                            <button 
                                onClick={handleLogout}
                                className="block w-full text-left text-white hover:text-blue-200 transition-colors duration-300 py-2 border-b border-blue-800/30"
                            >
                                🚪 Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={handleLoginClick}
                            className="block w-full text-left text-white hover:text-blue-200 transition-colors duration-300 py-2 border-b border-blue-800/30"
                        >
                            🔐 Iniciar Sesión
                        </button>
                    )}
                    
                    <Link 
                        to="/car" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between text-white hover:text-blue-200 transition-colors duration-300 py-2"
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0L17 21" />
                            </svg>
                            Carrito
                        </span>
                        {totalItems > 0 && (
                            <span className="bg-red-600 text-white rounded-full text-xs px-2 py-1 animate-pulse">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </nav>
            </div>

            {/* Modal de Login */}
            <LoginModal 
                isOpen={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
            />
        </header>
    )
}