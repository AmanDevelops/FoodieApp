import { withAuth } from '../../../lib/superauth';

// Simple in-memory cart storage (resets on server restart)
const userCarts = new Map();

async function handler(req, res) {
  const { method } = req;
  const { user } = req;
  const cartKey = `cart_${user.id}`;

  switch (method) {
    case 'GET':
      try {
        const cart = userCarts.get(cartKey) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        res.status(200).json({
          success: true,
          data: {
            items: cart,
            summary: {
              total_items: totalItems,
              total_price: totalPrice,
              delivery_fee: 60,
              tax: totalPrice * 0.05,
              grand_total: totalPrice + 60 + (totalPrice * 0.05)
            },
            user_id: user.id
          }
        });
      } catch (error) {
        res.status(500).json({
          error: 'Internal server error',
          message: 'Failed to fetch cart'
        });
      }
      break;

    case 'POST':
      try {
        const { item_id, quantity = 1, item_details } = req.body;

        if (!item_id || !item_details) {
          return res.status(400).json({
            error: 'Bad request',
            message: 'item_id and item_details are required'
          });
        }

        let cart = userCarts.get(cartKey) || [];
        const existingItemIndex = cart.findIndex(item => item.id === item_id);

        if (existingItemIndex >= 0) {
          cart[existingItemIndex].quantity += quantity;
        } else {
          cart.push({
            id: item_id,
            name: item_details.name,
            price: item_details.price,
            image: item_details.image,
            category: item_details.category,
            quantity: quantity,
            added_at: new Date().toISOString()
          });
        }

        userCarts.set(cartKey, cart);

        res.status(200).json({
          success: true,
          message: 'Item added to cart',
          data: {
            cart_items: cart.length,
            total_quantity: cart.reduce((sum, item) => sum + item.quantity, 0)
          }
        });
      } catch (error) {
        res.status(500).json({
          error: 'Internal server error',
          message: 'Failed to add item to cart'
        });
      }
      break;

    case 'PUT':
      try {
        const { item_id, quantity } = req.body;

        if (!item_id || quantity === undefined) {
          return res.status(400).json({
            error: 'Bad request',
            message: 'item_id and quantity are required'
          });
        }

        let cart = userCarts.get(cartKey) || [];
        const itemIndex = cart.findIndex(item => item.id === item_id);

        if (itemIndex === -1) {
          return res.status(404).json({
            error: 'Item not found',
            message: 'Item not found in cart'
          });
        }

        if (quantity <= 0) {
          cart.splice(itemIndex, 1);
        } else {
          cart[itemIndex].quantity = quantity;
        }

        userCarts.set(cartKey, cart);

        res.status(200).json({
          success: true,
          message: 'Cart updated successfully'
        });
      } catch (error) {
        res.status(500).json({
          error: 'Internal server error',
          message: 'Failed to update cart'
        });
      }
      break;

    case 'DELETE':
      try {
        const { item_id } = req.query;

        if (item_id) {
          let cart = userCarts.get(cartKey) || [];
          cart = cart.filter(item => item.id !== parseInt(item_id));
          userCarts.set(cartKey, cart);
        } else {
          userCarts.set(cartKey, []);
        }

        res.status(200).json({
          success: true,
          message: item_id ? 'Item removed from cart' : 'Cart cleared successfully'
        });
      } catch (error) {
        res.status(500).json({
          error: 'Internal server error',
          message: 'Failed to remove item from cart'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({
        error: 'Method not allowed',
        message: `Method ${method} not allowed`
      });
      break;
  }
}

export default withAuth(handler);