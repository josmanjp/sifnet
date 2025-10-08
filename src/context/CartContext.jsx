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
            if(found) return 
            prev.map(
                p=> p.id===item.id ?
                {...p, quantity: p.quantity + (item.quantity||1)} : p
            )
            return [...prev, {...item, quantity: item.quantity||1}]
        })
    }
    const removeFromCart = (id) => setCart(prev=> prev.filter(i=> i.id !== id))

    const clearCart = ()=> setCart([])


    return (
        <CartContext.Provider value={{cart, addToCart, removeFromCart, clearCart}}>
            {children}
        </CartContext.Provider>
    )
}
export function useCart(){ return useContext(CartContext) }