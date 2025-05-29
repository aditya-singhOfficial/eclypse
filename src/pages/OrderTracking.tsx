import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../context/useOrder';
import { ORDER_STATUS, type OrderStatus } from '../types/orderTypes';
import { motion } from 'framer-motion';

const OrderTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderByTrackingId } = useOrder();
  const navigate = useNavigate();
  const [trackingInput, setTrackingInput] = useState<string>('');
  
  // Get the order details from tracking ID
  const order = id ? getOrderByTrackingId(id) : null;
  
  // Format date to display in a user-friendly way
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format time to display in a user-friendly way
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleTrackOrder = () => {
    if (trackingInput.trim()) {
      navigate(`/track-order/${trackingInput.trim()}`);
    }
  };
  // Get step status for the progress bar
  const getStepStatus = (step: OrderStatus) => {
    const orderStatusValues = Object.values(ORDER_STATUS);
    const orderStatusIndex = orderStatusValues.indexOf(order?.status || ORDER_STATUS.PLACED);
    const stepIndex = orderStatusValues.indexOf(step);
    
    if (stepIndex < orderStatusIndex) {
      return 'completed';
    } else if (stepIndex === orderStatusIndex) {
      return 'current';
    } else {
      return 'upcoming';
    }
  };

  return (
    <div className="bg-black text-white min-h-screen py-24 sm:py-28 md:py-32 lg:py-36 px-4 sm:px-6 md:px-12 lg:px-16">
      <div className="w-full max-w-7xl mx-auto">
        <motion.h1
          className="text-xl md:text-4xl font-medium mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Track Your Order
        </motion.h1>
        
        {!order ? (
          <motion.div
            className="max-w-xl mx-auto bg-gray-900 border border-gray-800 p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-xl font-medium mb-6">Enter Your Tracking Number</h2>
            <div className="flex flex-col sm:flex-row">
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Enter tracking number"
                className="w-full bg-black border border-gray-800 px-4 py-2 text-white focus:outline-none focus:border-gray-600 mb-4 sm:mb-0 sm:mr-4"
              />
              <button
                onClick={handleTrackOrder}
                className="bg-white text-black hover:bg-[#f63030] hover:text-white font-medium py-2 px-6 transition-colors whitespace-nowrap"
              >
                Track Order
              </button>
            </div>
            {id && (
              <div className="mt-6 text-center text-[#f63030]">
                <p>No order found with tracking number: {id}</p>
                <p className="text-gray-400 mt-2">Please check the tracking number and try again.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 p-8 mb-12">
              <div className="flex flex-col md:flex-row justify-between mb-8">
                <div>
                  <h2 className="text-xl font-medium">Tracking Number: {order.trackingId}</h2>
                  <p className="text-gray-400">Order #{order.id}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-gray-400">Estimated Delivery:</p>
                  <p className="font-medium">{formatDate(order.estimatedDelivery)}</p>
                </div>
              </div>
              
              {/* Tracking Progress */}              <div className="relative mb-16">
                <div className="absolute top-4 left-0 w-full h-1 bg-gray-800">
                  <div 
                    className="h-full bg-[#f63030]" 
                    style={{ 
                      width: `${(Object.values(ORDER_STATUS).indexOf(order.status) / (Object.values(ORDER_STATUS).length - 1)) * 100}%` 
                    }}
                  ></div>
                </div>
                
                <div className="relative flex justify-between">
                  {Object.values(ORDER_STATUS).map((status: OrderStatus, index: number) => {
                    const stepStatus = getStepStatus(status);
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                            stepStatus === 'completed' 
                              ? 'bg-[#f63030] text-white' 
                              : stepStatus === 'current' 
                                ? 'border-2 border-[#f63030] bg-black text-white' 
                                : 'bg-gray-800 text-gray-500'
                          }`}
                        >
                          {stepStatus === 'completed' ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                            </svg>
                          ) : (
                            index + 1
                          )}
                        </div>                        <span 
                          className={`text-xs mt-2 whitespace-nowrap ${
                            stepStatus === 'completed' || stepStatus === 'current' 
                              ? 'text-white' 
                              : 'text-gray-500'
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Tracking Events */}              <h3 className="text-lg font-medium mb-4">Tracking Details</h3>
              <div className="space-y-6">
                {order.trackingEvents?.map((event: { status: string, timestamp: Date, location?: string, description?: string }, index: number) => (
                  <div key={index} className="relative">
                    {index !== order.trackingEvents!.length - 1 && (
                      <div className="absolute top-8 left-4 w-px h-full bg-gray-800"></div>
                    )}
                    <div className="flex">
                      <div className="mr-6">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-[#f63030] text-white' : 'bg-gray-800 text-gray-400'
                        }`}>
                          {index === 0 ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                            </svg>
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <h4 className="font-medium">{event.status}</h4>
                          <div className="text-sm text-gray-400">
                            {formatDate(event.timestamp)} at {formatTime(event.timestamp)}
                          </div>
                        </div>
                        {event.location && (
                          <p className="text-gray-400 mt-1">{event.location}</p>
                        )}
                        {event.description && (
                          <p className="text-sm mt-1">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <button
                  onClick={() => navigate(`/order/${order.id}`)}
                  className="bg-white text-black hover:bg-[#f63030] hover:text-white font-medium py-3 px-8 transition-colors mr-4"
                >
                  View Order Details
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="border border-white text-white hover:bg-white hover:text-black font-medium py-3 px-8 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
