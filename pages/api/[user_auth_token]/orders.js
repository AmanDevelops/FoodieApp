import { withAuth } from '../../../lib/superauth';

// Simple in-memory orders storage
const userOrders = new Map();

async function handler(req, res) {
  const { method } = req;
  const { user } = req;
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
            user_id: user.id
          }
        });
      } catch (error) {
        res.status(500).json({
          error: 'Internal server error',
          message: 'Failed to fetch orders'
        });
      }
      break;

    case 'POST':
      try {
        const { cart_items, delivery_address } = req.body;

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

        // Calculate totals
        const subtotal = cart_items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const delivery_fee = 60;
        const tax = subtotal * 0.05;
        const total = subtotal + delivery_fee + tax;

        // Create order
        const order = {
          id: Date.now(),
          user_id: user.id,
          items: cart_items,
          delivery_address,
          pricing: {
            subtotal,
            delivery_fee,
            tax,
            total
          },
          status: 'confirmed',
          estimated_delivery: new Date(Date.now() + (30 + Math.random() * 20) * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        };

        // Save order
        let orders = userOrders.get(ordersKey) || [];
        orders.push(order);
        userOrders.set(ordersKey, orders);

        // Clear cart after order
        const userCarts = new Map();
        userCarts.set(`cart_${user.id}`, []);

        res.status(201).json({
          success: true,
          message: 'Order placed successfully',
          data: {
            order_id: order.id,
            status: order.status,
            estimated_delivery: order.estimated_delivery,
            total: order.pricing.total
          }
        });
      } catch (error) {
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

export default withAuth(handler);