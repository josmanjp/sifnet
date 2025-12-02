import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { toast } from 'sonner'
import { Trash2, Edit, Plus, X, Upload, Eye } from 'lucide-react'
import { fetchProducts, fetchCategories, createProduct, updateProduct, deleteProduct } from '../utils/api'

export default function AdminProductosPage() {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [productos, setProductos] = useState([])
    const [categorias, setCategorias] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingProducto, setEditingProducto] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategoria, setFilterCategoria] = useState('all')
    const itemsPerPage = 10
    let resp = null

    // Form state
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria_id: '',
        imagen: null,
        imagenPreview: ''
    })

    // Verificar autenticación y permisos
    useEffect(() => {
        if (!isAuthenticated() || user?.tipo !== "Adm. Sistema") {
            navigate('/')
            toast.error("❌ No tienes permisos para acceder a esta página")
        }
    }, [isAuthenticated, user, navigate])

    // Cargar categorías
    const fetchCategorias = async () => {
        try {
            const data = await fetchCategories()
            setCategorias(data || [])
        } catch (error) {
            console.error('Error fetching categorias:', error)
            toast.error('❌ Error al cargar categorías')
        }
    }

    // Cargar productos
    const fetchProductos = async () => {
        try {
            setLoading(true)
            const data = await fetchProducts()
            setProductos(data || [])
        } catch (error) {
            console.error('Error fetching productos:', error)
            toast.error('❌ Error al cargar productos')
            setProductos([])
        } finally {
            setLoading(false)
        }
    }

    // Filtrar productos basado en los términos de búsqueda y categoría
    const filteredProductos = productos.filter(producto => {
        const matchesSearch = searchTerm ? 
            (producto.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) : true
        
        const matchesCategory = filterCategoria === 'all' ? true :
            (producto.categoria_id == filterCategoria)
        
        return matchesSearch && matchesCategory
    })

    // Paginación del lado del cliente
    const totalPages = Math.ceil(filteredProductos.length / itemsPerPage)
    const paginatedProductos = filteredProductos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    useEffect(() => {
        if (isAuthenticated() && user?.tipo === "Adm. Sistema") {
            fetchCategorias()
            fetchProductos()
        }
    }, [isAuthenticated, user])

    // Reset a página 1 cuando cambie la búsqueda o filtro
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, filterCategoria])

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Manejar cambio de imagen
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 16 * 1024 * 1024) { // 16MB
                toast.error('❌ La imagen no debe superar 16MB')
                return
            }
            
            const reader = new FileReader()
            reader.onload = () => {
                setFormData(prev => ({
                    ...prev,
                    imagen: file,
                    imagenPreview: reader.result
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    // Abrir modal para crear
    const handleCreate = () => {
        setEditingProducto(null)
        setFormData({
            nombre: '',
            descripcion: '',
            precio: '',
            categoria_id: '',
            imagen: null,
            imagenPreview: ''
        })
        setModalOpen(true)
    }

    // Abrir modal para editar
    const handleEdit = (producto) => {
        setEditingProducto(producto)
        setFormData({
            nombre: producto.nombre || '',
            descripcion: producto.descripcion || '',
            precio: producto.precio || '',
            categoria_id: producto.categoria_id || '',
            imagen: null,
            imagenPreview: producto.image_url || ''
        })
        setModalOpen(true)
    }

    // Guardar producto
    const handleSave = async (e) => {
        e.preventDefault()
        
        // Validaciones
        if (!formData.nombre.trim() || !formData.precio || !formData.categoria_id) {
            toast.error('❌ Complete todos los campos obligatorios')
            return
        }

        if (formData.nombre.trim().length < 10) {
            toast.error('❌ El nombre debe tener al menos 10 caracteres')
            return
        }

        if (formData.descripcion.trim().length < 10) {
            toast.error('❌ La descripción debe tener al menos 10 caracteres')
            return
        }

        if (parseFloat(formData.precio) <= 0) {
            toast.error('❌ El precio debe ser mayor a cero')
            return
        }

        try {
            const formDataToSend = new FormData()
            formDataToSend.append('nombre', formData.nombre.trim())
            formDataToSend.append('descripcion', formData.descripcion.trim())
            formDataToSend.append('precio', formData.precio)
            formDataToSend.append('categoria_id', formData.categoria_id)
            
            if (formData.imagen) {
                formDataToSend.append('url_imagen', formData.imagen)
            }

            if (editingProducto) {
                resp = await updateProduct(editingProducto.id, formDataToSend)
            } else {
                resp = await createProduct(formDataToSend)
            }
            
            if (resp.success) {
                toast.success(resp.message || (editingProducto ? '✅ Producto actualizado correctamente' : '✅ Producto creado correctamente'))
                closeModal()
                fetchProductos()
            } else {
                toast.error(resp.message || (editingProducto ? 'Error al actualizar producto' : 'Error al crear producto'))
            }
        } catch (error) {
            console.error('Error saving producto:', error)
            toast.error('❌ ' + error.message)
        }
    }

    // Eliminar producto
    const handleDelete = async (producto) => {
        if (!confirm(`¿Estás seguro de eliminar el producto "${producto.nombre}"?`)) {
            return
        }

        try {
            resp = await deleteProduct(producto.id)
            if (resp.success) {
                toast.success(resp.message || '✅ Producto eliminado correctamente')
                fetchProductos()
            } else {
                throw new Error(resp.message || 'Error al eliminar producto')
            }
        } catch (error) {
            console.error('Error deleting producto:', error)
            toast.error('❌ ' + error.message)
        }
    }

    // Cerrar modal
    const closeModal = () => {
        setModalOpen(false)
        setEditingProducto(null)
        setFormData({
            nombre: '',
            descripcion: '',
            precio: '',
            categoria_id: '',
            imagen: null,
            imagenPreview: ''
        })
    }

    if (!isAuthenticated() || user?.tipo !== "Adm. Sistema") {
        return null
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Helmet>
                <title>Administración de Productos - SifNet | Panel de Control</title>
                <meta name="description" content="Panel de administración de productos para SifNet. Gestiona el catálogo de productos y servicios tecnológicos." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <Header />
            <main className="flex-grow bg-gray-50 pt-20" role="main" aria-label="Panel de administración de productos">
                <div className="max-w-7xl mx-auto p-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">
                                📦 Administración de Productos
                            </h1>
                            <button
                                onClick={handleCreate}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Plus size={16} />
                                Nuevo Producto
                            </button>
                        </div>

                        {/* Filtros */}
                        <div className="mb-4 flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                            <select
                                value={filterCategoria}
                                onChange={(e) => setFilterCategoria(e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Todas las categorías</option>
                                {categorias.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {(searchTerm || filterCategoria !== 'all') && (
                            <p className="mb-4 text-sm text-gray-600">
                                Mostrando {filteredProductos.length} de {productos.length} productos
                            </p>
                        )}

                        {/* Tabla */}
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <>
                                {/* Vista de escritorio - Tabla tradicional */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full table-auto">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider" style={{ textAlign: 'right' }}>Precio</th>
                                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {paginatedProductos.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                                        {searchTerm || filterCategoria !== 'all' ? 
                                                            'No se encontraron productos que coincidan con los filtros' : 
                                                            'No se encontraron productos'
                                                        }
                                                    </td>
                                                </tr>
                                            ) : (
                                                paginatedProductos.map((producto, index) => {
                                                    const categoria = categorias.find(cat => cat.id == producto.categoria_id)
                                                    return (
                                                        <tr key={producto.id} className="hover:bg-gray-50">
                                                            <td className="px-4 py-4 text-sm text-gray-900">
                                                                {producto.id}
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                {producto.image_url ? (
                                                                    <img
                                                                        src={producto.image_url}
                                                                        alt={producto.nombre}
                                                                        className="w-12 h-12 object-cover rounded-lg"
                                                                    />
                                                                ) : (
                                                                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                                                        <span className="text-gray-400 text-xs">Sin imagen</span>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {producto.nombre}
                                                                    </div>
                                                                    {producto.descripcion && (
                                                                        <div className="text-sm text-gray-500 truncate max-w-xs" title={producto.descripcion}>
                                                                            {producto.descripcion}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                                {categoria?.nombre || 'Sin categoría'}
                                                            </td>
                                                            <td className="px-4 py-4 text-sm font-medium text-gray-900" style={{ textAlign: 'right' }}>
                                                                ${parseFloat(producto.precio).toFixed(2)}
                                                            </td>
                                                            <td className="px-4 py-4 text-center">
                                                                <div className="flex justify-center gap-2">
                                                                    <button
                                                                        onClick={() => handleEdit(producto)}
                                                                        className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                                                                        title="Editar"
                                                                    >
                                                                        <Edit size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(producto)}
                                                                        className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                                                                        title="Eliminar"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Vista móvil - Lista de tarjetas */}
                                <div className="md:hidden space-y-4">
                                    {paginatedProductos.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            {searchTerm || filterCategoria !== 'all' ? 
                                                'No se encontraron productos que coincidan con los filtros' : 
                                                'No se encontraron productos'
                                            }
                                        </div>
                                    ) : (
                                        paginatedProductos.map((producto) => {
                                            const categoria = categorias.find(cat => cat.id == producto.categoria_id)
                                            return (
                                                <div key={producto.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="p-4 flex gap-4">
                                                        {/* Columna de información */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start gap-3">
                                                                {producto.image_url ? (
                                                                    <img
                                                                        src={producto.image_url}
                                                                        alt={producto.nombre}
                                                                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                                                    />
                                                                ) : (
                                                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                        <span className="text-gray-400 text-xs">Sin imagen</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex-1 min-w-0">
                                                                    <h3 className="font-medium text-gray-900 truncate">
                                                                        {producto.nombre}
                                                                    </h3>
                                                                    <p className="text-sm text-gray-500 mb-1">
                                                                        ID: {producto.id} | {categoria?.nombre || 'Sin categoría'}
                                                                    </p>
                                                                    <p className="text-lg font-semibold text-gray-900">
                                                                        ${parseFloat(producto.precio).toFixed(2)}
                                                                    </p>
                                                                    {producto.descripcion && (
                                                                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                                            {producto.descripcion}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Columna de acciones */}
                                                        <div className="flex flex-col gap-2 flex-shrink-0">
                                                            <button
                                                                onClick={() => handleEdit(producto)}
                                                                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                                                                title="Editar"
                                                            >
                                                                <Edit size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(producto)}
                                                                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>

                                {/* Paginación */}
                                {totalPages > 1 && (
                                    <div className="mt-6 flex justify-center items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            Anterior
                                        </button>
                                        
                                        <span className="px-4 py-2 text-sm text-gray-600">
                                            Página {currentPage} de {totalPages}
                                        </span>
                                        
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal para crear/editar */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-semibold">
                                {editingProducto ? 'Editar Producto' : 'Nuevo Producto'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre *
                                    </label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nombre del producto"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="categoria_id" className="block text-sm font-medium text-gray-700 mb-2">
                                        Categoría *
                                    </label>
                                    <select
                                        id="categoria_id"
                                        name="categoria_id"
                                        value={formData.categoria_id}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Seleccionar categoría</option>
                                        {categorias.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-2">
                                        Precio *
                                    </label>
                                    <input
                                        type="number"
                                        id="precio"
                                        name="precio"
                                        value={formData.precio}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción
                                    <span className="text-gray-400 text-xs ml-2">
                                        (Acepta emojis y caracteres especiales ✨📱💻)
                                    </span>
                                </label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="Descripción del producto... 
Puedes usar:
- Emojis: 📱💻⚡🔥
- Saltos de línea
- Caracteres especiales: ñáéíóú"
                                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                                />
                                <div className="mt-1 text-xs text-gray-500">
                                    {formData.descripcion.length} caracteres
                                </div>
                            </div>

                            <div>
                                <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-2">
                                    Imagen
                                </label>
                                <input
                                    type="file"
                                    id="imagen"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {formData.imagenPreview && (
                                    <div className="mt-2">
                                        <img
                                            src={formData.imagenPreview}
                                            alt="Preview"
                                            className="w-32 h-32 object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {editingProducto ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}