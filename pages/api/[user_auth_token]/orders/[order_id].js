import { withSuperAuth, hasPermission } from '../../../../lib/superauth';

// Mock orders storage (in production, use database)
const userOrders = new Map();

async function handler(req, res) {
  const { method } = req;
  const { user, query } = req;
  const { order_id } = query;

  // Check if user has permission to view orders
  if (!hasPermission(user, 'food:order')) {
    return res.status(403).json({
      error: 'Insufficient permissions',
      message: 'User does not have permission to view orders'
    });
  }

  const ordersKey = `orders_${user.id}`;

  switch (method) {
    case 'GET':
      try {
        const orders = userOrders.get(ordersKey) || [];
        const order = orders.find(o => o.id === parseInt(order_id));

        if (!order) {
          return res.status(404).json({
            error: 'Order not found',
            message: 'Order not found or does not belong to user'
          });
        }

        // Simulate order status progression
        const now = new Date();
        const orderTime = new Date(order.created_at);
        const minutesElapsed = (now - orderTime) / (1000 * 60);

        let currentStatus = order.status;
        if (minutesElapsed > 5 && currentStatus === 'confirmed') {
          currentStatus = 'preparing';
        } else if (minutesElapsed > 20 && currentStatus === 'preparing') {
          currentStatus = 'out_for_delivery';
        } else if (minutesElapsed > 45 && currentStatus === 'out_for_delivery') {
          currentStatus = 'delivered';
        }

        const orderWithStatus = {
          ...order,
          status: currentStatus,
          tracking: {
            confirmed_at: order.created_at,
            preparing_at: minutesElapsed > 5 ? new Date(orderTime.getTime() + 5 * 60 * 1000).toISOString() : null,
            out_for_delivery_at: minutesElapsed > 20 ? new Date(orderTime.getTime() + 20 * 60 * 1000).toISOString() : null,
            delivered_at: minutesElapsed > 45 ? new Date(orderTime.getTime() + 45 * 60 * 1000).toISOString() : null
          }
        };

        res.status(200).json({
          success: true,
          data: {
            order: orderWithStatus,
            user_context: {
              user_id: user.id
            }
          }
        });
      } catch (error) {
        console.error('Order fetch error:', error);
        res.status(500).json({
          error: 'Internal server error',
          message: 'Failed to fetch order details'
        });
      }
      break;

    case 'PUT':
      try {
        const { action } = req.body;

        if (!action) {
          return res.status(400).json({
            error: 'Bad request',
            message: 'action is required'
          });
        }

        let orders = userOrders.get(ordersKey) || [];
        const orderIndex = orders.findIndex(o => o.id === parseInt(order_id));

        if (orderIndex === -1) {
          return res.status(404).json({
            error: 'Order not found',
            message: 'Order not found or does not belong to user'
          });
        }

        const order = orders[orderIndex];

        switch (action) {
          case 'cancel':
            if (['delivered', 'cancelled'].includes(order.status)) {
              return res.status(400).json({
                error: 'Cannot cancel order',
                message: 'Order cannot be cancelled in current status'
              });
            }
            order.status = 'cancelled';
            order.cancelled_at = new Date().toISOString();
            break;

          default:
            return res.status(400).json({
              error: 'Invalid action',
              message: 'Supported actions: cancel'
            });
        }

        order.updated_at = new Date().toISOString();
        orders[orderIndex] = order;
        userOrders.set(ordersKey, orders);

        res.status(200).json({
          success: true,
          message: `Order ${action}ed successfully`,
          data: {
            order_id: order.id,
            status: order.status,
            updated_at: order.updated_at
          }
        });
      } catch (error) {
        console.error('Order update error:', error);
        res.status(500).json({
          error: 'Internal server error',
          message: 'Failed to update order'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).json({
        error: 'Method not allowed',
        message: `Method ${method} not allowed`
      });
      break;
  }
}

export default withSuperAuth(handler);