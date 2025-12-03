import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import { useCart } from '../context/CartContext'
import {fetchProducts} from '../utils/api'
import { formatPrice } from '../utils/currency'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css' 

export default function Catalog(){
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isMobile, setIsMobile] = useState(false)

    // Detectar si es móvil al cargar
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        
        checkMobile()
        window.addEventListener('resize', checkMobile)
        
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const data = await fetchProducts()
            setProducts(data)
            setIsLoading(false)
        }
        fetchData()
    }, [])

    const { addToCart } = useCart()
    
    // Configuración dinámica basada en el estado móvil
    const settings = {
        dots: true,
        infinite: products.length > 1,
        speed: 500,
        slidesToShow: isMobile ? 1 : 3,
        slidesToScroll: 1,
        autoplay: products.length > 1,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        centerMode: isMobile,
        centerPadding: isMobile ? '20px' : '0px',
        arrows: !isMobile || products.length > 1,
        responsive: [
            { 
                breakpoint: 1024, 
                settings: { 
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    dots: true,
                    centerMode: false
                }
            },
            { 
                breakpoint: 768, 
                settings: { 
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    centerMode: true,
                    centerPadding: '40px'
                }
            },
            { 
                breakpoint: 480, 
                settings: { 
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: products.length > 1,
                    arrows: false,
                    centerMode: true,
                    centerPadding: '20px'
                }
            }
        ]
    }

    // Mostrar loading mientras se cargan productos y se detecta el estado móvil
    if (isLoading) {
        return (
            <section id="products" className="py-8 md:py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 md:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                        <h3 className="text-2xl md:text-3xl font-bold">Productos y Servicios</h3>
                        <Link to="/catalog" className="text-sm hover:underline" style={{ color: '#2f4870' }}>Ver todo →</Link>
                    </div>
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section id="products" className="py-8 md:py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                    <h3 className="text-2xl md:text-3xl font-bold">Productos y Servicios</h3>
                    <Link to="/catalog" className="text-sm hover:underline" style={{ color: '#2f4870' }}>Ver todo →</Link>
                </div>
                <div className="relative">
                    <Slider {...settings}>
                        {products.map(p=> (
                            <div key={p.id} className="px-2 md:p-4">
                                <div className="bg-white p-3 md:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col mx-2 md:mx-0">
                                    <div className="w-full h-40 md:h-48 mb-3 md:mb-4 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center p-2">
                                        <img 
                                            src={p.image_url} 
                                            alt={p.nombre} 
                                            className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300" 
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base line-clamp-2">
                                            {p.nombre}
                                        </h4>
                                        <p className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                                            {formatPrice(p.precio)}
                                        </p>
                                        {p.descripcion && (
                                            <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">
                                                {p.descripcion}
                                            </p>
                                        )}
                                    </div>
                                    <button 
                                        onClick={()=> addToCart({...p, title: p.nombre, price: p.precio})} 
                                        className="mt-2 md:mt-4 w-full text-white px-3 md:px-4 py-2 rounded-lg font-medium hover:shadow-md transition-all duration-200 text-sm md:text-base active:scale-95 touch-manipulation" 
                                        style={{ backgroundColor: '#2f4870' }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#243a5e'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#2f4870'}
                                    >
                                        🛒 Agregar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    )
}