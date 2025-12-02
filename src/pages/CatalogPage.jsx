import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import {fetchProducts} from '../utils/api'

export default function CatalogoPage(){
    const [q, setQ] = useState('')
    const [category, setCategory] = useState('all')
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const data = await fetchProducts()
                setProducts(data || [])
            } catch (error) {
                console.error('Error fetching products:', error)
                setProducts([])
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // Obtener categorías únicas de los productos
    const uniqueCategories = [...new Set(products.map(p => p.categoria || p.category).filter(Boolean))]

    const filtered = products.filter(p=> {
        const matchesCategory = category === 'all' || p.categoria === category || p.category === category
        const matchesSearch = (p.nombre || p.title || p.name || '').toLowerCase().includes(q.toLowerCase())
        return matchesCategory && matchesSearch
    })    
    return (
        <div className="min-h-screen flex flex-col">
            <Helmet>
                <title>Catálogo de Productos - SifNet | Soluciones Tecnológicas</title>
                <meta name="description" content="Explora nuestro catálogo completo de productos y servicios tecnológicos. Encuentra soluciones especializadas para tus necesidades de red y tecnología." />
                <meta name="keywords" content="catálogo productos, tecnología, redes, servicios, SifNet, productos tecnológicos" />
                <meta property="og:title" content="Catálogo de Productos - SifNet" />
                <meta property="og:description" content="Descubre nuestro catálogo completo de soluciones tecnológicas y productos especializados." />
                <link rel="canonical" href="https://sifnet.com/catalog" />
            </Helmet>
            <Header />
            <main className="flex-grow" role="main" aria-label="Catálogo de productos">
                <div className="max-w-6xl mx-auto p-6 py-16 pt-32">
                    <h1 className="text-3xl font-bold mb-4">Catálogo de Productos</h1>
                    <div className="flex gap-3 mb-4" role="search" aria-label="Filtros de búsqueda">
                        <input 
                            value={q} 
                            onChange={e=>setQ(e.target.value)} 
                            placeholder="Buscar productos..." 
                            className="border p-2 rounded" 
                            aria-label="Buscar productos"
                            type="search"
                        />
                        <select 
                            value={category} 
                            onChange={e=>setCategory(e.target.value)} 
                            className="border p-2 rounded"
                            aria-label="Filtrar por categoría"
                        >
                            <option value="all">Todas las categorías</option>
                            {uniqueCategories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>
                        </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center py-12" role="status" aria-label="Cargando productos">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
                            <span className="sr-only">Cargando productos...</span>
                        </div>
                    ) : (
                        <div 
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            role="grid" 
                            aria-label={`Productos encontrados: ${filtered.length}`}
                        >
                            {filtered.length > 0 ? (
                                filtered.map(p=> (
                                    <div key={p.id} role="gridcell">
                                        <ProductCard product={p} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 text-gray-500" role="status">
                                    {products.length === 0 ? 
                                        "No hay productos disponibles en este momento." :
                                        "No se encontraron productos que coincidan con tu búsqueda."
                                    }
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>  
    )
}