import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();
  
  const shipping = 1400; // Standard shipping cost
  const tax = 200; // Standard tax amount
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    // If there's only one item in cart
    if (cartItems.length === 1) {
      const item = cartItems[0];
      navigate("/checkout", {
        state: {
          itemName: item.name,
          itemPrice: item.price * item.quantity,
          shipping,
          beforeTax: subtotal,
          tax,
          total,
          selectedSize: item.selectedSize,
        },
      });
    } else {
      // For multiple items
      navigate("/checkout", {
        state: {
          itemName: `${cartItems.length} items`,
          itemPrice: subtotal,
          shipping,
          beforeTax: subtotal,
          tax,
          total,
          selectedSize: null,
        },
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
        damping: 20
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
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Shopping Cart
        </motion.h1>
        
        {cartItems.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-gray-400 text-xl mb-8">Your cart is empty.</p>
            <button 
              onClick={() => navigate("/products")} 
              className="bg-white text-black hover:bg-[#f63030] hover:text-white font-medium py-3 px-8 transition-colors"
            >
              Explore Collection
            </button>
          </motion.div>
        ) : (
          <motion.div 
            className="flex flex-col lg:flex-row gap-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Cart Items */}
            <motion.div 
              className="lg:flex-grow"
              variants={itemVariants}
            >
              {cartItems.map((item) => (
                <motion.div 
                  key={item.id} 
                  className="flex border-b border-gray-800 py-6 gap-6"
                  variants={itemVariants}
                >
                  <div className="w-28 h-28 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-lg">{item.name}</h3>
                    <p className="text-gray-300 mt-1">₹{item.price.toLocaleString()}</p>
                    {item.selectedSize && (
                      <p className="text-gray-400 text-sm mt-1">Size: {item.selectedSize}</p>
                    )}
                    <div className="flex items-center mt-4">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-600 hover:border-white transition-colors"
                      >
                        -
                      </button>
                      <span className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-600">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-600 hover:border-white transition-colors"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="ml-6 text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="font-medium text-lg">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Order Summary */}
            <motion.div 
              className="lg:w-80"
              variants={itemVariants}
            >
              <div className="border border-gray-800 p-6">
                <h2 className="text-xl font-medium mb-6">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span>₹{shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg pt-4 border-t border-gray-800">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-white text-black hover:bg-[#f63030] hover:text-white font-medium py-3 transition-colors"
                >
                  Checkout
                </button>
                <button 
                  onClick={() => navigate("/products")}
                  className="w-full mt-4 border border-white text-white hover:bg-white hover:text-black font-medium py-3 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Cart;
