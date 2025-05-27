// src/pages/HomePage.tsx
import React from "react";
import HeroSection from "../components/home/HeroSection";
import MediaGrid from "../components/home/MediaGrid.tsx";

const HomePage: React.FC = () => {
    return (
        <main
            className="flex flex-col items-center justify-center flex-grow min-h-screen bg-black text-white px-4 sm:px-6 md:px-8 lg:px-16"
        >
            <div className="w-full max-w-7xl">
                <HeroSection/>
                <MediaGrid/>
            </div>
        </main>
    );
};

export default HomePage;
