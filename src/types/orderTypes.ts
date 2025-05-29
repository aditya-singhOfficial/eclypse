// Define order status as string literals
export type OrderStatus = 
  | 'Order Placed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered';

// Constants for the status values
export const ORDER_STATUS = {
  PLACED: 'Order Placed' as OrderStatus,
  PROCESSING: 'Processing' as OrderStatus,
  SHIPPED: 'Shipped' as OrderStatus,
  OUT_FOR_DELIVERY: 'Out for Delivery' as OrderStatus,
  DELIVERED: 'Delivered' as OrderStatus
};
