import { withSuperAuth, hasPermission } from '../../../lib/superauth';

// Mock food items data (in production, this would come from a database)
const foodItems = [
  {
    id: 1,
    name: "Galouti Kebab",
    category: "Appetizers",
    price: 280,
    image: "https://www.yummytummyaarthi.com/wp-content/uploads/2023/02/galouti-kebab-1.jpg",
    description: "Melt-in-the-mouth minced mutton kebabs, a signature dish of Lucknow.",
    rating: 4.9,
    cookTime: "25-30 min",
    tags: ["Non-Vegetarian", "Mughlai", "Awadhi", "Spicy"],
    featured: false,
    available: true
  },
  {
    id: 2,
    name: "Tunday Kebab",
    category: "Appetizers", 
    price: 250,
    image: "https://akm-img-a-in.tosshub.com/aajtak/images/story/202211/tunday_kabab-sixteen_nine.jpg",
    description: "Another famous melt-in-the-mouth kebab, made with minced buffalo meat and a secret blend of spices.",
    rating: 4.8,
    cookTime: "20-25 min",
    tags: ["Non-Vegetarian", "Mughlai", "Awadhi"],
    featured: true,
    available: true
  },
  {
    id: 3,
    name: "Lucknowi Biryani",
    category: "Main Course (Non-Veg)",
    price: 320,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPTXEICeyoDwisw-4PE-PDps-I5D2mDMFgZQ&s",
    description: "Aromatic and flavorful biryani with tender meat, cooked in the traditional Awadhi 'dum' style.",
    rating: 4.9,
    cookTime: "40-45 min",
    tags: ["Non-Vegetarian", "Mughlai", "Awadhi", "Rice"],
    featured: true,
    available: true
  }
];

async function handler(req, res) {
  const { method } = req;
  const { user } = req;

  // Check if user has permission to view menu
  if (!hasPermission(user, 'food:view')) {
    return res.status(403).json({
      error: 'Insufficient permissions',
      message: 'User does not have permission to view menu'
    });
  }

  switch (method) {
    case 'GET':
      try {
        // Filter menu based on query parameters
        const { category, featured, available } = req.query;
        let filteredItems = [...foodItems];

        if (category && category !== 'All') {
          filteredItems = filteredItems.filter(item => item.category === category);
        }

        if (featured === 'true') {
          filteredItems = filteredItems.filter(item => item.featured);
        }

        if (available !== 'false') {
          filteredItems = filteredItems.filter(item => item.available);
        }

        res.status(200).json({
          success: true,
          data: {
            items: filteredItems,
            total: filteredItems.length,
            user_context: {
              user_id: user.id,
              permissions: user.permissions
            }
          }
        });
      } catch (error) {
        console.error('Menu fetch error:', error);
        res.status(500).json({
          error: 'Internal server error',
          message: 'Failed to fetch menu items'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).json({
        error: 'Method not allowed',
        message: `Method ${method} not allowed`
      });
      break;
  }
}

export default withSuperAuth(handler);