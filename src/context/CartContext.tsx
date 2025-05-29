import React, { createContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './useAuth';

// Define the product interface
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize?: string | null;
}

// API response types
interface ApiCartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  selectedSize?: string | null;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'id'>, quantity?: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  totalItems: number;
  subtotal: number;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Calculate totals
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // Fetch cart from API on initial load and when authentication status changes
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (isAuthenticated) {
          setIsLoading(true);
          const response = await cartAPI.getCart();
          
          // Check if response and response.data exist and have items
          if (response?.data && response.data.items && Array.isArray(response.data.items)) {
            // Convert API cart items to our format
            const convertedItems: CartItem[] = response.data.items.map((item: ApiCartItem) => ({
              id: item._id,
              productId: item.product._id,
              name: item.product.name,
              price: item.product.price,
              image: item.product.image,
              quantity: item.quantity,
              selectedSize: item.selectedSize
            }));
            setCartItems(convertedItems);
          } else {
            // If no items or invalid response, set empty cart
            setCartItems([]);
          }
        } else {
          // Handle guest cart from localStorage
          const savedCart = localStorage.getItem('guestCart');
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          } else {
            setCartItems([]);
          }
        }
      } catch (err: unknown) {
        const error = err as ApiError;
        setError(error.response?.data?.message || error.message || 'Failed to fetch cart');
        console.error('Error fetching cart:', err);
        // Set empty cart on error
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated]);

  // Save guest cart to localStorage when it changes
  useEffect(() => {
    if (!isAuthenticated && cartItems.length > 0) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);
  
  // Add item to cart
  const addToCart = async (item: Omit<CartItem, 'quantity' | 'id'>, quantity = 1): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
        if (isAuthenticated) {
        // Use the API for authenticated users
        await cartAPI.addToCart(item.productId, quantity, item.selectedSize);
        // Update the entire cart with the response
        const response = await cartAPI.getCart();
        
        // Check if response and response.data exist and have items
        if (response?.data && response.data.items && Array.isArray(response.data.items)) {
          // Convert API cart items to our format
          const convertedItems: CartItem[] = response.data.items.map((apiItem: ApiCartItem) => ({
            id: apiItem._id,
            productId: apiItem.product._id,
            name: apiItem.product.name,
            price: apiItem.product.price,
            image: apiItem.product.image,
            quantity: apiItem.quantity,
            selectedSize: apiItem.selectedSize
          }));
          setCartItems(convertedItems);
        } else {
          // If no items or invalid response, set empty cart
          setCartItems([]);
        }
      } else {
        // Handle guest cart locally
        setCartItems(prevItems => {
          const existingItem = prevItems.find(
            cartItem => 
              cartItem.productId === item.productId && 
              cartItem.selectedSize === item.selectedSize
          );
          
          if (existingItem) {
            // If item already exists, increase quantity
            return prevItems.map(cartItem =>
              cartItem.id === existingItem.id
                ? { ...cartItem, quantity: cartItem.quantity + quantity }
                : cartItem
            );
          } else {
            // Add new item with specified quantity
            const newItem = {
              ...item,
              id: `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              quantity
            };
            return [...prevItems, newItem];
          }
        });
      }    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.response?.data?.message || error.message || 'Failed to add item to cart');
      console.error('Error adding to cart:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Remove item from cart
  const removeFromCart = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
        if (isAuthenticated) {
        // Use the API for authenticated users
        await cartAPI.removeCartItem(id);
        // Fetch updated cart
        const response = await cartAPI.getCart();
        
        // Check if response and response.data exist and have items
        if (response?.data && response.data.items && Array.isArray(response.data.items)) {
          // Convert API cart items to our format
          const convertedItems: CartItem[] = response.data.items.map((apiItem: ApiCartItem) => ({
            id: apiItem._id,
            productId: apiItem.product._id,
            name: apiItem.product.name,
            price: apiItem.product.price,
            image: apiItem.product.image,
            quantity: apiItem.quantity,
            selectedSize: apiItem.selectedSize
          }));
          setCartItems(convertedItems);
        } else {
          // If no items or invalid response, set empty cart
          setCartItems([]);
        }
      } else {
        // Handle guest cart locally
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      }    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.response?.data?.message || error.message || 'Failed to remove item from cart');
      console.error('Error removing from cart:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update item quantity
  const updateQuantity = async (id: string, quantity: number): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (quantity <= 0) {
        await removeFromCart(id);
        return;
      }
        if (isAuthenticated) {
        // Use the API for authenticated users
        await cartAPI.updateCartItem(id, quantity);
        // Fetch updated cart
        const response = await cartAPI.getCart();
        
        // Check if response and response.data exist and have items
        if (response?.data && response.data.items && Array.isArray(response.data.items)) {
          // Convert API cart items to our format
          const convertedItems: CartItem[] = response.data.items.map((apiItem: ApiCartItem) => ({
            id: apiItem._id,
            productId: apiItem.product._id,
            name: apiItem.product.name,
            price: apiItem.product.price,
            image: apiItem.product.image,
            quantity: apiItem.quantity,
            selectedSize: apiItem.selectedSize
          }));
          setCartItems(convertedItems);
        } else {
          // If no items or invalid response, set empty cart
          setCartItems([]);
        }
      } else {
        // Handle guest cart locally
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      }    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.response?.data?.message || error.message || 'Failed to update cart');
      console.error('Error updating cart:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear cart
  const clearCart = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (isAuthenticated) {
        // Use the API for authenticated users
        await cartAPI.clearCart();
        setCartItems([]);
      } else {
        // Handle guest cart locally
        setCartItems([]);
        localStorage.removeItem('guestCart');
      }    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.response?.data?.message || error.message || 'Failed to clear cart');
      console.error('Error clearing cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoading,
        error,
        totalItems,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
