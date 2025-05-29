"use client";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoIcon from '../assets/logo.jpg';
import ViewTransitionLink from './ViewTransitionLink';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const { totalItems } = useCart();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

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
                <nav className="flex flex-wrap items-center space-x-4 md:space-x-8">                    <ViewTransitionLink
                        to="/products"
                        className={`
                text-white text-md md:text-xl font-semibold hover:text-gray-100 transition-colors
                ${scrolled ? 'text-white/90' : 'text-white/70'}
              `}
                    >
                        Products
                    </ViewTransitionLink>
                    
                    <ViewTransitionLink
                        to="/order-history"
                        className={`
                text-white text-md md:text-xl font-semibold hover:text-gray-100 transition-colors
                ${scrolled ? 'text-white/90' : 'text-white/70'}
              `}
                    >
                        Orders
                    </ViewTransitionLink>
                    
                    {/* Cart with count */}
                    <ViewTransitionLink
                        to="/cart"
                        className={`
                text-white text-md md:text-xl font-semibold hover:text-gray-100 transition-colors relative
                ${scrolled ? 'text-white/90' : 'text-white/70'}
              `}
                    >
                        Cart
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#f63030] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </ViewTransitionLink>

                    <button
                        onClick={() => navigate('/products')}
                        className={`
              text-2xl font-bold px-3 py-1.5 rounded-md transition-transform
              ${scrolled
                            ? 'bg-white/90 text-black hover:bg-white'
                            : 'bg-white text-black hover:bg-white/90'}
              transform hover:scale-105
            `}
                    >
                        Shop
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;