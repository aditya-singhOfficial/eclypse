"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Accordion Item Component
interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-500">
            <button
                className="flex items-center justify-between w-full py-4 text-left"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="text-base font-medium">{title}</span>
                <svg
                    className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div
                className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}
            >
                {children}
            </div>
        </div>
    );
};

const productImages = [
    "/home/product/asset_1.png",
    "/home/product/asset_2.png",
    "/home/product/asset_3.png",
];

const ProductShowcase: React.FC = () => {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const nav = useNavigate();
    const handleSizeClick = (size: string) => {
        setSelectedSize(size);
    };
    const handleBuyNow = () => {
        nav("/checkout", {
            state: {
                itemName: "Silhouette No. 1 – Vermilion",
                itemPrice: 7999,
                shipping: 1400,
                beforeTax: 6599,
                tax: 200,
                total: 8199,
                selectedSize,
            },
        });
    };
    return (
        <div className="bg-black text-white font-sans my-10 px-4 sm:px-6 md:px-12 lg:px-16">
            {/* Product Header - Same for both views */}
            <div className="py-6 md:py-10">
                <h1 className="text-xl md:text-4xl font-medium">
                    Silhouette No. 1 – Vermilion
                </h1>
            </div>            {/* Desktop Layout */}
            <div className="container hidden md:flex md:flex-row w-full max-w-[1920px] mx-auto">
                {/* Product Video - Left Side (Desktop) */}
                <div className="w-1/2 max-h-[85vh] overflow-hidden">
                    <video
                        src="/home/product/product.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                        poster="/home/product/product_fall.png"
                    />
                </div>                {/* Product Details - Right Side (Desktop) */}
                <div className="bg-white text-black px-12 py-10 flex items-center w-1/2 max-h-[85vh] overflow-y-auto">
                    <div className="w-full">
                        {/* Product Description */}
                        <p className="text-sm mb-10 font-semibold">
                            A tailored composition in motion. Cut from structured wool with a sculpted shoulder and
                            softened hem, this piece captures presence without force. Worn here in the stillness of a
                            city in motion.
                        </p>                        {/* Thumbnails */}
                        <div className="flex justify-between mb-10">
                            {productImages.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt={`Product view ${index + 1}`}
                                    className="w-[32%] h-36 object-cover"
                                />
                            ))}
                        </div>

                        {/* Price */}
                        <div className="text-2xl font-medium mb-1">₹ 7,999</div>
                        <p className="text-xs text-gray-500 mb-6">MRP incl. of all taxes</p>
                        {/* Size Selector */}
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm">Please select a size</p>
                            <a href="#" className="text-xs">Size chart</a>
                        </div>                        <div className="grid grid-cols-5 gap-2 mb-6">
                            {["XS", "S", "M", "L", "XL"].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => handleSizeClick(size)}
                                    className={`border py-2 px-1 text-sm ${selectedSize === size
                                        ? "bg-black text-white border-black"
                                        : "border-gray-200 text-gray-800 hover:bg-gray-50"
                                        } rounded-md`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>                        {/* Action Buttons - Desktop order */}
                        <div className="flex gap-4 mt-4 mb-8">
                            <button className="w-full border-[3px] border-gray-400 text-black py-3 text-sm rounded-md flex-1/4 cursor-pointer hover:bg-[#f63030] transition-all duration-500 hover:text-white hover:border-[#f63030] font-semibold">
                                Add to Cart
                            </button>
                            <button onClick={handleBuyNow} className="w-full bg-black text-white py-3 text-sm font-bold rounded-md hover:bg-[#f63030] transition-all duration-500 cursor-pointer flex-3/4">
                                Buy
                            </button>
                        </div>
                    </div>

                </div>

            </div>{/* Mobile Layout */}
            <div className="md:hidden">                {/* Main Product Video - Mobile */}
                <div className="w-full max-h-[70vh] overflow-hidden">
                    <video
                        src="/home/product/product.mp4"
                        autoPlay
                        preload={"none"}
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                        poster="/home/product/product_fall.png"
                    />
                </div>

                {/* Product Thumbnails - Mobile */}
                <div className="flex w-full bg-neutral-100 py-3">
                    {productImages.map((src, index) => (
                        <div key={index} className="flex-1 px-1">
                            <img
                                src={src}
                                alt={`Product view ${index + 1}`}
                                className="w-full h-24 object-cover"
                            />
                        </div>
                    ))}
                </div>

                {/* Product Details - Mobile */}
                <div className="bg-white text-black px-4 py-5">                    {/* Mobile Description */}
                    <p className="text-xs mb-6">
                        A tailored composition in motion. Cut from structured wool with a sculpted shoulder and softened
                        hem, this piece captures presence without force. Worn here in the stillness of a city in motion.
                    </p>

                    {/* Price */}
                    <div className="text-xl font-medium mb-1">₹ 7,999</div>
                    <p className="text-xs text-gray-500 mb-4">MRP incl. of all taxes</p>
                    {/* Size Selector - Mobile */}
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm">Please select a size</p>
                        <a href="#" className="text-xs hover:underline">Size chart</a>
                    </div>

                    <div className="grid grid-cols-5 gap-2 mb-6">
                        {["XS", "S", "M", "L", "XL"].map((size) => (
                            <button
                                key={size}
                                onClick={() => handleSizeClick(size)}
                                className={`border py-3 text-xs ${selectedSize === size
                                    ? "bg-black text-white border-black"
                                    : "border-gray-200 text-gray-800 hover:bg-gray-50"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>                    {/* Action Buttons - Mobile order (reversed from desktop) */}
                    <div className="flex flex-col gap-3 mt-4 mb-8">
                        <button className="w-full border-[3px] border-gray-400 text-black py-3 text-sm rounded-md flex-1/4 cursor-pointer hover:bg-[#f63030] transition-all duration-500 hover:text-white hover:border-[#f63030] font-semibold">
                            Add to Cart
                        </button>
                        <button onClick={handleBuyNow} className="w-full bg-black text-white py-3 text-sm font-bold rounded-md hover:bg-[#f63030] transition-all duration-500 cursor-pointer flex-3/4">
                            Buy
                        </button>
                    </div>

                </div>
            </div>
            {/* Product Information Accordions */}
            <div className="mt-12">

                <AccordionItem title="Size & Fit">
                    <div className="py-4 text-sm">
                        <p>- Regular fit</p>
                        <p>- The model is 175cm/5'9" and wears a size Small</p>
                        <p>- 100% Wool</p>
                    </div>
                </AccordionItem>

                <AccordionItem title="Delivery & Returns">
                    <div className="py-4 text-sm">
                        <p>- Free standard delivery on orders over ₹5000</p>
                        <p>- Standard delivery 3-5 working days</p>
                        <p>- Free returns within 14 days</p>
                    </div>
                </AccordionItem>

                <AccordionItem title="How This Was Made">
                    <div className="py-4 text-sm">
                        <p>This piece was crafted in our atelier using traditional tailoring techniques. The structured
                            wool is sourced from sustainable providers and cut with precision to create the signature
                            silhouette.</p>
                    </div>
                </AccordionItem>
            </div>
        </div>
    );
};

export default ProductShowcase;
