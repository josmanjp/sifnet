import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { sendOrderWhatsApp } from '../utils/api'

export default function CarPage(){
const { cart, removeFromCart, clearCart } = useCart()
const total = cart.reduce((s,i)=> s + (i.price * (i.quantity||1)), 0)


const handlePayNow = async ()=>{
await sendOrderWhatsApp(cart, total)
clearCart()
}

return (
    <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
            <div className="max-w-4xl mx-auto p-6 py-16 pt-32">
                <h2 className="text-3xl font-bold mb-4">Carrito</h2>
                {cart.length===0 ? <p>No hay artículos en el carrito.</p> : (
                    <div className="bg-white p-4 rounded shadow">
                        <ul>
                            {cart.map(i=> (
                            <li key={i.id} className="flex justify-between py-2">
                                <div>
                                    <div className="font-semibold">{i.title}</div>
                                    <div className="text-sm text-gray-500">Cantidad: {i.quantity}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div>${i.price * i.quantity}</div>
                                    <button onClick={()=> removeFromCart(i.id)} className="text-red-500">✖</button>
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
        </main>
        <Footer />
    </div>
)
}