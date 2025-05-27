"use client";
import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import LogoIcon from '../assets/logo.jpg'
import ViewTransitionLink from './ViewTransitionLink'

const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', onScroll, {passive: true})
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header
            className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-500
        ${scrolled
                ? 'bg-white/5 backdrop-blur-2xl shadow-2xl py-4'
                : 'bg-transparent py-6'}
      `}
        >
            <div className="flex flex-wrap items-center justify-between md:justify-around px-4">
                {/* Logo */}
                <ViewTransitionLink to="/" className="flex items-center space-x-3">
                    <img src={LogoIcon} alt="Eclypse Icon" className="w-12 h-12 rounded-md"/>
                </ViewTransitionLink>

                {/* Navigation */}
                <nav className="flex flex-wrap items-center space-x-4 md:space-x-8">
                    {['about', 'waitlist', 'cart'].map((path) => (
                        <ViewTransitionLink
                            key={path}
                            to={`/${path}`}
                            className={`
                text-white text-md md:text-xl font-semibold hover:text-gray-100 transition-colors
                ${scrolled ? 'text-white/90' : 'text-white/70'}
              `}
                        >
                            {path.charAt(0).toUpperCase() + path.slice(1)}
                        </ViewTransitionLink>
                    ))}

                    <button
                        onClick={() => navigate('/buy')}
                        className={`
              text-2xl font-bold px-3 py-1.5 rounded-md transition-transform
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