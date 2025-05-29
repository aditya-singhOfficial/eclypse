import React, { createContext, useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import { useAuth } from './useAuth';
import type { CartItem } from './CartContext';
import type { OrderStatus } from '../types/orderTypes';
import { ORDER_STATUS } from '../types/orderTypes';

export interface OrderAddress {
  firstName: string;
  lastName: string;
  street: string;
  apt?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderPayment {
  paymentMethod: 'card' | 'cod';
  last4?: string;
  cardType?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: OrderAddress;
  payment: OrderPayment;
  status: OrderStatus;
  createdAt: Date;
  estimatedDelivery: Date;
  trackingId?: string;
  trackingEvents: {
    status: string;
    timestamp: Date;
    location?: string;
    description?: string;
  }[];
}

interface ApiOrderItem {
  _id: string;
  product: { _id: string; name: string; price: number; image: string };
  quantity: number;
}

interface ApiOrder {
  _id: string;
  orderItems: ApiOrderItem[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state?: string; // Add optional state here
    postalCode: string;
    country: string;
  };
  paymentMethod: 'card' | 'cod';
  paymentResult?: {
    last4: string;
    cardType: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface ApiError {
  response?: { data?: { message?: string } };
  message?: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (
    orderData: Omit<
      Order,
      'id' | 'createdAt' | 'estimatedDelivery' | 'status' | 'trackingEvents' | 'trackingId'
    >
  ) => Promise<string | Order>; // Allow returning the full order object or just the ID
  getOrder(id: string): Order | undefined;
  getOrderByTrackingId(trackingId: string): Order | undefined;
  isLoading: boolean;
  error: string | null;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const mapStatus = (status: string): OrderStatus => {
    switch (status.toLowerCase()) {
      case 'pending':
        return ORDER_STATUS.PLACED;
      case 'processing':
        return ORDER_STATUS.PROCESSING;
      case 'shipped':
        return ORDER_STATUS.SHIPPED;
      case 'delivered':
        return ORDER_STATUS.DELIVERED;
      default:
        return ORDER_STATUS.PLACED;
    }
  };

  const convertApiOrder = (api: ApiOrder): Order => {
    const items: CartItem[] = api.orderItems.map((i) => ({
      id: i._id,
      productId: i.product._id,
      name: i.product.name,
      price: i.product.price,
      image: i.product.image,
      quantity: i.quantity,
    }));

    const createdAt = new Date(api.createdAt);
    const estimatedDelivery = new Date(createdAt);
    estimatedDelivery.setDate(createdAt.getDate() + 6);

    const [firstName, lastName] = api.shippingAddress.fullName.split(' ');

    return {
      id: api._id,
      items,
      subtotal: api.itemsPrice,
      shipping: api.shippingPrice,
      tax: api.taxPrice,
      total: api.totalPrice,
      shippingAddress: {
        firstName,
        lastName: lastName || '',
        street: api.shippingAddress.address,
        city: api.shippingAddress.city,
        // Assuming state is part of the address string or needs to be derived/added
        state: api.shippingAddress.state || '', // Or handle appropriately if state is available
        postalCode: api.shippingAddress.postalCode,
        country: api.shippingAddress.country,
      },
      payment: {
        paymentMethod: api.paymentMethod,
        ...(api.paymentResult && {
          last4: api.paymentResult.last4,
          cardType: api.paymentResult.cardType,
        }),
      },
      status: mapStatus(api.status),
      createdAt,
      estimatedDelivery,
      trackingId: `TRK${Date.now()}`,
      trackingEvents: [
        {
          status: api.status,
          timestamp: createdAt,
          location: 'Online',
          description: `Order ${api.status}`,
        },
      ],
    };
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      try {
        setIsLoading(true);
        const res = await ordersAPI.listMine();
        const data: ApiOrder[] = res.data;
        setOrders(data.map(convertApiOrder));
      } catch (err: unknown) {
        const e = err as ApiError;
        setError(e.response?.data?.message || e.message || 'Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('guestOrders', JSON.stringify(orders));
    }
  }, [orders, isAuthenticated]);

  const addOrder = async (
    data: Omit<Order, 'id' | 'createdAt' | 'estimatedDelivery' | 'status' | 'trackingEvents' | 'trackingId'>
  ): Promise<string | Order> => {
    setIsLoading(true);
    setError(null);
    try {
      if (isAuthenticated) {
        const payload = {
          items: data.items.map((i) => ({ product: i.productId, quantity: i.quantity, price: i.price })), // Renamed orderItems to items and added price
          shippingAddress: {
            fullName: `${data.shippingAddress.firstName} ${data.shippingAddress.lastName}`.trim(),
            address: data.shippingAddress.street,
            city: data.shippingAddress.city,
            // state: data.shippingAddress.state, // Removed state field as it's not in API payload
            postalCode: data.shippingAddress.postalCode,
            country: data.shippingAddress.country,
          },
          paymentMethod: data.payment.paymentMethod,
        };
        const res = await ordersAPI.place(payload);
        const order = convertApiOrder(res.data as unknown as ApiOrder); // Cast to unknown first, then to ApiOrder
        setOrders((prev) => [...prev, order]);
        return order.id;
      } else {
        const id = `ORD-${Date.now()}`;
        const createdAt = new Date();
        const estimatedDelivery = new Date(createdAt);
        estimatedDelivery.setDate(createdAt.getDate() + 6);
        const newOrder: Order = {
          ...data,
          id,
          status: ORDER_STATUS.PLACED,
          createdAt,
          estimatedDelivery,
          trackingId: `TRK${Date.now()}`,
          trackingEvents: [{ status: ORDER_STATUS.PLACED, timestamp: createdAt }],
        };
        setOrders((prev) => [...prev, newOrder]);
        return id;
      }
    } catch (err: unknown) {
      const e = err as ApiError;
      setError(e.response?.data?.message || e.message || 'Failed to place order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getOrder = (id: string) => orders.find((o) => o.id === id);
  const getOrderByTrackingId = (tid: string) => orders.find((o) => o.trackingId === tid);

  return (
    <OrderContext.Provider
      value={{ orders, addOrder, getOrder, getOrderByTrackingId, isLoading, error }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
export const useOrder = (): OrderContextType => {
  const context = React.useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};