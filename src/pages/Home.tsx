// src/pages/Home.tsx
import React from "react";
import HeroSection from "../components/home/HeroSection";
import MediaGrid from "../components/home/MediaGrid.tsx";
import ProductShowcase from "../components/home/ProductShowcase.tsx";
import { Helmet } from "react-helmet-async";
import Testimonials from "../components/home/Testimonials.tsx";

const HomePage: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>Home - Eclypse</title>
                <meta name="description"
                    content="Welcome to the home page of our website. Explore our products and services." />
                <link rel="canonical" href="https://www.example.com/" />
            </Helmet>
            <main
                className="flex flex-col items-center justify-center flex-grow min-h-screen bg-black text-white px-4 sm:px-6 md:px-8 lg:px-16"
            >
                <div className="w-full max-w-7xl">
                    <HeroSection />
                    <MediaGrid />
                    <ProductShowcase />
                    <Testimonials />
                </div>
            </main>
        </>
    );
};

export default HomePage;
