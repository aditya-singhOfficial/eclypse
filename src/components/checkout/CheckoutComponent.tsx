import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import CheckoutPage from "./CheckoutPage";
import { useCart } from "../../context/CartContext";

const CheckoutComponent: React.FC = () => {
  const location = useLocation();
  const { cartItems } = useCart();

  // If there's state passed from a "Buy Now" button, use that
  if (location.state) {
    return (
      <div className="min-h-screen bg-black text-white py-24 sm:py-28 md:py-32 lg:py-36 px-4 sm:px-6 md:px-12 lg:px-16">
        <CheckoutPage order={location.state} />
      </div>
    );
  }

  // Otherwise, check if there are items in the cart
  if (cartItems.length === 0) {
    // Redirect to cart if no items
    return <Navigate to="/cart" />;
  }

  // Calculate order details from cart items
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 1400;
  const tax = 200;
  const total = subtotal + shipping + tax;

  // For multiple items
  const itemName =
    cartItems.length === 1
      ? cartItems[0].name
      : `${cartItems.length} items`;

  return (
    <div className="min-h-screen bg-black text-white py-24 sm:py-28 md:py-32 lg:py-36 px-4 sm:px-6 md:px-12 lg:px-16">
      <CheckoutPage
        order={{
          itemName,
          itemPrice: subtotal,
          shipping,
          beforeTax: subtotal,
          tax,
          total,
          selectedSize:
            cartItems.length === 1 ? cartItems[0].selectedSize : null,
        }}
      />
    </div>
  );
};

export default CheckoutComponent;
