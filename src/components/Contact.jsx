import React, { useState } from 'react'

export default function Contact(){
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        mensaje: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Validación básica
        if (!formData.nombre || !formData.email || !formData.mensaje) {
            alert('Por favor completa todos los campos')
            return
        }

        setIsSubmitting(true)

        try {
            // Crear mensaje para WhatsApp
            const mensaje = `¡Hola! Mi nombre es *${formData.nombre}* %0A%0A` +
                           `*Email*: ${formData.email}%0A%0A` +
                           `*Mensaje*:%0A${formData.mensaje}%0A%0A` +
                           `*Enviado desde el formulario de contacto de SIFnet*`

            // Número de WhatsApp (reemplaza con tu número)
            const numeroWhatsApp = '5491123558308'
            
            // Abrir WhatsApp
            const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`
            window.open(url, '_blank')
            
            // Esperar un poco y limpiar formulario
            setTimeout(() => {
                setFormData({
                    nombre: '',
                    email: '',
                    mensaje: ''
                })
                setIsSubmitting(false)
            }, 1000)
            
        } catch (error) {
            console.error('Error:', error)
            alert('Hubo un error. Por favor intenta nuevamente.')
            setIsSubmitting(false)
        }
    }

    return (
        <section id="contact" className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold mb-2">Contactame</h3>
                    <p className="text-gray-600">¿Tienes alguna pregunta? ¡Escríbeme por WhatsApp!</p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                    <input 
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Nombre" 
                        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        required
                    />
                    <input 
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email" 
                        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        required
                    />
                    <textarea 
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleInputChange}
                        placeholder="Mensaje" 
                        className="border p-2 rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        required
                    />
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className={`text-white px-4 py-2 rounded transition-all duration-300 flex items-center justify-center gap-2 ${
                            isSubmitting 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:opacity-90 hover:scale-105 transform'
                        }`} 
                        style={{ backgroundColor: '#2f4870' }}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="animate-spin">⏳</span>
                                Enviando...
                            </>
                        ) : (
                            <>
                                <span></span>
                                Enviar
                            </>
                        )}
                    </button>
                </form>
                </div>
            </div>
        </section>
    )
}