import { withAuth } from '../../../lib/superauth';

// Sample menu data
const sampleMenu = [
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
    description: "Famous melt-in-the-mouth kebab, made with minced buffalo meat and secret spices.",
    rating: 4.8,
    cookTime: "20-25 min",
    tags: ["Non-Vegetarian", "Mughlai", "Awadhi"],
    featured: true,
    available: true
  },
  {
    id: 3,
    name: "Lucknowi Biryani",
    category: "Main Course",
    price: 320,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPTXEICeyoDwisw-4PE-PDps-I5D2mDMFgZQ&s",
    description: "Aromatic biryani with tender meat, cooked in traditional Awadhi 'dum' style.",
    rating: 4.9,
    cookTime: "40-45 min",
    tags: ["Non-Vegetarian", "Mughlai", "Awadhi", "Rice"],
    featured: true,
    available: true
  },
  {
    id: 4,
    name: "Paneer Butter Masala",
    category: "Main Course",
    price: 280,
    image: "https://cdn.zeptonow.com/production///tr:w-600,ar-100-100,pr-true,f-auto,q-80/web/recipes/paneer-butter-masala.png",
    description: "Cottage cheese cubes cooked in rich and creamy tomato-based gravy.",
    rating: 4.7,
    cookTime: "25-30 min",
    tags: ["Vegetarian", "Curry", "North Indian"],
    featured: false,
    available: true
  },
  {
    id: 5,
    name: "Masala Chai",
    category: "Beverages",
    price: 30,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnizjjezTC5vQr8VUA_EwaX4YgfDFN5sAg_A&s",
    description: "Spiced tea beverage made with aromatic Indian spices and herbs.",
    rating: 4.9,
    cookTime: "10 min",
    tags: ["Vegetarian", "Beverage", "Hot"],
    featured: false,
    available: true
  }
];

async function handler(req, res) {
  const { method } = req;
  const { user } = req;

  switch (method) {
    case 'GET':
      try {
        // Filter menu based on query parameters
        const { category, featured } = req.query;
        let filteredItems = [...sampleMenu];

        if (category && category !== 'All') {
          filteredItems = filteredItems.filter(item => item.category === category);
        }

        if (featured === 'true') {
          filteredItems = filteredItems.filter(item => item.featured);
        }

        res.status(200).json({
          success: true,
          data: {
            items: filteredItems,
            total: filteredItems.length,
            user_id: user.id
          }
        });
      } catch (error) {
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

export default withAuth(handler);