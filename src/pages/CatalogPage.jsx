import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { products as seed } from '../utils/Products'
import ProductCard from '../components/ProductCard'


export default function CatalogoPage(){
    const [q, setQ] = useState('')
    const [category, setCategory] = useState('all')
    const filtered = seed.filter(p=> (category==='all' || p.category===category) && p.title.toLowerCase().includes(q.toLowerCase()))
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <div className="max-w-6xl mx-auto p-6 py-16 pt-32">
                    <h2 className="text-3xl font-bold mb-4">Catálogo</h2>
                    <div className="flex gap-3 mb-4">
                        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar..." className="border p-2 rounded" />
                        <select value={category} onChange={e=>setCategory(e.target.value)} className="border p-2 rounded">
                            <option value="all">Todas</option>
                            <option value="basico">Básico</option>
                            <option value="intermedio">Intermedio</option>
                            <option value="avanzado">Avanzado</option>
                        </select>
                        </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filtered.map(p=> <ProductCard key={p.id} product={p} />)}
                    </div>
                </div>
            </main>
            <Footer />
        </div>  
    )
}