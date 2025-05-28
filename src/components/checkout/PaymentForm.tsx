import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Card type detection function that returns the card type based on the card number
export type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'jcb' | 'diners' | 'unknown';

// Utility function to detect card type
const detectCardType = (cardNumber: string): CardType => {
  const cleaned = cardNumber.replace(/\s+/g, "");
  
  if (cleaned === "") return "unknown";
  
  // Check by card type patterns
  // Visa - starts with 4, length 13, 16, or 19
  if (/^4[0-9]{12}(?:[0-9]{3,6})?$/.test(cleaned)) return "visa";
  
  // Mastercard - starts with 51-55 or range of 2221-2720, length 16
  if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(cleaned)) 
    return "mastercard";
  
  // American Express - starts with 34 or 37, length 15
  if (/^3[47][0-9]{13}$/.test(cleaned)) return "amex";
  
  // Discover - starts with 6011, 644-649, 65, length 16-19
  if (/^(6011|65[0-9]{2}|64[4-9][0-9])[0-9]{12,15}$/.test(cleaned)) return "discover";
  
  // JCB - starts with 2131, 1800, or 35, length 16-19
  if (/^(?:2131|1800|35\d{3})\d{11,14}$/.test(cleaned)) return "jcb";
  
  // Diners Club - starts with 300-305, 36, or 38-39, length 14-19
  if (/^3(?:0[0-5]|[68][0-9])[0-9]{11,16}$/.test(cleaned)) return "diners";
  
  return "unknown";
};

// Validation schema for payment form
const paymentSchema = z.object({
  paymentMethod: z.enum(["card", "cod"], {
    required_error: "Please select a payment method",
  }),
  // Card details (only required if paymentMethod is 'card')
  cardNumber: z.string().refine(
    (val) => {
      if (val === "") return true; // Skip validation if empty (will be caught by conditional)
      
      // Remove spaces and validate
      const cleaned = val.replace(/\s+/g, "");
      
      // Check if card number contains only digits
      if (!/^\d+$/.test(cleaned)) return false;
      
      // Check card length (13-19 digits based on card type)
      if (cleaned.length < 13 || cleaned.length > 19) return false;
      
      // Get card type
      const cardType = detectCardType(cleaned);
      
      // If card type is not recognized, reject it
      if (cardType === "unknown") return false;
      
      // Specific length validation based on card type
      if (cardType === "amex" && cleaned.length !== 15) return false;
      if (cardType === "visa" && ![13, 16, 19].includes(cleaned.length)) return false;
      if (cardType === "mastercard" && cleaned.length !== 16) return false;
      if (cardType === "discover" && ![16, 17, 18, 19].includes(cleaned.length)) return false;
      if (cardType === "jcb" && ![16, 17, 18, 19].includes(cleaned.length)) return false;
      if (cardType === "diners" && ![14, 15, 16, 17, 18, 19].includes(cleaned.length)) return false;
      
      // Luhn algorithm validation (checksum)
      let sum = 0;
      let double = false;
      
      // Loop from the right to the left
      for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned.charAt(i));
        
        if (double) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        
        sum += digit;
        double = !double;
      }
      
      return (sum % 10) === 0;
    },
    { message: "Please enter a valid card number" }
  ).optional(),
  expiry: z.string().refine(
    (val) => {
      if (val === "") return true; // Skip validation if empty
      if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(val)) return false;
      
      // Check if the expiry date is not in the past
      const [month, yearStr] = val.split('/');
      const year = parseInt('20' + yearStr); // Convert YY to YYYY
      
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear(); // Get full year (YYYY)
      const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
      
      // The card expires at the end of the month
      if (year < currentYear || (year === currentYear && parseInt(month) < currentMonth)) {
        return false;
      }
      
      // Check that the year is not too far in the future (typically cards are valid for max 10 years)
      if (year > currentYear + 10) {
        return false;
      }
      
      return true;
    },
    { message: "Please enter a valid expiry date (MM/YY)" }
  ).optional(),
  cvv: z.string().optional(),
}).refine(
  (data) => {
    // If payment method is card, require card details
    if (data.paymentMethod === "card") {
      if (!data.cardNumber || !data.expiry || !data.cvv) {
        return false;
      }
      
      // Get card type for CVV validation
      const cardType = detectCardType(data.cardNumber.replace(/\s+/g, ""));
      
      // Validate CVV based on card type
      if (cardType === "amex") {
        // Amex requires 4-digit CVV
        if (!/^\d{4}$/.test(data.cvv)) return false;
      } else {
        // All other cards require 3-digit CVV
        if (!/^\d{3}$/.test(data.cvv)) return false;
      }
      
      return true;
    }
    return true;
  },
  {
    message: "Card details are required for credit/debit card payment",
    path: ["cardNumber"],
  }
);

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  onBack: () => void;
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    apt?: string;
    state: string;
    zip: string;
  };
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  onSubmit,
  onBack,
  shippingAddress,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "card",
    },
  });  
  const paymentMethod = watch("paymentMethod");
  const cardNumber = watch("cardNumber") || "";
  const isCardPayment = paymentMethod === "card";
  const cardType = detectCardType(cardNumber);

  // Card brand icons (simple SVG representations)
  const cardIcons = {
    visa: (
      <svg viewBox="0 0 38 24" width="24" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M34.3 0H3.7C1.7 0 0 1.7 0 3.7v16.5c0 2.1 1.7 3.7 3.7 3.7h30.6c2.1 0 3.7-1.7 3.7-3.7V3.7C38 1.7 36.3 0 34.3 0z" fill="#0956b5"/>
        <path d="M14.1 15.7l1.4-8.9h2.3l-1.4 8.9h-2.3zM26.3 7c-.5-.2-1.2-.4-2.1-.4-2.3 0-3.9 1.3-3.9 3.1-.1 1.3 1.1 2 2 2.5.9.4 1.2.7 1.2 1.1 0 .6-.7.9-1.4.9-.9 0-1.4-.1-2.1-.5l-.3-.1-.3 1.8c.6.3 1.5.5 2.6.5 2.4 0 4-1.2 4-3.2 0-1.1-.6-1.9-2-2.5-.8-.4-1.3-.7-1.3-1.1 0-.4.4-.8 1.3-.8.8 0 1.3.2 1.7.4l.2.1.3-1.8zM30.1 6.8h-1.8c-.5 0-.9.2-1.2.7l-3.3 8.2h2.3l.5-1.3h2.9c.1.3.3 1.3.3 1.3h2.1l-1.8-8.9zm-3 6l.9-2.5c0 .1.2-.5.3-.9l.1.8.5 2.6h-1.8zM11.1 6.8L9 13.1l-.2-1.1c-.4-1.4-1.7-2.9-3.2-3.7l2.1 8.3h2.4l3.7-8.9h-2.7z" fill="#ffffff"/>
        <path d="M6.4 6.8H2.7l-.1.2c2.9.7 4.8 2.5 5.6 4.5L7.4 7.6c-.2-.9-.8-1.2-1.4-1.2z" fill="#ffd200"/>
      </svg>
    ),
    mastercard: (
      <svg viewBox="0 0 38 24" width="24" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M34.3 0H3.7C1.7 0 0 1.7 0 3.7v16.5c0 2.1 1.7 3.7 3.7 3.7h30.6c2.1 0 3.7-1.7 3.7-3.7V3.7C38 1.7 36.3 0 34.3 0z" fill="#000"/>
        <path d="M15.2 19.5c-3.7 0-6.8-3-6.8-6.8s3-6.8 6.8-6.8c1.9 0 3.5.7 4.8 1.9-1.3 1.1-2.1 2.7-2.1 4.4 0 1.7.8 3.3 2.1 4.4-1.3 1.7-2.9 2.9-4.8 2.9z" fill="#EB001B"/>
        <path d="M22.8 19.5c-3.7 0-6.8-3-6.8-6.8s3-6.8 6.8-6.8c1.9 0 3.5.7 4.8 1.9-1.3 1.1-2.1 2.7-2.1 4.4 0 1.7.8 3.3 2.1 4.4-1.3 1.7-2.9 2.9-4.8 2.9z" fill="#F79E1B"/>
        <path d="M19 7.4c-1.3 1.1-2.1 2.7-2.1 4.4 0 1.7.8 3.3 2.1 4.4 1.3-1.1 2.1-2.7 2.1-4.4 0-1.6-.8-3.2-2.1-4.4z" fill="#FF5F00"/>
      </svg>
    ),
    amex: (
      <svg viewBox="0 0 38 24" width="24" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M34.3 0H3.7C1.7 0 0 1.7 0 3.7v16.5c0 2.1 1.7 3.7 3.7 3.7h30.6c2.1 0 3.7-1.7 3.7-3.7V3.7C38 1.7 36.3 0 34.3 0z" fill="#006FCF"/>
        <path d="M20.2 12l-1.3-3.2-1.3 3.2h2.6zm12.1-1.3h-2.9V8.4h-3l-1.5 3.3-1.5-3.3h-5.9v-.9h-3.1l-1.3 3-1.3-3h-3v8h3l1.3-3.1 1.3 3.1h5.9v-.9h2.9v.9h2.9v-.9h2.9v.9h2.9v-5h-2.9v-.9h2.9v-.9h.4zm-22.5 2.2H6.6v-1.7h2.8V9.5H6.6V8h3.4l1.5 2.4 1.5-2.4h3.1v5h-3.1l-1.5-2.4-1.7 2.4zm8.8 0v-5h4l1.5 1.6 1.5-1.6h1.2v5h-3v-.9h-2.9v.9h-2.3zm11.6-1.3v-2.6l-1.8 2.6h1.8zm-5.9 0h2l.9-1.3.9 1.3h.6v-2.6l-1.8 2.6h-.9l-1.7-2.6v2.6z" fill="#ffffff"/>
      </svg>
    ),
    discover: (
      <svg viewBox="0 0 38 24" width="24" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M34.3 0H3.7C1.7 0 0 1.7 0 3.7v16.5c0 2.1 1.7 3.7 3.7 3.7h30.6c2.1 0 3.7-1.7 3.7-3.7V3.7C38 1.7 36.3 0 34.3 0z" fill="#4D4D4D"/>
        <path d="M38 12.5v-1h0c-3.4 0-6.3 1.4-8.4 3.6-.4.4-.7.9-1 1.4H34c2.2 0 4-1.8 4-4zm-10.6 4H7.5c-.2-.6-.3-1.3-.3-2 0-4.1 3.4-7.5 7.5-7.5 4.1 0 7.5 3.4 7.5 7.5 0 .7-.1 1.4-.3 2z" fill="#FF6B1F"/>
        <path d="M28.2 8.2c-1.3-1.3-3.1-2.2-5.2-2.2-4.1 0-7.5 3.4-7.5 7.5 0 4.1 3.4 7.5 7.5 7.5 2 0 3.9-.8 5.2-2.2 1.1-1.1 1.9-2.6 2.2-4.3H23c-1.7 0-3-1.3-3-3s1.3-3 3-3h7.4c-.2-1.6-1.1-3.1-2.2-4.3z" fill="#F5F5F5"/>
      </svg>
    ),
    jcb: (
      <svg viewBox="0 0 38 24" width="24" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M34.3 0H3.7C1.7 0 0 1.7 0 3.7v16.5c0 2.1 1.7 3.7 3.7 3.7h30.6c2.1 0 3.7-1.7 3.7-3.7V3.7C38 1.7 36.3 0 34.3 0z" fill="#0E4C96"/>
        <path d="M14.9 5.8h3.9c.1 0 .5 0 .6.1.8.2 1.5.9 1.5 2 0 1.1-.7 1.9-1.5 2.1v.1c1.1.2 1.9 1 1.9 2.2 0 1.4-1.1 2.4-2.8 2.4h-3.5V5.8h-.1zM17 9c.6 0 1-.4 1-.9s-.4-.8-1-.8h-1v1.8h1v-.1zm.2 3.2c.7 0 1.1-.4 1.1-1s-.4-1-1.1-1h-1.1v2h1.1zM27.9 5.8H25v8.9h3c2.1 0 3.6-1.5 3.6-4.5-.1-2.9-1.6-4.4-3.7-4.4zm-.1 7.4h-1.4v-6h1.4c1.3 0 2.1 1.1 2.1 3 0 1.9-.8 3-2.1 3zM9.2 5.8H6.5v8.9h2.7c2.1 0 3.6-1.5 3.6-4.5 0-2.9-1.5-4.4-3.6-4.4zm-.1 7.4H7.8v-6h1.3c1.3 0 2.1 1.1 2.1 3 0 1.9-.8 3-2.1 3z" fill="#ffffff"/>
      </svg>
    ),
    diners: (
      <svg viewBox="0 0 38 24" width="24" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M34.3 0H3.7C1.7 0 0 1.7 0 3.7v16.5c0 2.1 1.7 3.7 3.7 3.7h30.6c2.1 0 3.7-1.7 3.7-3.7V3.7C38 1.7 36.3 0 34.3 0z" fill="#0079BE"/>
        <path d="M19 21c5.5 0 10-4.5 10-10S24.5 1 19 1 9 5.5 9 11s4.5 10 10 10z" fill="#0079BE"/>
        <path d="M11.1 11c0-3.8 2.8-7 6.5-7.5v15c-3.7-.5-6.5-3.7-6.5-7.5zm9.8 7.5v-15c3.7.5 6.5 3.7 6.5 7.5s-2.8 7-6.5 7.5z" fill="#ffffff"/>
      </svg>
    ),
    unknown: (
      <svg viewBox="0 0 38 24" width="24" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M34.3 0H3.7C1.7 0 0 1.7 0 3.7v16.5c0 2.1 1.7 3.7 3.7 3.7h30.6c2.1 0 3.7-1.7 3.7-3.7V3.7C38 1.7 36.3 0 34.3 0z" fill="#2a2a2a"/>
        <path d="M19 12.5c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm1-5h-2v-2h2v2zm0 1v3h-2v-3h2z" fill="#999999"/>
      </svg>
    )
  };

  // Form submission handler - handle differently based on payment method
  const onFormSubmit = (data: PaymentFormData) => {
    if (data.paymentMethod === "card") {
      // For card payment, we'll simulate a payment gateway flow
      onSubmit(data);
    } else {
      // For COD, we can directly place the order
      onSubmit(data);
    }
  };

  const inputClasses = (error: boolean) => 
    `w-full bg-black border ${error ? 'border-[#f63030]' : 'border-gray-800'} px-3 py-2 text-white focus:outline-none focus:border-gray-600`;
  const labelClasses = "block text-gray-300 mb-2";
  const errorClasses = "text-[#f63030] text-xs mt-1";
  
  // Format card number with spaces
  const formatCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    // Format according to card type for better UX
    let formattedValue = value;
    
    // American Express format: XXXX XXXXXX XXXXX
    if (detectCardType(value) === "amex") {
      formattedValue = value.replace(/(\d{4})(\d{6})(\d{0,5})/, "$1 $2 $3").trim();
    } 
    // All other cards format: XXXX XXXX XXXX XXXX
    else {
      formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    }
    
    e.target.value = formattedValue;
  };  // Format expiry date with slash
  const formatExpiryDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    
    if (value.length === 0) {
      e.target.value = "";
    } else if (value.length <= 2) {
      // When typing first 1 or 2 digits (the month)
      const month = parseInt(value);
      
      // Don't allow months > 12
      if (value.length === 1) {
        // For single digit, if it's > 1, prepend a 0
        if (month > 1) {
          e.target.value = `0${month}`;
        } else {
          e.target.value = value;
        }
      } else if (value.length === 2) {
        // For double digits, ensure valid month (01-12)
        if (month === 0) {
          e.target.value = "01";
        } else if (month > 12) {
          e.target.value = "12";
        } else {
          e.target.value = value;
        }
        
        // Auto-add slash after month
        if (month > 0 && month <= 12) {
          e.target.value = `${e.target.value}/`;
        }
      }
    } else {
      // When typing more than 2 digits (includes the year)
      const month = value.substring(0, 2);
      const year = value.substring(2, 4);
      
      // Format as MM/YY
      e.target.value = `${month}/${year}`;
    }
  };
    // Limit CVV to numbers only and manage max length based on card type
  const formatCVV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      e.target.value = value.replace(/[^\d]/g, '');
      return;
    }
    
    // Adjust max length based on card type
    if (cardType === "amex") {
      e.target.maxLength = 4;
      if (value.length > 4) {
        e.target.value = value.substring(0, 4);
      }
    } else {
      e.target.maxLength = 3;
      if (value.length > 3) {
        e.target.value = value.substring(0, 3);
      }
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-6">
      {shippingAddress && (
        <div className="mb-6 p-4 bg-black border border-gray-800 rounded">
          <h3 className="font-medium mb-3">Shipping to:</h3>
          <p className="text-gray-300">
            {shippingAddress.firstName} {shippingAddress.lastName}
          </p>
          <p className="text-gray-300">
            {shippingAddress.street}
            {shippingAddress.apt ? `, Apt ${shippingAddress.apt}` : ""}
          </p>
          <p className="text-gray-300">
            {shippingAddress.state}, {shippingAddress.zip}
          </p>
        </div>
      )}      
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="mb-6">
          <label className="flex items-center mb-4 cursor-pointer">
            <input
              type="radio"
              value="card"
              {...register("paymentMethod")}
              className="h-5 w-5 text-white"
            />
            <span className="ml-2">Credit/Debit Card</span>
          </label>

          {isCardPayment && (
            <div className="border border-gray-800 p-5 mb-4">
              <div className="mb-4">
                <label className={labelClasses}>Card Number</label>                <div className="relative">
                  <input
                    {...register("cardNumber")}
                    className={`${inputClasses(!!errors.cardNumber)} pl-10 ${cardType !== "unknown" && cardNumber ? "border-green-500" : ""}`}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    onChange={formatCardNumber}
                  />
                  
                  {/* Card type icon indicator */}
                  <div className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400">
                    {cardType === "visa" && cardIcons.visa}
                    {cardType === "mastercard" && cardIcons.mastercard}
                    {cardType === "amex" && cardIcons.amex}
                    {cardType === "discover" && cardIcons.discover}
                    {cardType === "jcb" && cardIcons.jcb}
                    {cardType === "diners" && cardIcons.diners}
                    {cardType === "unknown" && cardNumber && cardIcons.unknown}
                  </div>
                </div>
                {errors.cardNumber && (
                  <span className={errorClasses}>{errors.cardNumber.message}</span>
                )}                {cardType !== "unknown" && cardNumber && !errors.cardNumber && (
                  <span className="text-green-500 text-xs mt-1">
                    Valid {cardType.charAt(0).toUpperCase() + cardType.slice(1)} card format detected
                  </span>
                )}
                {cardType === "unknown" && cardNumber && !errors.cardNumber && (
                  <span className="text-yellow-500 text-xs mt-1">
                    Card type not recognized
                  </span>
                )}
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className={labelClasses}>Expiry Date</label>
                  <input
                    {...register("expiry")}
                    className={inputClasses(!!errors.expiry)}
                    placeholder="MM/YY"
                    maxLength={5}
                    onChange={formatExpiryDate}
                  />                  {errors.expiry && (
                    <span className={errorClasses}>
                      {errors.expiry.message}
                    </span>
                  )}
                  {!errors.expiry && watch("expiry") && (
                    <span className="text-green-500 text-xs mt-1">Valid expiry date</span>
                  )}
                  {!watch("expiry") && (
                    <span className="text-gray-400 text-xs mt-1">Enter as MM/YY</span>
                  )}
                </div>
                <div className="flex-1">
                  <label className={labelClasses}>CVV</label>
                  <input
                    {...register("cvv")}
                    className={inputClasses(!!errors.cvv)}
                    placeholder={cardType === "amex" ? "1234" : "123"}
                    maxLength={cardType === "amex" ? 4 : 3}
                    type="password"
                    onChange={formatCVV}
                  />                  {errors.cvv && (
                    <span className={errorClasses}>
                      {cardType === "amex" 
                        ? "CVV must be 4 digits for American Express" 
                        : "CVV must be 3 digits"}
                    </span>
                  )}
                  {!errors.cvv && watch("cvv") && (
                    <span className="text-green-500 text-xs mt-1">
                      {cardType === "amex" 
                        ? "4-digit security code" 
                        : "3-digit security code"}
                    </span>
                  )}
                  {!watch("cvv") && (
                    <span className="text-gray-400 text-xs mt-1">
                      {cardType === "amex" 
                        ? "4 digits on front of card" 
                        : "3 digits on back of card"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="flex items-center mb-2 cursor-pointer">
            <input
              type="radio"
              value="cod"
              {...register("paymentMethod")}
              className="h-5 w-5 text-white"
            />
            <span className="ml-2">Cash on Delivery</span>
          </label>
        </div>

        {errors.paymentMethod && (
          <div className={errorClasses}>{errors.paymentMethod.message}</div>
        )}        
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Back to Address
          </button>
          <button
            type="submit"
            className="bg-white text-black hover:bg-[#f63030] hover:text-white px-6 py-2 transition-colors"
          >
            {isCardPayment ? "Process Payment" : "Continue to Order Review"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
