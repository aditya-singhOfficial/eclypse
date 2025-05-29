import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getAdminOrderById,
 type AdminOrder,
  // updateAdminOrderStatus // Potentially for status updates directly on this page
} from '../services/AdminOrderApiService';

const AdminOrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError('Order ID is missing from URL.');
      setIsLoading(false);
      return;
    }
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedOrder = await getAdminOrderById(orderId);
        setOrder(fetchedOrder);
      } catch (err) {
        console.error(`Failed to fetch order details for ${orderId}:`, err);
        setError('Failed to load order details. Please try again.');
      }
      setIsLoading(false);
    };
    fetchOrderDetails();
  }, [orderId]);

  // Optional: Handler for updating status from this page
  // const handleUpdateStatus = async (newStatus: AdminOrder['orderStatus']) => { ... }

  if (isLoading) return <div>Loading order details...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!order) return <div>Order not found.</div>;

  return (
    <div>
      <h1>Order Details: {order._id}</h1>
      <Link to="/admin/orders" style={{marginBottom: '20px', display: 'inline-block'}}>&larr; Back to Order List</Link>

      <h2>Customer & Shipping</h2>
      <p><strong>User ID:</strong> {typeof order.user === 'string' ? order.user : (order.user as any)?._id}</p>
      {/* You might want to fetch and display user's name/email if user is an ID */}
      <p><strong>Shipping Address:</strong></p>
      <address>
        {order.shippingAddress.address}<br />
        {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
        {order.shippingAddress.country}
      </address>

      <h2>Payment</h2>
      <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
      <p><strong>Paid:</strong> {order.isPaid ? `Yes, on ${new Date(order.paidAt!).toLocaleString()}` : 'No'}</p>
      {order.paymentResult?.id && <p><strong>Payment ID (Stripe/PayPal):</strong> {order.paymentResult.id}</p>}

      <h2>Order Status</h2>
      <p><strong>Current Status:</strong> {order.orderStatus}</p>
      <p><strong>Delivered:</strong> {order.isDelivered ? `Yes, on ${new Date(order.deliveredAt!).toLocaleString()}` : 'No'}</p>
      {/* Add status update controls if desired here */}

      <h2>Order Items</h2>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item, index) => (
            <tr key={item.productId + index}> {/* Use a more robust key if possible */}
              <td>
                {item.image ? (
                  <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                ) : 'No Image'}
              </td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Order Summary</h2>
      <p><strong>Items Price:</strong> ${order.itemsPrice.toFixed(2)}</p>
      <p><strong>Shipping Price:</strong> ${order.shippingPrice.toFixed(2)}</p>
      <p><strong>Tax Price:</strong> ${order.taxPrice.toFixed(2)}</p>
      <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>

      <p><em>Order Placed: {new Date(order.createdAt).toLocaleString()}</em></p>
    </div>
  );
};

export default AdminOrderDetailsPage;