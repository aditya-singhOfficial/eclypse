import axiosInstance from '../../services/api';

// Define Order types based on your API response
// These might partially exist in 'src/types/orderTypes.ts', adapt as needed for admin view

export interface AdminOrderItem {
  productId: string; // Or a nested product object
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface AdminOrderShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface AdminOrder {
  _id: string;
  user: string; // User ID or a nested user object { _id, name, email }
  orderItems: AdminOrderItem[];
  shippingAddress: AdminOrderShippingAddress;
  paymentMethod: string;
  paymentResult?: {
    id?: string;
    status?: string;
    update_time?: string;
    email_address?: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded'; // Example statuses
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = '/orders'; // Standard order endpoint

// Fetch all orders (admin view)
export const getAllAdminOrders = async (): Promise<AdminOrder[]> => {
  try {
    // Your backend might have a specific admin route for orders, e.g., /admin/orders or /orders/all
    const response = await axiosInstance.get(`${API_BASE_URL}/admin/all`); // Adjust if needed
    return response.data.orders || response.data; // Adjust based on API response structure
  } catch (error) {
    console.error('Error fetching all admin orders:', error);
    throw error;
  }
};

// Fetch a single order by ID (admin)
export const getAdminOrderById = async (orderId: string): Promise<AdminOrder> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${orderId}`); // Standard get order by ID
    return response.data.order || response.data;
  } catch (error) {
    console.error(`Error fetching admin order ${orderId}:`, error);
    throw error;
  }
};

// Update order status (admin)
export const updateAdminOrderStatus = async (orderId: string, statusUpdate: { orderStatus: AdminOrder['orderStatus'], isDelivered?: boolean, deliveredAt?: string }): Promise<AdminOrder> => {
  try {
    // Your API might have a specific endpoint for status updates, e.g., /orders/:id/status or /orders/:id/deliver
    // For this example, we assume a PUT request to the order itself with the new status.
    // If it's specifically for delivery, it might be /orders/:id/deliver
    let endpoint = `${API_BASE_URL}/${orderId}/status`; // Default status update endpoint
    if (statusUpdate.orderStatus === 'Delivered' && statusUpdate.isDelivered) {
        endpoint = `${API_BASE_URL}/${orderId}/deliver`; // Specific delivery endpoint
    }

    const response = await axiosInstance.put(endpoint, statusUpdate);
    return response.data.order || response.data;
  } catch (error) {
    console.error(`Error updating admin order status for ${orderId}:`, error);
    throw error;
  }
};

// Potentially other admin order actions:
// - Mark as paid (if manual payment confirmation is needed)
// - Issue refund (might be a more complex process involving payment gateway)
// - Cancel order