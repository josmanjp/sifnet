import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { sendOrderWhatsApp } from '../utils/api'

export default function CarPage(){
const { cart, removeFromCart, clearCart } = useCart()
const { isAuthenticated, login } = useAuth()
const [loginModalOpen, setLoginModalOpen] = useState(false)
const total = cart.reduce((s,i)=> s + (i.price * (i.quantity||1)), 0)

const handlePayNow = async ()=>{
    // Verificar si el usuario está autenticado
    if (!isAuthenticated()) {
        setLoginModalOpen(true)
        return
    }
    
    // Proceder con el pago si está autenticado
    await sendOrderWhatsApp(cart, total)
    clearCart()
}

const processPayment = async () => {
    // Esta función procesa el pago sin verificar autenticación
    await sendOrderWhatsApp(cart, total)
    clearCart()
}

const handleLoginSuccess = (userData) => {
    login(userData)
    setLoginModalOpen(false)
    // Después del login exitoso, proceder con el pago
    processPayment()
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
        
        {/* Modal de Login */}
        <LoginModal 
            isOpen={loginModalOpen}
            onClose={() => setLoginModalOpen(false)}
            onLogin={handleLoginSuccess}
        />
    </div>
)
}