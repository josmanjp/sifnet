import React from 'react'
import { motion } from 'framer-motion'

export default function Features(){
    return (
        <section id="features" className="py-16 bg-white">
            <div className="max-w-6xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        {num:'01', title:'Mi Carrera', text:'T.S.U Informatica...'},
                        {num:'02', title:'Windows', text:'Especialista en...'},
                        {num:'03', title:'Aplicaciones Web', text:'PHP - MySQL - HTML - CSS'},
                        {num:'04', title:'Aplicaciones Moviles', text:'Integracion con Android'},
                    ].map((f,i)=> (
                    <motion.div key={i} initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay: i*0.1}} className="p-6 bg-gray-50 rounded">
                        <h6 className="text-teal-400 font-bold">{f.num}</h6>
                        <h4 className="font-semibold mt-2">{f.title}</h4>
                        <p className="mt-2 text-sm">{f.text}</p>
                    </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}