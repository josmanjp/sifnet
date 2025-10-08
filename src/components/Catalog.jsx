import React from 'react'
import Slider from 'react-slick'
import { useCart } from '../context/CartContext'
import { products } from '../utils/Products'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export default function Catalog(){
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
    <a href="/catalog" className="text-sm text-teal-600">Ver todo</a>
    </div>
    <Slider {...settings}>
    {products.map(p=> (
    <div key={p.id} className="p-4">
    <div className="bg-white p-4 rounded shadow">
    <img src={p.image} alt={p.title} className="mb-4" />
    <h4 className="font-semibold">{p.title}</h4>
    <p className="mt-2">${p.price}</p>
    <button onClick={()=> addToCart({...p, title: p.title})} className="mt-3 text-white px-4 py-2 rounded" style={{ backgroundColor: '#2f4870' }}>Agregar al carrito</button>
    </div>
    </div>
    ))}
    </Slider>
    </div>
    </section>
    )
}