import React from 'react'
import { useCart } from '../context/CartContext'
import { sendOrderToAPI } from '../utils/api'
export default function Cart(){
    const { cart, removeFromCart, clearCart, updateQuantity, getTotalPrice, getFormattedTotal } = useCart()
    const total = getTotalPrice()
    const handlePayNow = async () => {
        // Ejemplo: enviar pedido a API (si existe)
        const order = { items: cart, total, createdAt: new Date().toISOString() }
        const res = await sendOrderToAPI(order)
        if (res?.ok) {
            // Abrir WhatsApp con mensaje preformateado como opción de pago inmediato
            const text = encodeURIComponent(`Hola, quiero comprar estos productos. Total: ${getFormattedTotal()}. Items: ${cart.map(i=>i.nombre || i.name).join(', ')}`)
            window.open(`https://wa.me/5491123558308?text=${text}`, '_blank')
            clearCart()
        } else {
            alert('Error al procesar el pedido. Intenta otra vez.')
        }
    }

    return (
        <section id="carrito" className="py-16 pt-32">
            <div className="max-w-4xl mx-auto px-6">
                <h3 className="text-3xl font-bold mb-6">🛒 Carrito</h3>
                {cart.length === 0 ? (
                    <p>No hay artículos en el carrito.</p>
                ) : (
                    <div className="bg-white p-6 rounded shadow">
                        <ul>
                            {cart.map(item => (
                                <li key={item.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                                    <div className="flex-1">
                                        <div className="font-semibold">{item.nombre || item.name || item.title}</div>
                                        <div className="text-sm text-gray-500">
                                            Precio unitario: ${parseFloat(item.precio || item.price || 0).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                                                className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold hover:bg-gray-300"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center">{item.quantity || 1}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                                className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold hover:bg-gray-300"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="font-semibold min-w-[80px] text-right">
                                            ${(parseFloat(item.precio || item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item.id)} 
                                            className="text-red-500 hover:text-red-700 ml-2"
                                        >
                                            ✖
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 pt-4 border-t flex justify-between items-center">
                            <div className="text-xl font-bold text-gray-800">
                                Total: {getFormattedTotal()}
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={clearCart} 
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                                >
                                    Vaciar Carrito
                                </button>
                                <button 
                                    onClick={handlePayNow} 
                                    className="px-6 py-2 text-white rounded-lg font-medium hover:shadow-md transition-all duration-200"
                                    style={{ backgroundColor: '#2f4870' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#243a5e'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#2f4870'}
                                >
                                    Pagar Ahora
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>  
    )
}