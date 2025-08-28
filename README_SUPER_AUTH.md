# Simple Super Auth Integration

This is a basic implementation of Super Auth for the FoodieApp with sample data.

## How It Works

1. G1 provides a `user_auth_token` in the format `g1_token_[user_id]`
2. The token is passed in the URL path: `/api/[user_auth_token]/[endpoint]`
3. Our backend validates the token and extracts user info
4. All data is stored in memory (resets on server restart)

## Available Endpoints

### Menu
- `GET /api/g1_token_user123/menu` - Get menu items
- Query params: `category`, `featured`

### Cart
- `GET /api/g1_token_user123/cart` - Get user's cart
- `POST /api/g1_token_user123/cart` - Add item to cart
- `PUT /api/g1_token_user123/cart` - Update cart item
- `DELETE /api/g1_token_user123/cart` - Remove item or clear cart

### Orders
- `GET /api/g1_token_user123/orders` - Get user's orders
- `POST /api/g1_token_user123/orders` - Place new order

### Profile
- `GET /api/g1_token_user123/profile` - Get user profile

### Health Check
- `GET /api/health` - Check if app is running (no auth needed)

## Example Usage

```javascript
// Get menu
const response = await fetch('/api/g1_token_user123/menu');

// Add to cart
const response = await fetch('/api/g1_token_user123/cart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    item_id: 1,
    quantity: 2,
    item_details: {
      name: "Galouti Kebab",
      price: 280,
      image: "...",
      category: "Appetizers"
    }
  })
});

// Place order
const response = await fetch('/api/g1_token_user123/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cart_items: [...],
    delivery_address: {
      type: "Home",
      address: "123 Main St"
    }
  })
});
```

## Sample Token Format
Use tokens like: `g1_token_user123`, `g1_token_john`, `g1_token_alice`

The system will extract the user ID from the token and create a simple user profile.