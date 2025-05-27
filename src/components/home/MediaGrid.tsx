import React from "react";

interface Media {
    src: string;
    caption?: string;
    hoverSrc?: string;
}

const mediaItems: Media[] = [
    {src: "/home/Frame_3.png", caption: "Premium wool blend in signature vermilion"},
    {src: "/home/Frame_1.png", caption: "Discreet side pockets with clean finish"},
    {src: "/home/Frame_2.png", caption: "Hand-cut and assembled in small batches"},
    {
        src: "/home/Frame_4.png",       // Logo image
        hoverSrc: "/src/assets/logo-text.svg" // Logo hover image
    },
];

const MediaGrid: React.FC = () => (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2">
        {/* 1) Video: spans 2 cols on md, single row */}
        <div className="relative overflow-hidden rounded-lg md:col-span-2 md:row-span-1">
            <video
                src="/hero.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
            />
        </div>

        {/* 2) Single image next to video */}
        <div
            className="relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] md:col-span-1 md:row-span-1">
            <img
                src={mediaItems[0].src}
                alt={mediaItems[0].caption}
                className="w-full h-full object-cover"
            />
            <div
                className="absolute inset-0 flex items-end bg-black bg-opacity-40 opacity-0 hover:opacity-60 transition-opacity duration-500 p-4 text-white text-3xl font-bold">
                {mediaItems[0].caption}
            </div>
        </div>

        {/* 3-5) Three images below spanning full width */}
        {mediaItems.slice(1).map((item, idx) => (
            <div
                key={idx}
                className="relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] md:col-span-1 md:row-span-1"
            >
                <img
                    src={item.src}
                    alt={item.caption || "Logo"}
                    className={`w-full h-full ${idx === 2 && item.hoverSrc ? "object-contain bg-black" : "object-cover"}`}
                />
                {/* If logo with hoverSrc, swap image */}
                {idx === 2 && item.hoverSrc && (
                    <img
                        src={item.hoverSrc}
                        alt="hover"
                        className="absolute inset-0 w-full h-full object-contain opacity-0 hover:opacity-100 transition-all duration-500 bg-black"
                    />
                )}
                {/* Caption overlay for non-logo images */}
                {idx < 2 && (
                    <div
                        className="absolute inset-0 flex items-end bg-black bg-opacity-40 opacity-0 hover:opacity-60 transition-opacity duration-500 p-4 text-white text-3xl font-bold">
                        {item.caption}
                    </div>
                )}
            </div>
        ))}
    </div>
);

export default MediaGrid;
