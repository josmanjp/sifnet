import React from 'react'
import { motion } from 'framer-motion'

export default function Hero(){
    return (
        <section id="top" className="min-h-screen flex items-center bg-white" style={{paddingTop: '100px'}}>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-6">
                <motion.div initial={{opacity:0, x:-30}} animate={{opacity:1, x:0}} transition={{duration:0.8}}>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="p-4 bg-gray-100 rounded">
                            <h6 className="text-sm">Estado:</h6>
                            <h4 className="font-bold">Disponible para Trabajar</h4>
                        </div>
                        <div className="p-4 bg-gray-100 rounded">
                            <h6 className="text-sm">Precios:</h6>
                            <h4 className="font-bold">A Acordar</h4>
                        </div>
                        <div className="p-4 bg-gray-100 rounded">
                            <h6 className="text-sm">Soporte</h6>
                            <h4 className="font-bold">24/7</h4>
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold">Desarrollo de Apps para Windows,  Web y Apps Móviles</h2>
                    <div className="mt-6">
                        <a href="#contact" className="inline-block text-white px-6 py-3 rounded" style={{ backgroundColor: '#2f4870' }}>Obtenga su Presupuesto</a>
                    </div>
                </motion.div>
                <motion.div initial={{opacity:0, x:30}} animate={{opacity:1, x:0}} transition={{duration:0.8}}>
                    <img src="/assets/images/banner-right-image.png" alt="banner" />
                </motion.div>
            </div>
        </section>  
    )
}