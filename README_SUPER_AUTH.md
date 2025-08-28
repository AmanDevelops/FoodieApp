# Super Auth Integration Guide

This FoodieApp has been integrated with G1's Super Auth system for seamless authentication.

## How Super Auth Works in This App

### Authentication Flow
1. G1's Brain generates a dynamic `user_auth_token` when it needs to interact with the FoodieApp
2. The token is passed either as:
   - URL path parameter: `/api/[user_auth_token]/menu`
   - Authorization header: `Bearer [user_auth_token]`
   - Custom header: `X-G1-Auth-Token: [user_auth_token]`
3. Our backend validates the token with G1 Core and retrieves user context
4. API endpoints return scoped data based on user permissions

### Available API Endpoints

All authenticated endpoints follow the pattern: `/api/[user_auth_token]/[endpoint]`

#### Menu Management
- `GET /api/[user_auth_token]/menu` - Get menu items
  - Query params: `category`, `featured`, `available`
  - Requires permission: `food:view`

#### Cart Management
- `GET /api/[user_auth_token]/cart` - Get user's cart
- `POST /api/[user_auth_token]/cart` - Add item to cart
- `PUT /api/[user_auth_token]/cart` - Update cart item quantity
- `DELETE /api/[user_auth_token]/cart` - Remove item or clear cart
- Requires permission: `cart:manage`

#### Order Management
- `GET /api/[user_auth_token]/orders` - Get user's orders
- `POST /api/[user_auth_token]/orders` - Place new order
- `GET /api/[user_auth_token]/orders/[order_id]` - Get specific order
- `PUT /api/[user_auth_token]/orders/[order_id]` - Update order (cancel)
- Requires permission: `food:order`

#### User Profile
- `GET /api/[user_auth_token]/profile` - Get user profile and permissions

### Example API Calls

```javascript
// Get menu items
const response = await fetch('/api/g1_token_user123/menu');

// Add item to cart
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
      address: "123 Main St, City"
    },
    payment_method: "cash_on_delivery"
  })
});
```

### Using with Headers (Alternative)

```javascript
const response = await fetch('/api/menu', {
  headers: {
    'Authorization': 'Bearer g1_token_user123',
    // or
    'X-G1-Auth-Token': 'g1_token_user123'
  }
});
```

### Error Handling

The API returns consistent error responses:

```json
{
  "error": "Authentication failed",
  "message": "Invalid or expired user_auth_token"
}
```

Common status codes:
- `401` - Authentication required/failed
- `403` - Insufficient permissions
- `404` - Resource not found
- `405` - Method not allowed
- `500` - Internal server error

### Security Features

1. **Ephemeral Tokens**: Each `user_auth_token` is single-use and short-lived
2. **Scoped Permissions**: Users only get permissions relevant to their current action
3. **No Password Management**: The app doesn't store or manage user passwords
4. **Automatic Validation**: All tokens are validated with G1 Core in real-time

### Development Notes

- The current implementation includes mock G1 Core validation for development
- In production, replace `validateTokenWithG1Core()` with actual G1 API calls
- Set the correct `G1_CORE_API` endpoint in environment variables
- All user data is scoped to the specific Super App context

### Health Check

Use `/api/health` to verify the app is running and Super Auth is enabled.