import React from 'react'
import { useCart } from '../context/CartContext'
import { sendOrderToAPI } from '../utils/api'
export default function Cart(){
    const { cart, removeFromCart, clearCart } = useCart()
    const total = cart.reduce((s, i) => s + (i.price * (i.quantity || 1)), 0)
    const handlePayNow = async () => {
        // Ejemplo: enviar pedido a API (si existe)
        const order = { items: cart, total, createdAt: new Date().toISOString() }
        const res = await sendOrderToAPI(order)
        if (res?.ok) {
            // Abrir WhatsApp con mensaje preformateado como opción de pago inmediato
            const text = encodeURIComponent(`Hola, quiero comprar estos cursos. Total: $${total}. Items: ${cart.map(i=>i.name).join(', ')}`)
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
                                <li key={item.id} className="flex justify-between py-2">
                                <div>
                                <div className="font-semibold">{item.name}</div>
                                <div className="text-sm text-gray-500">Cantidad: {item.quantity || 1}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                <div>${item.price * (item.quantity || 1)}</div>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-500">✖</button>
                                </div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 flex justify-between items-center">
                            <div className="font-bold">Total: ${total}</div>
                            <div className="flex gap-3">
                                <button onClick={clearCart} className="px-4 py-2 bg-gray-200 rounded">Vaciar</button>
                                <button onClick={handlePayNow} className="px-4 py-2 bg-green-600 text-white rounded">Pagar ahora</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>  
    )
}