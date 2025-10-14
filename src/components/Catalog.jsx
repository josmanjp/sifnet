import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import { useCart } from '../context/CartContext'
import {fetchProducts} from '../utils/api'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export default function Catalog(){
    const [products, setProducts] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchProducts()
            setProducts(data)
        }
        fetchData()
    }, [])

    const { addToCart } = useCart()
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
             { breakpoint: 1024, settings: { slidesToShow: 2 }},
             { breakpoint: 640, settings: { slidesToShow: 1 }}
        ]
    }
    return (
        <section id="products" className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-3xl font-bold">Productos y Servicios</h3>
                    <a href="/catalog" className="text-sm" style={{ color: '#2f4870' }}>Ver todo</a>
                </div>
                <Slider {...settings}>
                    {products.map(p=> (
                        <div key={p.id} className="p-4">
                            <div className="bg-white p-4 rounded shadow h-full flex flex-col">
                                <div className="w-full h-48 mb-4 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center p-2">
                                    <img 
                                        src={p.url_imagen} 
                                        alt={p.nombre} 
                                        className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300" 
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-semibold text-gray-900 mb-2">{p.nombre}</h4>
                                    <p className="text-lg font-bold text-gray-800">${p.precio}</p>
                                </div>
                                <button 
                                    onClick={()=> addToCart({...p, title: p.nombre, price: p.precio})} 
                                    className="mt-4 w-full text-white px-4 py-2 rounded-lg font-medium hover:shadow-md transition-all duration-200" 
                                    style={{ backgroundColor: '#2f4870' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#243a5e'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#2f4870'}
                                >
                                    Agregar al carrito
                                </button>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    )
}