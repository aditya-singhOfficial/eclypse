import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

// Dummy product data for demonstration. Replace with real API/data fetching.
const PRODUCTS = [
  {
    id: "1",
    name: "Silhouette No. 1 – Vermilion",
    price: 7999,
    images: [
      "/home/product/asset_1.png",
      "/home/product/asset_2.png",
      "/home/product/asset_3.png",
    ],
    description:
      "A tailored composition in motion. Cut from structured wool with a sculpted shoulder and softened hem, this piece captures presence without force.",
    details: [
      "Premium wool blend in signature vermilion",
      "Discreet side pockets with clean finish",
      "Hand-cut and assembled in small batches",
      "Dry clean only",
    ],
  },
  {
    id: "2",
    name: "Silhouette No. 2 – Azure",
    price: 8999,
    images: [
      "/home/product/asset_2.png",
      "/home/product/asset_1.png",
      "/home/product/asset_3.png",
    ],
    description:
      "Azure blue, modern fit, premium wool blend with immaculate tailoring for a confident, composed silhouette in any setting.",
    details: [
      "Premium wool blend in azure blue",
      "Tailored fit with modern proportions",
      "Hand-finished details",
      "Dry clean only",
    ],
  },
  {
    id: "3",
    name: "Silhouette No. 3 – Charcoal",
    price: 9999,
    images: [
      "/home/product/asset_3.png",
      "/home/product/asset_1.png",
      "/home/product/asset_2.png",
    ],
    description:
      "Charcoal grey, classic cut, luxury finish with exceptional detail. Urban sophistication meets timeless craftsmanship.",
    details: [
      "Premium wool blend in charcoal grey",
      "Classic cut with contemporary details",
      "Meticulously crafted construction",
      "Dry clean only",
    ],
  },
];

const Product: React.FC = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<number>(0);
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center py-24 sm:py-28 md:py-32 lg:py-36">
        Product not found.
      </div>
    );

  const handleBuyNow = () => {
    nav("/checkout", {
      state: {
        itemName: product.name,
        itemPrice: product.price,
        shipping: 1400,
        beforeTax: product.price - 1400 - 200,
        tax: 200,
        total: product.price + 1400 + 200,
        selectedSize,
      },
    });
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      selectedSize,
    });

    // Show a success message
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-black text-white min-h-screen py-24 sm:py-28 md:py-32 lg:py-36 px-4 sm:px-6 md:px-12 lg:px-16">
      <div className="w-full max-w-7xl mx-auto">
        <motion.div
          className="flex flex-col md:flex-row gap-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Left column - images */}
          <div className="w-full md:w-1/2 space-y-4">
            <motion.div
              className="overflow-hidden rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src={product.images[mainImage]}
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
            </motion.div>

            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className={`cursor-pointer overflow-hidden rounded-lg border-2 ${
                    mainImage === i ? "border-white" : "border-transparent"
                  }`}
                  onClick={() => setMainImage(i)}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    className="w-24 h-24 object-cover"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column - details */}
          <div className="w-full md:w-1/2 space-y-6">
            <motion.h1
              className="text-xl md:text-4xl font-medium"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {product.name}
            </motion.h1>

            <motion.p
              className="text-gray-300 text-sm font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {product.description}
            </motion.p>

            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg font-medium">Details</h3>
              <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
                {product.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="text-2xl font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              ₹{product.price.toLocaleString()}
            </motion.div>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Select Size</h3>
                <div className="flex gap-3">
                  {["XS", "S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      className={`w-12 h-12 flex items-center justify-center border transition-colors ${
                        selectedSize === size
                          ? "border-white text-white"
                          : "border-gray-600 text-gray-400 hover:border-gray-300 hover:text-gray-200"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  className={`flex-1 border border-white text-white py-3 px-6 transition-colors hover:bg-white hover:text-black ${
                    !selectedSize ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleBuyNow}
                  disabled={!selectedSize}
                >
                  Buy Now
                </button>
                <button
                  className={`flex-1 bg-white text-black py-3 px-6 transition-colors hover:bg-[#f63030] hover:text-white ${
                    !selectedSize ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Product;
