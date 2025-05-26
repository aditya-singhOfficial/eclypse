// src/components/Navbar.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoIcon from '../assets/logo.jpg'
import LogoText from '../assets/logo-text.svg'
import ViewTransitionLink from './ViewTransitionLink'

const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header
            className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-500
        ${scrolled
                    ? 'bg-white/10 backdrop-blur-lg shadow-2xl py-4'
                    : 'bg-transparent py-6'}
      `}
        >
            <div className="container mx-auto flex items-center justify-between px-6">
                {/* Logo */}
                <ViewTransitionLink to="/" className="flex items-center space-x-3">
                    <img src={LogoIcon} alt="Eclypse Icon" className="w-6 h-6" />
                    <img src={LogoText} alt="Eclypse®" className="h-6" />
                </ViewTransitionLink>

                {/* Navigation */}
                <nav className="flex items-center space-x-8">
                    {['about', 'waitlist', 'cart'].map((path) => (
                        <ViewTransitionLink
                            key={path}
                            to={`/${path}`}
                            className={`
                text-white text-xl font-bold hover:text-gray-100 transition-colors
                ${scrolled ? 'text-white/90' : 'text-white/70'}
              `}
                        >
                            {path.charAt(0).toUpperCase() + path.slice(1)}
                        </ViewTransitionLink>
                    ))}

                    <button
                        onClick={() => navigate('/buy')}
                        className={`
              text-2xl font-bold px-5 py-2 rounded-full transition-transform
              ${scrolled
                                ? 'bg-white/90 text-black hover:bg-white'
                                : 'bg-white text-black hover:bg-white/90'}
              transform hover:scale-105
            `}
                    >
                        Buy
                    </button>
                </nav>
            </div>
        </header>
    )
}
export default Navbar