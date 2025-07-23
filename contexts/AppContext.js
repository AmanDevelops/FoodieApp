import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Mock food items data
const initialFoodItems = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "Pizza",
    price: 12.99,
    image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg",
    description: "Classic pizza with fresh tomatoes, mozzarella cheese, and basil leaves",
    rating: 4.5,
    cookTime: "20-25 min",
    tags: ["Vegetarian", "Italian"],
    featured: true
  },
  {
    id: 2,
    name: "Chicken Burger",
    category: "Burgers",
    price: 15.99,
    image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
    description: "Juicy grilled chicken breast with lettuce, tomatoes, and special sauce",
    rating: 4.7,
    cookTime: "15-20 min",
    tags: ["Grilled", "Protein"],
    featured: true
  },
  {
    id: 3,
    name: "Caesar Salad",
    category: "Salads",
    price: 9.99,
    image: "https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg",
    description: "Fresh romaine lettuce with croutons, parmesan cheese, and caesar dressing",
    rating: 4.2,
    cookTime: "10 min",
    tags: ["Healthy", "Fresh"],
    featured: false
  },
  {
    id: 4,
    name: "Pad Thai",
    category: "Asian",
    price: 13.99,
    image: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg",
    description: "Traditional Thai stir-fried noodles with shrimp, tofu, and peanuts",
    rating: 4.6,
    cookTime: "18-22 min",
    tags: ["Spicy", "Noodles"],
    featured: true
  },
  {
    id: 5,
    name: "Chocolate Cake",
    category: "Desserts",
    price: 7.99,
    image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg",
    description: "Rich chocolate layer cake with chocolate frosting",
    rating: 4.8,
    cookTime: "5 min",
    tags: ["Sweet", "Dessert"],
    featured: false
  },
  {
    id: 6,
    name: "Fish Tacos",
    category: "Mexican",
    price: 11.99,
    image: "https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg",
    description: "Grilled fish with cabbage slaw and lime crema in soft tortillas",
    rating: 4.4,
    cookTime: "12-15 min",
    tags: ["Fish", "Mexican"],
    featured: false
  },
  {
    id: 7,
    name: "Pepperoni Pizza",
    category: "Pizza",
    price: 14.99,
    image: "https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg",
    description: "Classic pepperoni pizza with mozzarella cheese and tomato sauce",
    rating: 4.6,
    cookTime: "20-25 min",
    tags: ["Meat", "Italian"],
    featured: true
  },
  {
    id: 8,
    name: "Veggie Burger",
    category: "Burgers",
    price: 12.99,
    image: "https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg",
    description: "Plant-based patty with avocado, sprouts, and herb mayo",
    rating: 4.3,
    cookTime: "12-18 min",
    tags: ["Vegetarian", "Healthy"],
    featured: false
  },
  {
    id: 9,
    name: "Sushi Combo",
    category: "Asian",
    price: 18.99,
    image: "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg",
    description: "Assorted sushi rolls with salmon, tuna, and california rolls",
    rating: 4.9,
    cookTime: "15-20 min",
    tags: ["Fresh", "Japanese"],
    featured: true
  },
  {
    id: 10,
    name: "Greek Salad",
    category: "Salads",
    price: 10.99,
    image: "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg",
    description: "Traditional Greek salad with feta cheese, olives, and oregano",
    rating: 4.1,
    cookTime: "8 min",
    tags: ["Mediterranean", "Healthy"],
    featured: false
  }
];

export const AppProvider = ({ children }) => {
  const [foodItems] = useState(initialFoodItems);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    address: '123 Main St, City, State'
  });

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('foodOrderingCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('foodOrderingCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const placeOrder = () => {
    const newOrder = {
      id: Date.now(),
      items: [...cart],
      total: getTotalPrice(),
      date: new Date().toISOString(),
      status: 'Preparing'
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    clearCart();
    return newOrder;
  };

  const value = {
    foodItems,
    cart,
    orders,
    user,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    placeOrder,
    setUser
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};