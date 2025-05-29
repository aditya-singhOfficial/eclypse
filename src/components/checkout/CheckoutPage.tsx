import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderSummary from "./OrderSummary";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import { motion } from "framer-motion";
import { useCart } from "../../context/useCart";
import { useOrder } from "../../context/useOrder";

interface CheckoutPageProps {
  order: {
    itemName: string;
    itemPrice: number;
    shipping: number;
    beforeTax: number;
    tax: number;
    total: number;
    selectedSize?: string | null;
  };
}

type CheckoutStep = "address" | "payment" | "payment-review" | "confirmation";

// Define the address type directly using the same shape as in AddressForm
type AddressFormData = {
  firstName: string;
  lastName: string;
  street: string;
  apt?: string;
  state: string;
  zip: string;
};

type PaymentFormData = {
  paymentMethod: "card" | "cod";
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
};

const CheckoutPage: React.FC<CheckoutPageProps> = ({ order }) => {  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address");
  const [shippingAddress, setShippingAddress] = useState<AddressFormData | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentFormData | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { addOrder } = useOrder();

  const handleAddressSubmit = (data: AddressFormData) => {
    setShippingAddress(data);
    setCurrentStep("payment");
  };  const handlePaymentSubmit = (data: PaymentFormData) => {
    setPaymentInfo(data);
    
    if (data.paymentMethod === "card") {
      // For card payment, simulate payment gateway processing
      setIsProcessingPayment(true);
      
      // Simulate payment processing delay
      setTimeout(() => {
        setIsProcessingPayment(false);
        
        // Create the payment object with proper credit card masking
        const payment = {
          paymentMethod: data.paymentMethod,
          last4: data.cardNumber ? data.cardNumber.replace(/\s/g, '').slice(-4) : undefined,
          cardNumber: data.cardNumber ? `XXXX XXXX XXXX ${data.cardNumber.replace(/\s/g, '').slice(-4)}` : undefined,
          expiry: data.expiry
        };
        
        // Save the order to our order context
        const newOrderId = addOrder({
          items: cartItems,
          itemName: order.itemName,
          itemPrice: order.itemPrice,
          shipping: order.shipping,
          tax: order.tax,
          total: order.total,
          shippingAddress: shippingAddress!,
          payment: payment
        });
        
        // After successful payment, move to confirmation
        setCurrentStep("confirmation");
        
        // Simulate backend processing delay
        setTimeout(() => {
          clearCart();
          navigate(`/order-confirmation/${newOrderId}`);
        }, 2000);
      }, 1500); // Simulate payment gateway delay
    } else {
      // For COD, move to review step
      setCurrentStep("payment-review");
    }
  };  const handlePlaceOrder = () => {
    // Check if we have address and payment information
    if (!shippingAddress) {
      setCurrentStep("address");
      return;
    }
    
    if (!paymentInfo) {
      setCurrentStep("payment");
      return;
    }
    
    // Create the payment object
    const payment = {
      paymentMethod: paymentInfo.paymentMethod,
      last4: paymentInfo.cardNumber ? paymentInfo.cardNumber.replace(/\s/g, '').slice(-4) : undefined,
      cardNumber: paymentInfo.cardNumber ? `XXXX XXXX XXXX ${paymentInfo.cardNumber.replace(/\s/g, '').slice(-4)}` : undefined,
      expiry: paymentInfo.expiry
    };
    
    // Save the order to our order context
    const newOrderId = addOrder({
      items: cartItems,
      itemName: order.itemName,
      itemPrice: order.itemPrice,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      shippingAddress: shippingAddress,
      payment: payment
    });
    
    setCurrentStep("confirmation");
    
    // Simulate backend processing delay
    setTimeout(() => {
      // Clear cart and redirect to order confirmation page
      clearCart();
      navigate(`/order-confirmation/${newOrderId}`);
    }, 2000);
  };
  const stepsConfig = [
    { name: "address", number: 1, label: "Address" },
    { name: "payment", number: 2, label: "Payment" },
    { name: "payment-review", number: 3, label: "Review" },
    { name: "confirmation", number: 4, label: "Confirmation" }
  ];

  return (
    <motion.div 
      className="flex flex-col w-full max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Checkout Progress */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex justify-between max-w-md mx-auto">
          {stepsConfig.map((step) => (
            <div 
              key={step.name}
              className={`flex flex-col items-center ${
                currentStep === step.name ? "text-white" : "text-gray-500"
              }`}
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border ${
                  currentStep === step.name 
                    ? "bg-white text-black border-white" 
                    : "bg-transparent text-gray-500 border-gray-500"
                }`}
              >
                {step.number}
              </div>
              <span className="text-sm">{step.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column - Changes based on step */}
        <motion.div 
          className="lg:flex-1"
          key={currentStep}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentStep === "address" && (
            <>
              <h1 className="text-xl md:text-4xl font-medium mb-8">Shipping Address</h1>
              <div className="mb-4">
                <AddressForm onSubmit={handleAddressSubmit} onCancel={() => navigate('/cart')} />
              </div>
            </>
          )}          {currentStep === "payment" && (
            <>
              <h1 className="text-xl md:text-4xl font-medium mb-8">Payment Method</h1>
              <div className="relative">
                {isProcessingPayment && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10 rounded">
                    <div className="text-center">
                      <div className="w-16 h-16 border-t-4 border-[#f63030] border-solid rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-white text-lg">Processing Payment...</p>
                      <p className="text-gray-300 text-sm mt-2">Please do not close this window</p>
                    </div>
                  </div>
                )}
                <PaymentForm 
                  onSubmit={handlePaymentSubmit} 
                  onBack={() => setCurrentStep("address")} 
                  shippingAddress={shippingAddress as AddressFormData} 
                />
              </div>
            </>
          )}
            {currentStep === "payment-review" && (
            <>
              <h1 className="text-xl md:text-4xl font-medium mb-8">Review Your Order</h1>
              <div className="bg-gray-900 border border-gray-800 p-6">
                <div className="mb-6">
                  <h3 className="font-medium mb-3 text-lg">Payment Method</h3>
                  {paymentInfo && (
                    <div className="p-4 bg-black border border-gray-800 rounded mb-4">
                      <p className="text-gray-300">
                        {paymentInfo.paymentMethod === 'card' 
                          ? `Credit/Debit Card (ending in ${paymentInfo.cardNumber?.slice(-4) || '****'})` 
                          : 'Cash on Delivery'}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3 text-lg">Shipping Address</h3>
                  {shippingAddress && (
                    <div className="p-4 bg-black border border-gray-800 rounded">
                      <p className="text-gray-300">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                      <p className="text-gray-300">{shippingAddress.street}{shippingAddress.apt ? `, Apt ${shippingAddress.apt}` : ''}</p>
                      <p className="text-gray-300">{shippingAddress.state}, {shippingAddress.zip}</p>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3 text-lg">Order Summary</h3>
                  <div className="p-4 bg-black border border-gray-800 rounded">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Items:</span>
                      <span className="text-gray-300">₹{order.itemPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Shipping:</span>
                      <span className="text-gray-300">₹{order.shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Tax:</span>
                      <span className="text-gray-300">₹{order.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t border-gray-800 pt-2 mt-2">
                      <span>Total:</span>
                      <span>₹{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <button 
                    onClick={() => setCurrentStep("payment")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Back to Payment
                  </button>
                </div>
              </div>
            </>
          )}
            {currentStep === "confirmation" && (
            <>
              <h1 className="text-xl md:text-4xl font-medium mb-8">Order Confirmation</h1>
              <div className="bg-gray-900 border border-gray-800 p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-[#f63030] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-[#f63030]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-medium mb-4">Thank You For Your Order!</h2>
                  <p className="text-gray-300 mb-4">Your order has been placed successfully.</p>
                  <p className="text-gray-300 mb-8">Redirecting to order confirmation page...</p>
                </div>
              </div>
            </>
          )}
        </motion.div>        {/* Right Column - Order Summary (always visible) */}        <motion.div 
          className="lg:flex-1 flex flex-col items-center"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <OrderSummary
            itemName={order.itemName}
            itemPrice={order.itemPrice}
            shipping={order.shipping}
            beforeTax={order.beforeTax}
            tax={order.tax}
            total={order.total}
            onPlaceOrder={
              // For card payment, the button in OrderSummary is not used for placing the order
              currentStep === "payment-review" 
                ? handlePlaceOrder 
                : currentStep === "payment" && paymentInfo?.paymentMethod === "cod"
                  ? () => setCurrentStep("payment-review") 
                  : undefined
            }
            currentStep={currentStep}
            paymentMethod={paymentInfo?.paymentMethod}
            isProcessingPayment={isProcessingPayment}
          />          {currentStep === "address" && (
            <div className="mt-4 text-gray-400 text-sm text-center max-w-md">
              Complete your shipping address to proceed to payment
            </div>
          )}
          {currentStep === "payment" && paymentInfo?.paymentMethod === "card" && (
            <div className="mt-4 text-gray-400 text-sm text-center max-w-md">
              {isProcessingPayment 
                ? "Please wait while we process your payment" 
                : "Enter your card details and click 'Process Payment'"}
            </div>
          )}
          {currentStep === "payment" && paymentInfo?.paymentMethod === "cod" && (
            <div className="mt-4 text-gray-400 text-sm text-center max-w-md">
              Cash on Delivery selected. Review your order to continue.
            </div>
          )}
          {currentStep === "payment" && !paymentInfo && (
            <div className="mt-4 text-gray-400 text-sm text-center max-w-md">
              Select a payment method to continue
            </div>
          )}
          {currentStep === "payment-review" && (
            <div className="mt-4 text-gray-400 text-sm text-center max-w-md">
              Review your order and click "Place Order" to complete your purchase
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;
