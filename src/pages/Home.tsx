// src/pages/HomePage.tsx
import React from 'react'
import HeroSection from '../components/home/HeroSection'

export default function HomePage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
            <HeroSection />
        </main>
    )
}
