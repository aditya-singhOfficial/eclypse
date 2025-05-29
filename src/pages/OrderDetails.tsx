import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../context/useOrder';
import type { OrderStatus } from '../types/orderTypes';
import type { CartItem } from '../context/CartContext';
import { motion } from 'framer-motion';

const OrderDetails: React.FC = () => {
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
          <p className="text-gray-400 text-xl mb-8">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/order-history")}
            className="bg-white text-black hover:bg-[#f63030] hover:text-white font-medium py-3 px-8 transition-colors"
          >
            View Order History
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
  };  // Get status color based on order status
  const getStatusColor = (status: OrderStatus): string => {
    if (status === 'Order Placed') return 'text-blue-400';
    if (status === 'Processing') return 'text-yellow-400';
    if (status === 'Shipped') return 'text-purple-400';
    if (status === 'Out for Delivery') return 'text-orange-400';
    if (status === 'Delivered') return 'text-green-400';
    return 'text-gray-400';
  };

  return (
    <div className="bg-black text-white min-h-screen py-24 sm:py-28 md:py-32 lg:py-36 px-4 sm:px-6 md:px-12 lg:px-16">
      <div className="w-full max-w-7xl mx-auto">
        <motion.div
          className="mb-6 flex flex-col md:flex-row md:items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-xl md:text-4xl font-medium mb-2">Order #{order.id}</h1>
            <p className="text-gray-400">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => navigate(`/track-order/${order.trackingId}`)}
              className="bg-white text-black hover:bg-[#f63030] hover:text-white font-medium py-2 px-6 transition-colors"
            >
              Track Order
            </button>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Status */}
          <motion.div
            className="md:col-span-2 bg-gray-900 border border-gray-800 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-xl font-medium mb-4">Order Status</h2>
            <div className="flex items-center space-x-2 mb-4">
              <span className={`text-lg font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-400">Estimated Delivery: {formatDate(order.estimatedDelivery)}</p>
              {order.trackingId && (
                <p className="text-gray-400 mt-1">Tracking ID: {order.trackingId}</p>
              )}
            </div>              <h2 className="text-xl font-medium mb-4 border-t border-gray-800 pt-6">Items</h2>
            <div className="space-y-4">
              {order.items.map((item: CartItem) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="w-16 h-16 bg-gray-800 rounded flex-shrink-0 mr-4 overflow-hidden"
                      style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    ></div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      {item.selectedSize && (
                        <p className="text-sm text-gray-400">Size: {item.selectedSize}</p>
                      )}
                      <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Order Summary */}
          <motion.div
            className="bg-gray-900 border border-gray-800 p-6 h-fit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-xl font-medium mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span>₹{order.itemPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span>₹{order.shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tax</span>
                <span>₹{order.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium text-lg pt-4 border-t border-gray-800">
                <span>Total</span>
                <span>₹{order.total.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-6">
              <h3 className="font-medium mb-3">Shipping Address</h3>
              <p className="text-gray-300">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p className="text-gray-300">
                {order.shippingAddress.street}
                {order.shippingAddress.apt ? `, Apt ${order.shippingAddress.apt}` : ""}
              </p>
              <p className="text-gray-300 mb-6">
                {order.shippingAddress.state}, {order.shippingAddress.zip}
              </p>
              
              <h3 className="font-medium mb-3">Payment Method</h3>
              <p className="text-gray-300">
                {order.payment.paymentMethod === 'card'
                  ? `Credit/Debit Card (ending in ${order.payment.last4 || '****'})`
                  : 'Cash on Delivery'}
              </p>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button
            onClick={() => navigate("/order-history")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Back to Order History
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetails;
