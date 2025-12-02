import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { toast } from 'sonner'
import { Trash2, Edit, Plus, X, Upload, Eye } from 'lucide-react'
import {fetchCategories, updateCategory, createCategory, deleteCategory} from '../utils/api'
export default function AdminCategoriasPage() {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [categorias, setCategorias] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingCategoria, setEditingCategoria] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const itemsPerPage = 10
    let resp = null

    // Form state
    const [formData, setFormData] = useState({
        nombre: '',
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
            setLoading(true)
            const data = await fetchCategories()
            setCategorias( data)
        } catch (error) {
            console.error('Error fetching categorias:', error)
            toast.error('❌ Error al cargar categorías')
            setCategorias([])
        } finally {
            setLoading(false)
        }
    }

    // Filtrar categorías basado en el término de búsqueda
    const filteredCategorias = categorias.filter(categoria => {
        if (!searchTerm) return true
        const nombre = (categoria.nombre || categoria.Nombre || '').toLowerCase()
        return nombre.includes(searchTerm.toLowerCase())
    })

    useEffect(() => {
        if (isAuthenticated() && user?.tipo === "Adm. Sistema") {
            fetchCategorias()
        }
    }, [isAuthenticated, user])

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
        setEditingCategoria(null)
        setFormData({
            nombre: '',
            imagen: null,
            imagenPreview: ''
        })
        setModalOpen(true)
    }

    // Abrir modal para editar
    const handleEdit = (categoria) => {
        setEditingCategoria(categoria)
        setFormData({
            nombre: categoria.nombre || categoria.Nombre || '',
            imagen: null,
            imagenPreview: categoria.imagen || categoria.Imagen || ''
        })
        setModalOpen(true)
    }

    // Guardar categoría
    const handleSave = async (e) => {
        e.preventDefault()
        
        if (!formData.nombre.trim()) {
            toast.error('❌ El nombre es obligatorio')
            return
        }

        try {
            const formDataToSend = new FormData()
            formDataToSend.append('nombre', formData.nombre.trim())
            if (formData.imagen) {
                formDataToSend.append('imagen', formData.imagen)
            }
            if (editingCategoria) {
                formDataToSend.append('id', editingCategoria.id || editingCategoria.ID)
                resp = await updateCategory(editingCategoria.id || editingCategoria.ID, formDataToSend)  
            } else {
                resp = await createCategory(formDataToSend)
            }
            if (resp.success) {
                toast.success(resp.message || (editingCategoria ? '✅ Categoría actualizada correctamente' : '✅ Categoría creada correctamente'))
                closeModal()
                fetchCategorias()
            } else {
                toast.error(resp.message || (editingCategoria ? 'Error al actualizar categoría' : 'Error al crear categoría'))
            }
        } catch (error) {
            console.error('Error saving categoria:', error)
            toast.error('❌ ' + error.message)
        }
    }

    // Eliminar categoría
    const handleDelete = async (categoria) => {
        if (!confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`)) {
            return
        }

        try {
            resp = await deleteCategory(categoria.id)
            if (resp.success) {
                toast.success(resp.message ||'✅ Categoría eliminada correctamente' )
            }else {
                throw new Error(resp.message || 'Error al eliminar categoría')
            }
            fetchCategorias()
            
        } catch (error) {
            console.error('Error deleting categoria:', error)
            toast.error('❌ ' + error.message)
        }
    }

    // Cerrar modal
    const closeModal = () => {
        setModalOpen(false)
        setEditingCategoria(null)
        setFormData({
            nombre: '',
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
                <title>Administración de Categorías - SifNet | Panel de Control</title>
                <meta name="description" content="Panel de administración de categorías para SifNet. Gestiona las categorías de productos y servicios." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <Header />
            <main className="flex-grow bg-gray-50 pt-20" role="main" aria-label="Panel de administración de categorías">
                <div className="max-w-7xl mx-auto p-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">
                                📂 Administración de Categorías
                            </h1>
                            <button
                                onClick={handleCreate}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Plus size={16} />
                                Nueva Categoría
                            </button>
                        </div>

                        {/* Buscador */}
                        <div className="mb-4">
                            <div className="relative w-full md:w-1/3">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-4     -400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar categorías..."
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
                            {searchTerm && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Mostrando {filteredCategorias.length} de {categorias.length} categorías
                                </p>
                            )}
                        </div>

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
                                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredCategorias.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                                                        {searchTerm ? 'No se encontraron categorías que coincidan con la búsqueda' : 'No se encontraron categorías'}
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredCategorias.map((categoria, index) => (
                                                    <tr key={categoria.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-4 text-sm text-gray-900">
                                                            {categoria.id}
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            {(categoria.image_url) ? (
                                                                <img
                                                                    src={categoria.image_url }
                                                                    alt={categoria.nombre }
                                                                    className="w-12 h-12 object-cover rounded-lg"
                                                                />
                                                            ) : (
                                                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                                                    <span className="text-gray-400 text-xs">Sin imagen</span>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-900">
                                                            {categoria.nombre}
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            <div className="flex justify-center gap-2">
                                                                <button
                                                                    onClick={() => handleEdit(categoria)}
                                                                    className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                                                                    title="Editar"
                                                                >
                                                                    <Edit size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(categoria)}
                                                                    className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                                                                    title="Eliminar"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Vista móvil - Lista de tarjetas */}
                                <div className="md:hidden space-y-4">
                                    {filteredCategorias.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            {searchTerm ? 'No se encontraron categorías que coincidan con la búsqueda' : 'No se encontraron categorías'}
                                        </div>
                                    ) : (
                                        filteredCategorias.map((categoria) => (
                                            <div key={categoria.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                                <div className="p-4 flex gap-4">
                                                    {/* Columna de información */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start gap-3">
                                                            {categoria.image_url ? (
                                                                <img
                                                                    src={categoria.image_url}
                                                                    alt={categoria.nombre}
                                                                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                                                />
                                                            ) : (
                                                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                    <span className="text-gray-400 text-xs">Sin imagen</span>
                                                                </div>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-medium text-gray-900 truncate">
                                                                    {categoria.nombre}
                                                                </h3>
                                                                <p className="text-sm text-gray-500">
                                                                    ID: {categoria.id}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Columna de acciones */}
                                                    <div className="flex flex-col gap-2 flex-shrink-0">
                                                        <button
                                                            onClick={() => handleEdit(categoria)}
                                                            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(categoria)}
                                                            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
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
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-semibold">
                                {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
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
                                    placeholder="Nombre de la categoría"
                                    required
                                />
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
                                            className="w-20 h-20 object-cover rounded-lg"
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
                                    {editingCategoria ? 'Actualizar' : 'Crear'}
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