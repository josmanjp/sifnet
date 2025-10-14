import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export { AuthContext }

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Verificar si hay usuario guardado en localStorage al cargar la app
        try {
            const savedUser = localStorage.getItem('sifnet_user')
            const savedToken = localStorage.getItem('sifnet_token')
            if (savedUser && savedToken) {
                setUser(JSON.parse(savedUser))
            }
        } catch (error) {
            console.error('Error loading user from localStorage:', error)
            localStorage.removeItem('sifnet_user')
            localStorage.removeItem('sifnet_token')
        } finally {
            setLoading(false)
        }
    }, [])

    const login = (userData, token) => {
        setUser(userData)
        localStorage.setItem('sifnet_user', JSON.stringify(userData))
        if (token) {
            localStorage.setItem('sifnet_token', token)
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('sifnet_user')
        localStorage.removeItem('sifnet_token')
    }

    const isAuthenticated = () => {
        return user !== null
    }

    const value = {
        user,
        login,
        logout,
        isAuthenticated,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}