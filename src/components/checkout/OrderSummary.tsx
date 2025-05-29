import React from "react";
import { useCart } from "../../context/useCart";
import { motion } from "framer-motion";

interface OrderSummaryProps {
  itemName: string;
  itemPrice: number;
  shipping: number;
  beforeTax: number;
  tax: number;
  total: number;
  onPlaceOrder?: () => void;
  currentStep?: "address" | "payment" | "payment-review" | "confirmation";
  paymentMethod?: "card" | "cod";
  isProcessingPayment?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  itemName,
  itemPrice,
  shipping,
  beforeTax,
  tax,
  total,
  onPlaceOrder,
  currentStep = "address",
  paymentMethod,
  isProcessingPayment = false,
}) => {
  const { cartItems } = useCart();
  const isMultipleItems = itemName.includes("items") && cartItems.length > 1;
  return (
    <section className="w-full max-w-lg bg-gray-900 border border-gray-800 p-6 flex flex-col gap-4 mx-auto">
      <h2 className="text-xl font-medium text-white mb-2">Order Summary</h2>

      {isMultipleItems ? (
        <div>
          {cartItems.map((item) => (
            <motion.div
              key={item.id}
              className="flex justify-between text-gray-300 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="flex items-center">
                <span className="mr-2">{item.quantity}x</span>
                <span className="truncate max-w-[150px]">{item.name}</span>
              </span>
              <span>₹{(item.price * item.quantity).toLocaleString()}</span>
            </motion.div>
          ))}
          <div className="border-t border-gray-800 my-3"></div>
        </div>
      ) : (
        <div className="flex justify-between text-gray-300">
          <span>Items - {itemName}</span>
          <span>₹{itemPrice.toLocaleString()}</span>
        </div>
      )}

      <div className="flex justify-between text-gray-300">
        <span>Shipping:</span>
        <span>₹{shipping.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-gray-300">
        <span>Before tax:</span>
        <span>₹{beforeTax.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-gray-300">
        <span>Tax:</span>
        <span>₹{tax.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-xl font-medium text-white border-t border-gray-800 pt-4 mt-2">
        <span>Order Total:</span>
        <span>₹{total.toLocaleString()}</span>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        By placing your order, you agree to our company{" "}
        <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
          Privacy policy
        </span>{" "}
        and{" "}
        <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
          Conditions of use.
        </span>
      </p>      <div className="mt-4">
        {isProcessingPayment ? (
          <div className="w-full bg-gray-700 text-gray-400 font-medium py-3 text-center">
            Processing Payment...
          </div>
        ) : (
          <motion.button
            onClick={onPlaceOrder}
            disabled={!onPlaceOrder}
            className={`w-full font-medium py-3 transition-colors ${
              onPlaceOrder 
                ? "bg-white text-black hover:bg-[#f63030] hover:text-white cursor-pointer" 
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
            whileHover={onPlaceOrder ? { scale: 1.02 } : {}}
            whileTap={onPlaceOrder ? { scale: 0.98 } : {}}
          >
            {currentStep === "payment-review" 
              ? "Place Order" 
              : currentStep === "payment" && paymentMethod === "cod"
                ? "Review Order" 
                : currentStep === "payment" && paymentMethod === "card"
                  ? "Payment in Process" 
                  : "Complete Address & Payment"}
          </motion.button>
        )}
      </div>
    </section>
  );
};

export default OrderSummary;
