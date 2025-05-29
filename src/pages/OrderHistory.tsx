import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/useOrder';
import { ORDER_STATUS, type OrderStatus } from '../types/orderTypes';
import { motion } from 'framer-motion';

const OrderHistory: React.FC = () => {
  const { orders } = useOrder();
  const navigate = useNavigate();
  
  // Sort orders by creation date (newest first)
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Format date to display in a user-friendly way
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status color based on order status
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case ORDER_STATUS.PLACED:
        return 'text-blue-400';
      case ORDER_STATUS.PROCESSING:
        return 'text-yellow-400';
      case ORDER_STATUS.SHIPPED:
        return 'text-purple-400';
      case ORDER_STATUS.OUT_FOR_DELIVERY:
        return 'text-orange-400';
      case ORDER_STATUS.DELIVERED:
        return 'text-green-400';
      default:
        return 'text-gray-400';
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
          Order History
        </motion.h1>
        
        {sortedOrders.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-gray-400 text-xl mb-8">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-white text-black hover:bg-[#f63030] hover:text-white font-medium py-3 px-8 transition-colors"
            >
              Explore Collection
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sortedOrders.map((order) => (
              <motion.div
                key={order.id}
                className="border border-gray-800 p-6 bg-gray-900 hover:border-gray-600 transition-colors"
                variants={itemVariants}
                onClick={() => navigate(`/order/${order.id}`)}
                whileHover={{ scale: 1.01 }}
                style={{ cursor: 'pointer' }}
              >
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Order #{order.id}</h3>
                    <p className="text-gray-400 text-sm">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className={`font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4 border-t border-gray-800 pt-4">
                  <h4 className="text-sm text-gray-400 mb-2">Items:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center">
                        <span className="text-sm">{item.quantity}x {item.name}</span>
                        {item.selectedSize && (
                          <span className="text-xs text-gray-400 ml-2">(Size: {item.selectedSize})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between border-t border-gray-800 pt-4">
                  <div className="mb-2 md:mb-0">
                    <p className="text-sm text-gray-400">Estimated Delivery:</p>
                    <p>{formatDate(order.estimatedDelivery)}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-lg font-medium">₹{order.total.toLocaleString()}</p>
                    <div className="ml-4 md:ml-8">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/track-order/${order.trackingId}`);
                        }}
                        className="text-sm bg-transparent border border-white text-white hover:bg-white hover:text-black px-4 py-1 transition-colors"
                      >
                        Track Order
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
