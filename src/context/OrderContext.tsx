import React, { createContext, useState, useEffect } from 'react';
import type { CartItem } from './CartContext';
import type { OrderStatus } from '../types/orderTypes';
import { ORDER_STATUS } from '../types/orderTypes';

// Define interfaces for orders
export interface OrderAddress {
  firstName: string;
  lastName: string;
  street: string;
  apt?: string;
  state: string;
  zip: string;
}

export interface OrderPayment {
  paymentMethod: 'card' | 'cod';
  cardNumber?: string;
  expiry?: string;
  last4?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  itemName: string;
  itemPrice: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: OrderAddress;
  payment: OrderPayment;
  status: OrderStatus;
  createdAt: Date;
  estimatedDelivery: Date;
  trackingId?: string;
  trackingEvents?: {
    status: string;
    timestamp: Date;
    location?: string;
    description?: string;
  }[];
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'estimatedDelivery' | 'status' | 'trackingEvents'>) => string;
  getOrder: (id: string) => Order | undefined;
  getOrderByTrackingId: (trackingId: string) => Order | undefined;
}

// Create the context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {// Initialize orders from localStorage if available
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      // Convert string dates back to Date objects
      return parsedOrders.map((order: Omit<Order, 'createdAt' | 'estimatedDelivery' | 'trackingEvents'> & {
        createdAt: string;
        estimatedDelivery: string;
        trackingEvents?: {
          status: string;
          timestamp: string;
          location?: string;
          description?: string;
        }[];
      }) => ({
        ...order,
        createdAt: new Date(order.createdAt),
        estimatedDelivery: new Date(order.estimatedDelivery),
        trackingEvents: order.trackingEvents?.map((event) => ({
          ...event,
          timestamp: new Date(event.timestamp)
        }))
      }));
    }
    return [];
  });

  // Save orders to localStorage when they change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Add a new order
  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'estimatedDelivery' | 'status' | 'trackingEvents'>) => {
    // Generate a random order ID
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Generate a random tracking ID
    const trackingId = `TRK${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    
    // Create timestamp for order
    const createdAt = new Date();
    
    // Calculate estimated delivery (5-7 business days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5 + Math.floor(Math.random() * 3));
      // Initial tracking event
    const trackingEvents = [
      {
        status: ORDER_STATUS.PLACED,
        timestamp: new Date(),
        location: 'Online',
        description: 'Order has been placed successfully.'
      }
    ];
    
    // Create the complete order object
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      status: ORDER_STATUS.PLACED,
      createdAt,
      estimatedDelivery,
      trackingId,
      trackingEvents
    };
    
    // Add to orders state
    setOrders(prevOrders => [...prevOrders, newOrder]);
    
    return orderId;
  };

  // Get a specific order by ID
  const getOrder = (id: string) => {
    return orders.find(order => order.id === id);
  };

  // Get a specific order by tracking ID
  const getOrderByTrackingId = (trackingId: string) => {
    return orders.find(order => order.trackingId === trackingId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        getOrder,
        getOrderByTrackingId
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
