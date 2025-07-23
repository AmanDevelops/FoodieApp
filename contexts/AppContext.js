import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// Mock food items data
const initialFoodItems = [
  {
    id: 1,
    name: "Galouti Kebab",
    category: "Appetizers",
    price: 280,
    image:
      "https://www.yummytummyaarthi.com/wp-content/uploads/2023/02/galouti-kebab-1.jpg",
    description:
      "Melt-in-the-mouth minced mutton kebabs, a signature dish of Lucknow.",
    rating: 4.9,
    cookTime: "25-30 min",
    tags: ["Non-Vegetarian", "Mughlai", "Awadhi", "Spicy"],
    featured: false,
  },
  {
    id: 2,
    name: "Tunday Kebab",
    category: "Appetizers",
    price: 250,
    image:
      "https://akm-img-a-in.tosshub.com/aajtak/images/story/202211/tunday_kabab-sixteen_nine.jpg",
    description:
      "Another famous melt-in-the-mouth kebab, made with minced buffalo meat and a secret blend of spices.",
    rating: 4.8,
    cookTime: "20-25 min",
    tags: ["Non-Vegetarian", "Mughlai", "Awadhi"],
    featured: true,
  },
  {
    id: 3,
    name: "Lucknowi Biryani",
    category: "Main Course (Non-Veg)",
    price: 320,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPTXEICeyoDwisw-4PE-PDps-I5D2mDMFgZQ&s",
    description:
      "Aromatic and flavorful biryani with tender meat, cooked in the traditional Awadhi 'dum' style.",
    rating: 4.9,
    cookTime: "40-45 min",
    tags: ["Non-Vegetarian", "Mughlai", "Awadhi", "Rice"],
    featured: true,
  },
  {
    id: 4,
    name: "Sheermal",
    category: "Breads",
    price: 60,
    image: "https://kfoods.com/images1/newrecipeicon/sheermal_2466.jpg",
    description:
      "A saffron-flavored traditional flatbread, slightly sweet and often paired with kebabs and kormas.",
    rating: 4.6,
    cookTime: "15-20 min",
    tags: ["Vegetarian", "Bread", "Mughlai"],
    featured: false,
  },
  {
    id: 5,
    name: "Nihari Kulcha",
    category: "Main Course (Non-Veg)",
    price: 280,
    image:
      "https://images.slurrp.com/prodrich_article/2k4orrql9ji.webp?impolicy=slurrp-20210601&width=880&height=500",
    description:
      "A slow-cooked mutton stew served with fluffy, leavened bread (kulcha). A breakfast delicacy.",
    rating: 4.7,
    cookTime: "3-4 hours",
    tags: ["Non-Vegetarian", "Mughlai", "Awadhi", "Breakfast"],
    featured: false,
  },
  {
    id: 6,
    name: "Veg Kebab Paratha",
    category: "Street Food",
    price: 120,
    image:
      "https://images.royoorders.com/insecure/fit/1000/1000/ce/0/plain/https://s3.us-west-2.amazonaws.com/royoorders2.0-assets/82b5bc/prods/LxBOjEgzrrh8QTn6vdq3UQS4gLsLcNLCoz7Q6ymt.jpg@webp",
    description:
      "A vegetarian delight, with spicy vegetable and lentil kebabs wrapped in a flaky paratha.",
    rating: 4.4,
    cookTime: "15-20 min",
    tags: ["Vegetarian", "Street Food", "Spicy"],
    featured: true,
  },
  {
    id: 7,
    name: "Shahi Tukda",
    category: "Desserts",
    price: 150,
    image:
      "https://www.cubesnjuliennes.com/wp-content/uploads/2019/03/Best-Shahi-Tukda-Recipe-500x500.jpg",
    description:
      "A royal dessert made with fried bread slices soaked in hot milk with spices, including saffron and cardamom.",
    rating: 4.8,
    cookTime: "20-25 min",
    tags: ["Vegetarian", "Dessert", "Sweet", "Mughlai"],
    featured: false,
  },
  {
    id: 8,
    name: "Kulfi Falooda",
    category: "Desserts",
    price: 100,
    image:
      "https://i.ytimg.com/vi/SnHS003vmwA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDZr5_htFPD6s49GPrGvJDAgnSPAw",
    description:
      "Traditional Indian ice cream (kulfi) served with vermicelli (falooda) and rose syrup.",
    rating: 4.7,
    cookTime: "10 min",
    tags: ["Vegetarian", "Dessert", "Sweet", "Street Food"],
    featured: false,
  },
  {
    id: 9,
    name: "Basket Chaat",
    category: "Street Food",
    price: 180,
    image:
      "https://www.nehascookbook.com/wp-content/uploads/2022/09/Basket-puri-chaat-WS-1.jpg",
    description:
      "A crispy edible basket filled with a variety of savory snacks, yogurt, and chutneys.",
    rating: 4.6,
    cookTime: "15-20 min",
    tags: ["Vegetarian", "Street Food", "Chat"],
    featured: false,
  },
  {
    id: 10,
    name: "Mutton Korma",
    category: "Main Course (Non-Veg)",
    price: 350,
    image:
      "https://i.ytimg.com/vi/9uTQl0cYMaY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD9iDjsoGPpyxw-MSAJYd7jF1VgDw",
    description:
      "A rich and creamy mutton curry made with yogurt, nuts, and a blend of aromatic spices.",
    rating: 4.8,
    cookTime: "50-60 min",
    tags: ["Non-Vegetarian", "Mughlai", "Awadhi", "Curry"],
    featured: false,
  },
  {
    id: 11,
    name: "Paneer Butter Masala",
    category: "Main Course (Veg)",
    price: 280,
    image:
      "https://cdn.zeptonow.com/production///tr:w-600,ar-100-100,pr-true,f-auto,q-80/web/recipes/paneer-butter-masala.png",
    description:
      "Cottage cheese cubes cooked in a rich and creamy tomato-based gravy.",
    rating: 4.7,
    cookTime: "25-30 min",
    tags: ["Vegetarian", "Curry", "North Indian"],
    featured: false,
  },
  {
    id: 12,
    name: "Dal Makhani",
    category: "Main Course (Veg)",
    price: 220,
    image:
      "https://www.funfoodfrolic.com/wp-content/uploads/2023/04/Dal-Makhani-Blog-500x500.jpg",
    description:
      "Black lentils and kidney beans slow-cooked with butter and cream.",
    rating: 4.6,
    cookTime: "45-50 min",
    tags: ["Vegetarian", "Curry", "North Indian"],
    featured: false,
  },
  {
    id: 13,
    name: "Chicken Handi",
    category: "Main Course (Non-Veg)",
    price: 380,
    image:
      "https://www.chilitochoc.com/wp-content/uploads/2025/02/chicken-handi-recipe.jpg",
    description:
      "Chicken cooked in a traditional earthen pot (handi) with a yogurt and spice-based gravy.",
    rating: 4.7,
    cookTime: "40-45 min",
    tags: ["Non-Vegetarian", "Curry", "North Indian"],
    featured: false,
  },
  {
    id: 14,
    name: "Aloo Puri",
    category: "Breakfast",
    price: 90,
    image:
      "https://i0.wp.com/www.chitrasfoodbook.com/wp-content/uploads/2017/01/potato-poori.jpg?w=1200&ssl=1",
    description:
      "A simple yet delicious breakfast of spicy potato curry served with deep-fried bread (puri).",
    rating: 4.3,
    cookTime: "20-25 min",
    tags: ["Vegetarian", "Breakfast", "North Indian"],
    featured: false,
  },
  {
    id: 15,
    name: "Chole Bhature",
    category: "Breakfast",
    price: 150,
    image: "https://hogr.app/blog/wp-content/uploads/2023/01/image-43.png",
    description:
      "A popular North Indian dish of spicy chickpea curry served with fluffy, deep-fried bread.",
    rating: 4.5,
    cookTime: "30-35 min",
    tags: ["Vegetarian", "Breakfast", "North Indian", "Spicy"],
    featured: false,
  },
  {
    id: 16,
    name: "Malai Kofta",
    category: "Main Course (Veg)",
    price: 260,
    image:
      "https://carveyourcraving.com/wp-content/uploads/2021/09/Best-Malai-Kofta-recipe.jpg",
    description:
      "Deep-fried cottage cheese and vegetable balls in a rich and creamy gravy.",
    rating: 4.6,
    cookTime: "35-40 min",
    tags: ["Vegetarian", "Curry", "North Indian"],
    featured: false,
  },
  {
    id: 17,
    name: "Seekh Kebab",
    category: "Appetizers",
    price: 220,
    image:
      "https://staticcookist.akamaized.net/wp-content/uploads/sites/22/2022/03/Seekh-Kebab.jpg?im=AspectCrop=(16,9);",
    description:
      "Minced meat mixed with spices, skewered, and grilled to perfection.",
    rating: 4.7,
    cookTime: "20-25 min",
    tags: ["Non-Vegetarian", "Mughlai", "Awadhi", "Grilled"],
    featured: false,
  },
  {
    id: 18,
    name: "Kachori Sabzi",
    category: "Breakfast",
    price: 70,
    image: "https://i.ytimg.com/vi/Ml4lmeReAag/maxresdefault.jpg",
    description:
      "Flaky, deep-fried pastry filled with a spicy lentil mixture, served with a potato curry.",
    rating: 4.4,
    cookTime: "25-30 min",
    tags: ["Vegetarian", "Breakfast", "Street Food"],
    featured: false,
  },
  {
    id: 19,
    name: "Lassi",
    category: "Beverages",
    price: 80,
    image:
      "https://mithaiandmore.in/cdn/shop/products/L00004_rajwadi-lassi_1024x1024.jpg?v=1628753217",
    description:
      "A refreshing yogurt-based drink, available in sweet or salty variations.",
    rating: 4.5,
    cookTime: "5 min",
    tags: ["Vegetarian", "Beverage", "Cooling"],
    featured: false,
  },
  {
    id: 20,
    name: "Thandai",
    category: "Beverages",
    price: 120,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb7_KCv2_1pvYLJZNdjLCypqDnSC8u5JuaEA&s",
    description:
      "A cold drink prepared with a mixture of almonds, fennel seeds, watermelon kernels, rose petals, pepper, poppy seeds, cardamom, saffron, milk and sugar.",
    rating: 4.6,
    cookTime: "15-20 min",
    tags: ["Vegetarian", "Beverage", "Festive"],
    featured: false,
  },
  {
    id: 21,
    name: "Pani Puri (Golgappe)",
    category: "Street Food",
    price: 50,
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Pani_Puri1.JPG",
    description:
      "Hollow, crispy balls filled with a mixture of flavored water, tamarind chutney, chili, chaat masala, potato, onion or chickpeas.",
    rating: 4.8,
    cookTime: "10 min",
    tags: ["Vegetarian", "Street Food", "Chat", "Spicy"],
    featured: false,
  },
  {
    id: 22,
    name: "Samosa",
    category: "Street Food",
    price: 60,
    image:
      "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/12/samosa-recipe.jpg",
    description:
      "A fried or baked pastry with a savory filling, such as spiced potatoes, onions, peas, or lentils.",
    rating: 4.4,
    cookTime: "20-25 min",
    tags: ["Vegetarian", "Street Food", "Snack"],
    featured: true,
  },
  {
    id: 23,
    name: "Jalebi",
    category: "Desserts",
    price: 90,
    image:
      "https://static.toiimg.com/thumb/53099699.cms?imgsize=182393&width=800&height=800",
    description:
      "A sweet, crispy, and chewy dessert made by deep-frying a wheat flour batter in pretzel or circular shapes, which are then soaked in sugar syrup.",
    rating: 4.6,
    cookTime: "15-20 min",
    tags: ["Vegetarian", "Dessert", "Sweet", "Street Food"],
    featured: true,
  },
  {
    id: 24,
    name: "Rabri",
    category: "Desserts",
    price: 130,
    image:
      "https://www.indianhealthyrecipes.com/wp-content/uploads/2020/10/rabri-rabdi.jpg",
    description:
      "A sweet, condensed-milk-based dish, made by boiling milk on low heat for a long time until it becomes dense and changes its color to off-white or pale yellow.",
    rating: 4.7,
    cookTime: "1-2 hours",
    tags: ["Vegetarian", "Dessert", "Sweet"],
    featured: false,
  },
  {
    id: 29,
    name: "Gajar Ka Halwa",
    category: "Desserts",
    price: 110,
    image:
      "https://www.cookwithmanali.com/wp-content/uploads/2015/01/Gajar-Halwa-Indian.jpg",
    description:
      "A sweet dessert pudding made from grated carrots, milk, sugar, and ghee.",
    rating: 4.7,
    cookTime: "45-50 min",
    tags: ["Vegetarian", "Dessert", "Sweet", "Winter"],
    featured: true,
  },
  {
    id: 30,
    name: "Masala Chai",
    category: "Beverages",
    price: 30,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnizjjezTC5vQr8VUA_EwaX4YgfDFN5sAg_A&s",
    description:
      "A spiced tea beverage made by brewing black tea with a mixture of aromatic Indian spices and herbs.",
    rating: 4.9,
    cookTime: "10 min",
    tags: ["Vegetarian", "Beverage", "Hot"],
    featured: false,
  },
];

export const AppProvider = ({ children }) => {
  const [foodItems] = useState(initialFoodItems);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    address: "123 Main St, City, State",
  });

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("foodOrderingCart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("foodOrderingCart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
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
      status: "Preparing",
    };
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
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
    setUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
