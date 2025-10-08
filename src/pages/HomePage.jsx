import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Catalog from '../components/Catalog'
import Contact from '../components/Contact'
import Footer from '../components/Footer'


export default function HomePage(){
return (
    <div className="min-h-screen flex flex-col">
        <Header />
        <main className="pt-24 flex-grow">
            <Hero />
            <Features />
            <Catalog />
            <Contact />
        </main>
        <Footer />
    </div>
)
}