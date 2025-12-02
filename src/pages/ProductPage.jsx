import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, ShoppingCart, Star, Package, Shield, Award } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { fetchProducts } from '../utils/api'

export default function ProductPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToCart } = useCart()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true)
                const products = await fetchProducts()
                const foundProduct = products?.find(p => p.id === parseInt(id))
                setProduct(foundProduct || null)
            } catch (error) {
                console.error('Error fetching product:', error)
                setProduct(null)
            } finally {
                setLoading(false)
            }
        }
        
        if (id) {
            fetchProduct()
        }
    }, [id])

    const handleAddToCart = () => {
        if (product) {
            addToCart({
                ...product,
                quantity: quantity,
                title: product.nombre || product.title,
                name: product.nombre || product.title,
                price: product.precio || product.price || 0
            })
            
            // Mostrar feedback visual
            const button = document.getElementById('add-to-cart-btn')
            const originalText = button.textContent
            button.textContent = '¡Agregado!'
            button.style.backgroundColor = '#22c55e'
            
            setTimeout(() => {
                button.textContent = originalText
                button.style.backgroundColor = '#2f4870'
            }, 2000)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600"></div>
                </div>
                <Footer />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h2>
                        <p className="text-gray-600 mb-6">El producto que buscas no existe o ha sido eliminado.</p>
                        <button
                            onClick={() => navigate('/catalog')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Volver al catálogo
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    const productImages = [
        product.image_url || product.image,
        // Aquí podrías agregar más imágenes si las tienes
    ].filter(Boolean)

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Helmet>
                <title>{product.nombre || product.title} - SifNet | Detalle del Producto</title>
                <meta name="description" content={`${product.descripcion || product.description || `Descubre ${product.nombre || product.title} en SifNet`}. Precio: $${parseFloat(product.precio || product.price || 0).toLocaleString()}.`} />
                <meta name="keywords" content={`${product.nombre || product.title}, ${product.categoria || product.category || ''}, productos tecnológicos, SifNet`} />
                <meta property="og:title" content={`${product.nombre || product.title} - SifNet`} />
                <meta property="og:description" content={product.descripcion || product.description || `Descubre ${product.nombre || product.title} en SifNet`} />
                <meta property="og:image" content={product.image_url || product.image} />
                <meta property="og:type" content="product" />
                <meta property="product:price:amount" content={product.precio || product.price || 0} />
                <meta property="product:price:currency" content="COP" />
                <link rel="canonical" href={`https://sifnet.com/product/${product.id}`} />
            </Helmet>
            <Header />
            
            <main className="flex-grow pt-20" role="main" aria-label="Detalle del producto">
                {/* Breadcrumb */}
                <div className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center space-x-2 text-sm">
                            <button
                                onClick={() => navigate('/catalog')}
                                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <ArrowLeft size={16} className="mr-1" />
                                Catálogo
                            </button>
                            <span className="text-gray-400">/</span>
                            <span className="text-gray-900">{product.nombre || product.title}</span>
                        </div>
                    </div>
                </div>

                {/* Product Details */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
                                <img
                                    src={productImages[selectedImage]}
                                    alt={product.nombre || product.title}
                                    className="w-full h-full object-contain p-6"
                                />
                            </div>
                            
                            {productImages.length > 1 && (
                                <div className="flex space-x-2">
                                    {productImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                selectedImage === index 
                                                    ? 'border-blue-500' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {product.nombre || product.title}
                                </h1>
                                
                                {(product.categoria || product.category) && (
                                    <div className="flex items-center space-x-2 mb-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            <Package size={14} className="mr-1" />
                                            {product.categoria || product.category}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-baseline space-x-2">
                                    <span className="text-4xl font-bold text-gray-900">
                                        $ {parseFloat(product.precio || product.price || 0).toLocaleString()}
                                    </span>
                                    <span className="text-lg text-gray-500">USD</span>
                                </div>
                            </div>

                            {/* Description */}
                            {(product.descripcion || product.description) && (
                                <div className="prose prose-gray max-w-none">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                                    <div 
                                        className="text-gray-600 leading-relaxed"
                                        style={{ whiteSpace: 'pre-wrap' }}
                                    >
                                        {product.descripcion || product.description}
                                    </div>
                                </div>
                            )}

                            {/* Features */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                                    <Shield className="text-green-600" size={20} />
                                    <span className="text-sm font-medium text-green-800">Garantía</span>
                                </div>
                                <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                                    <Star className="text-blue-600" size={20} />
                                    <span className="text-sm font-medium text-blue-800">Calidad</span>
                                </div>
                                <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
                                    <Award className="text-purple-600" size={20} />
                                    <span className="text-sm font-medium text-purple-800">Profesional</span>
                                </div>
                            </div>

                            {/* Quantity and Add to Cart */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cantidad
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="text-lg font-semibold w-12 text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    id="add-to-cart-btn"
                                    onClick={handleAddToCart}
                                    className="w-full flex items-center justify-center space-x-2 py-4 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                                    style={{ backgroundColor: '#2f4870' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#243a5e'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#2f4870'}
                                >
                                    <ShoppingCart size={20} />
                                    <span>Agregar al carrito</span>
                                </button>

                                <div className="text-center">
                                    <p className="text-sm text-gray-500">
                                        Total: ${(parseFloat(product.precio || product.price || 0) * quantity).toLocaleString()} USD
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    )
}