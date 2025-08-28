import { withSuperAuth, hasPermission } from '../../../lib/superauth';

// Mock orders storage (in production, use database)
const userOrders = new Map();

async function handler(req, res) {
  const { method } = req;
  const { user } = req;

  // Check if user has permission to manage orders
  if (!hasPermission(user, 'food:order')) {
    return res.status(403).json({
      error: 'Insufficient permissions',
      message: 'User does not have permission to manage orders'
    });
  }

  const ordersKey = `orders_${user.id}`;

  switch (method) {
    case 'GET':
      try {
        const orders = userOrders.get(ordersKey) || [];
        
        res.status(200).json({
          success: true,
          data: {
            orders: orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
            total: orders.length,
            user_context: {
              user_id: user.id
            }
          }
        });
      } catch (error) {
        console.error('Orders fetch error:', error);
        res.status(500).json({
          error: 'Internal server error',
          message: 'Failed to fetch orders'
        });
      }
      break;

    case 'POST':
      try {
        const { cart_items, delivery_address, payment_method = 'cash_on_delivery' } = req.body;

        if (!cart_items || !Array.isArray(cart_items) || cart_items.length === 0) {
          return res.status(400).json({
            error: 'Bad request',
            message: 'cart_items is required and must be a non-empty array'
          });
        }

        if (!delivery_address) {
          return res.status(400).json({
            error: 'Bad request',
            message: 'delivery_address is required'
          });
        }

        // Calculate order totals
        const subtotal = cart_items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const delivery_fee = 60;
        const tax = subtotal * 0.05;
        const total = subtotal + delivery_fee + tax;

        // Generate order
        const order = {
          id: Date.now(),
          user_id: user.id,
          items: cart_items,
          delivery_address,
          payment_method,
          pricing: {
            subtotal,
            delivery_fee,
            tax,
            total
          },
          status: 'confirmed',
          estimated_delivery: new Date(Date.now() + (30 + Math.random() * 20) * 60 * 1000).toISOString(), // 30-50 minutes
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Save order
        let orders = userOrders.get(ordersKey) || [];
        orders.push(order);
        userOrders.set(ordersKey, orders);

        // Clear user's cart after successful order
        const cartKey = `cart_${user.id}`;
        const userCarts = new Map(); // This would be imported from cart.js in real implementation
        userCarts.set(cartKey, []);

        res.status(201).json({
          success: true,
          message: 'Order placed successfully',
          data: {
            order_id: order.id,
            status: order.status,
            estimated_delivery: order.estimated_delivery,
            total: order.pricing.total,
            order_details: order
          }
        });
      } catch (error) {
        console.error('Place order error:', error);
        res.status(500).json({
          error: 'Internal server error',
          message: 'Failed to place order'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({
        error: 'Method not allowed',
        message: `Method ${method} not allowed`
      });
      break;
  }
}

export default withSuperAuth(handler);