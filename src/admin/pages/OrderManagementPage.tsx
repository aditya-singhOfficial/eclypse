import React, { useEffect, useState, useCallback } from 'react';
import {
  getAllAdminOrders,
  updateAdminOrderStatus,
 type AdminOrder
} from '../services/AdminOrderApiService';
import { Link } from 'react-router-dom'; // For viewing order details

const OrderManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedOrders = await getAllAdminOrders();
      setOrders(fetchedOrders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again.');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: string, newStatus: AdminOrder['orderStatus']) => {
    if (window.confirm(`Are you sure you want to update this order to "${newStatus}"?`)) {
      try {
        let statusUpdatePayload: { orderStatus: AdminOrder['orderStatus'], isDelivered?: boolean, deliveredAt?: string } = { orderStatus: newStatus };
        if (newStatus === 'Delivered') {
            statusUpdatePayload.isDelivered = true;
            statusUpdatePayload.deliveredAt = new Date().toISOString();
        }
        // For other statuses, you might need to set isDelivered to false or handle paidAt, etc.

        const updatedOrder = await updateAdminOrderStatus(orderId, statusUpdatePayload);
        setOrders(orders.map(order => (order._id === orderId ? updatedOrder : order)));
        alert('Order status updated successfully.');
      } catch (err) {
        console.error('Failed to update order status:', err);
        alert('Failed to update order status.');
      }
    }
  };

  if (isLoading) return <div>Loading orders...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h1>Order Management</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th> {/* Consider displaying user email or name */}
            <th>Date</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Delivered</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={8}>No orders found.</td>
            </tr>
          ) : (
            orders.map(order => (
              <tr key={order._id}>
                <td>
                  <Link to={`/admin/orders/${order._id}`}>{order._id}</Link>
                </td>
                <td>{typeof order.user === 'string' ? order.user : (order.user as any)?.email || 'N/A'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? new Date(order.paidAt!).toLocaleDateString() : 'No'}</td>
                <td>{order.isDelivered ? new Date(order.deliveredAt!).toLocaleDateString() : 'No'}</td>
                <td>{order.orderStatus}</td>
                <td>
                  <select 
                    value={order.orderStatus}
                    onChange={(e) => handleUpdateStatus(order._id, e.target.value as AdminOrder['orderStatus'])}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                  {/* Link to Order Details Page might be more appropriate here or on ID */}
                  {/* <Link to={`/admin/orders/${order._id}`}>Details</Link> */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagementPage;