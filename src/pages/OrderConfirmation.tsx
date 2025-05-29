import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../context/useOrder';
import { motion } from 'framer-motion';

const OrderConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrder } = useOrder();
  const navigate = useNavigate();
  
  // Get the order details
  const order = getOrder(id || '');
  
  if (!order) {
    return (
      <div className="bg-black text-white min-h-screen py-24 sm:py-28 md:py-32 lg:py-36 px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="w-full max-w-7xl mx-auto text-center">
          <h1 className="text-xl md:text-4xl font-medium mb-8">Order Not Found</h1>
          <p className="text-gray-400 text-xl mb-8">We couldn't find the order you're looking for.</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-white text-black hover:bg-[#f63030] hover:text-white font-medium py-3 px-8 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  
  // Format date to display in a user-friendly way
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-black text-white min-h-screen py-24 sm:py-28 md:py-32 lg:py-36 px-4 sm:px-6 md:px-12 lg:px-16">
      <div className="w-full max-w-3xl mx-auto">
        <motion.div
          className="bg-gray-900 border border-gray-800 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-[#f63030] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#f63030]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-medium mb-4">Thank You For Your Order!</h2>
            <p className="text-gray-300 mb-4">Your order has been placed successfully.</p>
            <p className="text-gray-300 mb-8">Order ID: <span className="font-medium">{order.id}</span></p>
          </div>
          
          {order.shippingAddress && (
            <div className="border-t border-gray-800 pt-6 mb-6">
              <h3 className="font-medium mb-2">Shipping Information:</h3>
              <p className="text-gray-300">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p className="text-gray-300">{order.shippingAddress.street}{order.shippingAddress.apt ? `, Apt ${order.shippingAddress.apt}` : ''}</p>
              <p className="text-gray-300">{order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            </div>
          )}
          
          {order.payment && (
            <div className="border-t border-gray-800 pt-6 mb-6">
              <h3 className="font-medium mb-2">Payment Method:</h3>
              <p className="text-gray-300">
                {order.payment.paymentMethod === 'card' 
                  ? `Credit/Debit Card (ending in ${order.payment.last4 || '****'})` 
                  : 'Cash on Delivery'}
              </p>
            </div>
          )}
          
          <div className="border-t border-gray-800 pt-6 mb-6">
            <h3 className="font-medium mb-2">Order Summary:</h3>
            <div className="flex justify-between mb-1">
              <span className="text-gray-300">Items:</span>
              <span className="text-gray-300">₹{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-300">Shipping:</span>
              <span className="text-gray-300">₹{order.shipping.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-300">Tax:</span>
              <span className="text-gray-300">₹{order.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>₹{order.total.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 mb-6">
            <h3 className="font-medium mb-2">Delivery Information:</h3>
            <p className="text-gray-300">Estimated Delivery: {formatDate(order.estimatedDelivery)}</p>
            <p className="text-gray-300">Tracking ID: {order.trackingId}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
            <button 
              onClick={() => navigate(`/track-order/${order.trackingId}`)}
              className="bg-white text-black hover:bg-[#f63030] hover:text-white font-medium py-3 px-8 transition-colors"
            >
              Track Order
            </button>
            <button 
              onClick={() => navigate("/")}
              className="border border-white text-white hover:bg-white hover:text-black font-medium py-3 px-8 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
