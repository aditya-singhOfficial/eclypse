import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import { motion } from "framer-motion";
import { productsAPI, handleApiError } from "../services/api";
import type { Product } from "../types/productTypes";

const Products: React.FC = () => {
  const nav = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productsAPI.getAll();
        setProducts(response.data);
      } catch (err: unknown) {
        setError(handleApiError(err));
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product._id,
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

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-t-4 border-[#f63030] border-solid rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-400 text-lg mb-4">Failed to load products</p>
            <p className="text-gray-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {products.map((product) => (
              <motion.div
                key={product._id}
                variants={itemVariants}
                className="group"
              >
                <div
                  className="relative overflow-hidden rounded-lg cursor-pointer mb-4"
                  onClick={() => nav(`/product/${product._id}`)}
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
                      onClick={() => nav(`/product/${product._id}`)}
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
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
