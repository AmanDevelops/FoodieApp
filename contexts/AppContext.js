import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// Demo user token - in real app this would come from G1
const USER_AUTH_TOKEN = "g1_token_user123";

export const AppProvider = ({ children }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load initial data from backend
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load menu items
      const menuResponse = await fetch(`/api/${USER_AUTH_TOKEN}/menu`);
      if (menuResponse.ok) {
        const menuData = await menuResponse.json();
        setFoodItems(menuData.data.items || []);
      }

      // Load user profile
      const profileResponse = await fetch(`/api/${USER_AUTH_TOKEN}/profile`);
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setUser(profileData.data.user);
      }

      // Load cart
      const cartResponse = await fetch(`/api/${USER_AUTH_TOKEN}/cart`);
      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        setCart(cartData.data.items || []);
      }

      // Load orders
      const ordersResponse = await fetch(`/api/${USER_AUTH_TOKEN}/orders`);
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.data.orders || []);
      }

    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item, quantity = 1) => {
    try {
      const response = await fetch(`/api/${USER_AUTH_TOKEN}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_id: item.id,
          quantity: quantity,
          item_details: {
            name: item.name,
            price: item.price,
            image: item.image,
            category: item.category
          }
        })
      });

      if (response.ok) {
        // Reload cart from backend
        const cartResponse = await fetch(`/api/${USER_AUTH_TOKEN}/cart`);
        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          setCart(cartData.data.items || []);
        }
      } else {
        console.error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await fetch(`/api/${USER_AUTH_TOKEN}/cart?item_id=${itemId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Reload cart from backend
        const cartResponse = await fetch(`/api/${USER_AUTH_TOKEN}/cart`);
        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          setCart(cartData.data.items || []);
        }
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      const response = await fetch(`/api/${USER_AUTH_TOKEN}/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_id: itemId,
          quantity: quantity
        })
      });

      if (response.ok) {
        // Reload cart from backend
        const cartResponse = await fetch(`/api/${USER_AUTH_TOKEN}/cart`);
        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          setCart(cartData.data.items || []);
        }
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`/api/${USER_AUTH_TOKEN}/cart`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCart([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const placeOrder = async (deliveryAddress) => {
    try {
      const response = await fetch(`/api/${USER_AUTH_TOKEN}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart_items: cart,
          delivery_address: deliveryAddress || {
            type: "Home",
            address: "123 Main St, City, State"
          }
        })
      });

      if (response.ok) {
        const orderData = await response.json();
        
        // Clear cart and reload orders
        await clearCart();
        
        const ordersResponse = await fetch(`/api/${USER_AUTH_TOKEN}/orders`);
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setOrders(ordersData.data.orders || []);
        }

        return {
          id: orderData.data.order_id,
          total: orderData.data.total,
          status: orderData.data.status,
          date: new Date().toISOString()
        };
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  };

  const value = {
    foodItems,
    cart,
    orders,
    user,
    loading,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    placeOrder,
    setUser,
    userAuthToken: USER_AUTH_TOKEN
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};