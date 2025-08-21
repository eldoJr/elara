import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../config/api';

interface CartContextType {
  cartCount: number;
  updateCartCount: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = async () => {
    try {
      const response = await api.get('/api/cart/');
      const items = response.data.cart_items || [];
      const totalCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(totalCount);
    } catch (error) {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};