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
    <section className={"py-16 px-4 sm:px-6 md:px-12 lg:px-16 bg-black text-white"}>
        {/* Desktop & Tablet Grid */}
        <div className="hidden md:grid gap-4 grid-cols-3 grid-rows-2">
            {/* Video spans cols 1–2 row 1 */}
            <div className="relative overflow-hidden rounded-lg col-span-2 row-span-1">
                <video
                    src="/home/videos/media.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    poster={"/home/hero-poster.png"}
                />
            </div>

            {/* Adjacent image in Row1 col3 */}
            <div className="relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02]">
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

            {/* Row2 col1–3: three items */}
            {mediaItems.slice(1).map((item, idx) => (
                <div
                    key={idx}
                    className="relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02]"
                >
                    <img
                        src={item.src}
                        alt={item.caption || "media"}
                        className={
                            `w-full h-full ${idx === 2 && item.hoverSrc ? "object-contain bg-black" : "object-cover"}`
                        }
                    />
                    {idx === 2 && item.hoverSrc ? (
                        <img
                            src={item.hoverSrc}
                            alt="Logo hover"
                            className="absolute inset-0 w-full h-full object-contain opacity-0 bg-black hover:opacity-100 transition-opacity duration-500"
                        />
                    ) : (
                        <div
                            className="absolute inset-0 flex items-end bg-black bg-opacity-40 opacity-0 hover:opacity-60 transition-opacity duration-500 p-4 text-white text-3xl font-bold">
                            {item.caption}
                        </div>
                    )}
                </div>
            ))}
        </div>

        {/* Mobile-only: video + row of 3 images */}
        <div className="block md:hidden space-y-4">
            <div className="relative overflow-hidden rounded-lg">
                <video
                    src="/home/videos/media.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    poster={"/home/hero-poster.png"}
                />
            </div>
            <div className="grid grid-cols-3 gap-4">
                {mediaItems.slice(0, 3).map((item, idx) => (
                    <div
                        key={idx}
                        className="relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02]"
                    >
                        <img
                            src={item.src}
                            alt={item.caption || "media"}
                            className="w-full h-full object-cover"
                        />
                        <div
                            className="absolute inset-0 flex items-end bg-black bg-opacity-40 opacity-0 hover:opacity-60 transition-opacity duration-500 p-2 text-white text-sm font-bold">
                            {item.caption}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default MediaGrid;
