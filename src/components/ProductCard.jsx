import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }){
    const { addToCart } = useCart()
    const navigate = useNavigate()
    
    return (
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
            <div className="w-full h-48 mb-4 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center p-2">
                <img 
                    src={product.url_imagen || product.image} 
                    alt={product.nombre || product.title} 
                    className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300" 
                />
            </div>
            
            <div className="flex-grow">
                <h4 className="font-semibold text-gray-900 mb-2">{product.nombre || product.title}</h4>
                <p className="text-lg font-bold text-gray-800 mb-2">
                    ${parseFloat(product.precio || product.price || 0).toLocaleString()}
                </p>
                
                {(product.descripcion || product.description) && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                        {product.descripcion || product.description}
                    </p>
                )}
                
                {(product.categoria || product.category) && (
                    <div className="mb-3">
                        <span className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                            {product.categoria || product.category}
                        </span>
                    </div>
                )}
            </div>
            
            <div className="flex gap-2 mt-4">
                <button 
                    onClick={() => addToCart({
                        ...product, 
                        title: product.nombre || product.title,
                        name: product.nombre || product.title,
                        price: product.precio || product.price || 0
                    })} 
                    className="flex-1 text-white px-4 py-2 rounded-lg font-medium hover:shadow-md transition-all duration-200"
                    style={{ backgroundColor: '#2f4870' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#243a5e'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#2f4870'}
                >
                    Agregar
                </button>
                <button 
                    onClick={() => navigate(`/product/${product.id}`)} 
                    className="flex-1 px-4 py-2 rounded-lg font-medium border-2 transition-all duration-200"
                    style={{ 
                        borderColor: '#2f4870', 
                        color: '#2f4870',
                        backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#2f4870'
                        e.target.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent'
                        e.target.style.color = '#2f4870'
                    }}
                >
                    Ver
                </button>
            </div>
        </div>
    )
}