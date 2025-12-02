import React from 'react'
import { Helmet } from 'react-helmet-async'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Catalog from '../components/Catalog'
import Contact from '../components/Contact'
import Footer from '../components/Footer'


export default function HomePage(){
return (
    <div className="min-h-screen flex flex-col">
        <Helmet>
            <title>SifNet - Soluciones Tecnológicas y Servicios de Red</title>
            <meta name="description" content="SifNet ofrece soluciones tecnológicas integrales, servicios de red, productos especializados y soporte técnico profesional. Descubre nuestro catálogo de productos y servicios." />
            <meta name="keywords" content="tecnología, redes, servicios informáticos, soporte técnico, productos tecnológicos, SifNet" />
            <meta name="author" content="SifNet" />
            <meta property="og:title" content="SifNet - Soluciones Tecnológicas y Servicios de Red" />
            <meta property="og:description" content="Soluciones tecnológicas integrales, servicios de red y productos especializados con soporte profesional." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://sifnet.com" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="SifNet - Soluciones Tecnológicas" />
            <meta name="twitter:description" content="Descubre nuestras soluciones tecnológicas y servicios de red profesionales." />
            <link rel="canonical" href="https://sifnet.com" />
        </Helmet>
        <Header />
        <main className="pt-24 flex-grow" role="main" aria-label="Contenido principal">
            <Hero />
            <Features />
            <Catalog />
            <Contact />
        </main>
        <Footer />
    </div>
)
}