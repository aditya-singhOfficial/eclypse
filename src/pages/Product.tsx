import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import { motion } from "framer-motion";
import { productsAPI, handleApiError } from "../services/api";
import type { Product as ProductType } from "../types/productTypes";

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<number>(0);
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await productsAPI.getById(id);
        setProduct(response.data);
      } catch (err: unknown) {
        setError(handleApiError(err));
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center py-24 sm:py-28 md:py-32 lg:py-36">
        <div className="w-16 h-16 border-t-4 border-[#f63030] border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center py-24 sm:py-28 md:py-32 lg:py-36">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">Failed to load product</p>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => nav('/products')}
            className="px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center py-24 sm:py-28 md:py-32 lg:py-36">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Product not found</p>
          <button
            onClick={() => nav('/products')}
            className="px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];

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
      productId: product._id,
      name: product.name,
      price: product.price,
      image: productImages[0],
      selectedSize,
    });

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
                src={productImages[mainImage]}
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
              {productImages.map((img, i) => (
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
            </motion.p>            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {product.details && product.details.length > 0 && (
                <>
                  <h3 className="text-lg font-medium">Details</h3>
                  <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
                    {product.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </>
              )}
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
                  {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
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

export default ProductPage;
