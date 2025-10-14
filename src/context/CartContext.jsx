import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }){
    const [cart, setCart] = useState(()=>{
        try{
             const s = localStorage.getItem('sifx3_cart');
              return s? JSON.parse(s): [] 
        }catch{
             return [] 
        }
    })

    useEffect(()=>{
        try{ 
            localStorage.setItem('sifx3_cart', JSON.stringify(cart))
         }catch{
            // no hacer nada
         }
    },[cart])

    const addToCart = (item)=>{
        setCart(prev=>{
            const found = prev.find(p=>p.id===item.id)
            if(found) {
                // Si el item ya existe, actualizar cantidad
                return prev.map(p=> 
                    p.id === item.id 
                        ? {...p, quantity: (p.quantity || 1) + (item.quantity || 1)} 
                        : p
                )
            }
            // Si el item no existe, agregarlo al carrito
            return [...prev, {...item, quantity: item.quantity || 1}]
        })
    }
    const removeFromCart = (id) => setCart(prev=> prev.filter(i=> i.id !== id))

    const updateQuantity = (id, quantity) => {
        if (quantity <= 0) {
            removeFromCart(id)
            return
        }
        setCart(prev=> prev.map(p=> 
            p.id === id ? {...p, quantity} : p
        ))
    }

    const clearCart = ()=> setCart([])

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + (item.quantity || 1), 0)
    }

    const getTotalPrice = () => {
        return cart.reduce((total, item) => {
            const price = parseFloat(item.precio || item.price || 0)
            const quantity = item.quantity || 1
            return total + (price * quantity)
        }, 0)
    }

    const getFormattedTotal = () => {
        return getTotalPrice().toLocaleString('es-AR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })
    }

    return (
        <CartContext.Provider value={{
            cart, 
            addToCart, 
            removeFromCart, 
            updateQuantity,
            clearCart,
            getTotalItems,
            getTotalPrice,
            getFormattedTotal
        }}>
            {children}
        </CartContext.Provider>
    )
}
export function useCart(){ return useContext(CartContext) }