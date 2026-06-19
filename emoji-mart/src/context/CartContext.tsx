import React, { createContext, useContext, useState } from 'react';
import { CartContextType, CartItem, Emoji } from '../types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (emoji: Emoji) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.emoji.id === emoji.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.emoji.id === emoji.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { emoji, quantity: 1 }];
    });
  };

  const removeFromCart = (emojiId: string) => {
    setCart(currentCart => currentCart.filter(item => item.emoji.id !== emojiId));
  };

  const updateQuantity = (emojiId: string, quantity: number) => {
    setCart(currentCart =>
      currentCart.map(item =>
        item.emoji.id === emojiId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.emoji.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
