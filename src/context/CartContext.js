import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    console.log('🔄 Loading cart from localStorage...');
    const savedCart = localStorage.getItem('cart');
    console.log('📦 Saved cart data:', savedCart);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log('✅ Parsed cart:', parsedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('❌ Error parsing cart:', error);
        localStorage.removeItem('cart');
      }
    } else {
      console.log('ℹ️ No saved cart found');
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      console.log('💾 Saving cart to localStorage:', cart);
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (product, quantity = 1) => {
    console.log('➕ Adding to cart:', { product, quantity });
    setCart(prevCart => {
      // Create unique key based on product id, variant, color, and model
      const itemKey = `${product.id}-${product.variant || 'default'}-${product.selectedColor || ''}-${product.selectedModel || ''}`;
      console.log('🔑 Item key:', itemKey);
      
      const existingItem = prevCart.find(item => {
        const existingKey = `${item.id}-${item.variant || 'default'}-${item.selectedColor || ''}-${item.selectedModel || ''}`;
        return existingKey === itemKey;
      });
      
      if (existingItem) {
        console.log('✅ Item exists, updating quantity');
        return prevCart.map(item => {
          const existingKey = `${item.id}-${item.variant || 'default'}-${item.selectedColor || ''}-${item.selectedModel || ''}`;
          return existingKey === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item;
        });
      }
      
      console.log('✅ New item, adding to cart');
      // Store magsafe_option for backend compatibility
      const magsafe_option = product.variant === 'with-magsafe' ? true : 
                            product.variant === 'without-magsafe' ? false : null;
      
      const newCart = [...prevCart, { 
        ...product, 
        quantity, 
        cartItemId: itemKey,
        magsafe_option // Add for backend
      }];
      console.log('📦 New cart state:', newCart);
      return newCart;
    });
  };

  const removeFromCart = (productId, variant = null) => {
    setCart(prevCart => prevCart.filter(item => {
      if (variant) {
        return !(item.id === productId && item.variant === variant);
      }
      return item.id !== productId;
    }));
  };

  const updateQuantity = (productId, quantity, variant = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item => {
        // Match by both id and variant
        if (variant) {
          return (item.id === productId && item.variant === variant) 
            ? { ...item, quantity } 
            : item;
        }
        return item.id === productId ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
