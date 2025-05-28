import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

// Dummy product data for demonstration. Replace with real API/data fetching.
const PRODUCTS = [
  {
    id: "1",
    name: "Silhouette No. 1 – Vermilion",
    price: 7999,
    image: "/home/product/asset_1.png",
    description: "A tailored composition in motion. Cut from structured wool with a sculpted shoulder and softened hem, this piece captures presence without force.",
  },
  {
    id: "2",
    name: "Silhouette No. 2 – Azure",
    price: 8999,
    image: "/home/product/asset_2.png",
    description: "Azure blue, modern fit, premium wool blend with immaculate tailoring for a confident, composed silhouette in any setting.",
  },
  {
    id: "3",
    name: "Silhouette No. 3 – Charcoal",
    price: 9999,
    image: "/home/product/asset_3.png",
    description: "Charcoal grey, classic cut, luxury finish with exceptional detail. Urban sophistication meets timeless craftsmanship.",
  },
];

const Products: React.FC = () => {
  const nav = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    alert(`${product.name} added to cart!`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.5
      }
    }
  };

  return (
    <div className="bg-black text-white min-h-screen py-24 sm:py-28 md:py-32 lg:py-36 px-4 sm:px-6 md:px-12 lg:px-16">
      <div className="w-full max-w-7xl mx-auto">
        <motion.h1 
          className="text-xl md:text-4xl font-medium mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            delay: 0.2,
            ease: "easeOut" 
          }}
        >
          Collection
        </motion.h1>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {PRODUCTS.map((product) => (
            <motion.div 
              key={product.id}
              variants={itemVariants}
              className="group"
            >
              <div 
                className="relative overflow-hidden rounded-lg cursor-pointer mb-4"
                onClick={() => nav(`/product/${product.id}`)}
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-60 transition-opacity duration-500 flex items-center justify-center">
                  <span className="text-white text-2xl font-light">View Details</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-lg">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                <p className="font-light text-xl">₹{product.price.toLocaleString()}</p>
                
                <div className="flex gap-4 mt-4">
                  <button
                    className="flex-1 border border-white text-white py-3 rounded-none hover:bg-white hover:text-black transition-colors duration-300"
                    onClick={() => nav(`/product/${product.id}`)}
                  >
                    View Details
                  </button>
                  <button
                    className="flex-1 bg-white text-black py-3 rounded-none hover:bg-[#f63030] hover:text-white transition-colors duration-300"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Products;
