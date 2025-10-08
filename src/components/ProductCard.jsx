import React from 'react'
import { useCart } from '../context/CartContext'


export default function ProductCard({ product }){
const { addToCart } = useCart()
    return (
        <div className="bg-white p-4 rounded shadow">
            <img src={product.image} alt={product.title} className="mb-4" />
            <h4 className="font-semibold">{product.title}</h4>
            <p className="mt-2">${product.price}</p>
            <div className="mt-3 flex gap-2">
                <button onClick={()=> addToCart({...product, title: product.title})} className="mt-3 text-white px-4 py-2 rounded" style={{ backgroundColor: '#2f4870' }}>Agregar</button>
                <button onClick={() => window.location.href = `/product/${product.id}`} className="mt-3 text-white px-4 py-2 rounded" style={{ backgroundColor: '#a2caf1ff', color: '#2f4870' }}>Ver</button>
            </div>
        </div>
    )
}