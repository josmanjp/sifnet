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
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(6)

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

    // Calcular paginación
    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedProducts = filtered.slice(startIndex, endIndex)

    // Reset página cuando cambian los filtros
    useEffect(() => {
        setCurrentPage(1)
    }, [q, category, itemsPerPage])    
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
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-3" role="search" aria-label="Filtros de búsqueda">
                            <input 
                                value={q} 
                                onChange={e=>setQ(e.target.value)} 
                                placeholder="Buscar productos..." 
                                className="border p-2 rounded flex-1" 
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
                            <select 
                                value={itemsPerPage} 
                                onChange={e=>setItemsPerPage(Number(e.target.value))} 
                                className="border p-2 rounded"
                                aria-label="Productos por página"
                            >
                                <option value={3}>3 por página</option>
                                <option value={6}>6 por página</option>
                                <option value={9}>9 por página</option>
                                <option value={12}>12 por página</option>
                                <option value={18}>18 por página</option>
                                <option value={24}>24 por página</option>
                            </select>
                        </div>
                        
                        {/* Información de resultados */}
                        <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>
                                Mostrando {paginatedProducts.length} de {filtered.length} productos
                                {filtered.length !== products.length && ` (${products.length} total)`}
                            </span>
                            {totalPages > 1 && (
                                <span>
                                    Página {currentPage} de {totalPages}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center py-12" role="status" aria-label="Cargando productos">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
                            <span className="sr-only">Cargando productos...</span>
                        </div>
                    ) : (
                        <div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            role="grid" 
                            aria-label={`Productos encontrados: ${filtered.length}`}
                        >
                            {paginatedProducts.length > 0 ? (
                                paginatedProducts.map(p=> (
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

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                    aria-label="Página anterior"
                                >
                                    ← Anterior
                                </button>

                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`px-3 py-2 border rounded-lg transition-colors ${
                                                    currentPage === pageNum
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'hover:bg-gray-50'
                                                }`}
                                                aria-label={`Ir a página ${pageNum}`}
                                                aria-current={currentPage === pageNum ? 'page' : undefined}
                                            >
                                                {pageNum}
                                            </button>
                                        )
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                    aria-label="Página siguiente"
                                >
                                    Siguiente →
                                </button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>  
    )
}