import { withAuth } from '../../../lib/superauth';

async function handler(req, res) {
  const { method } = req;
  const { user } = req;

  switch (method) {
    case 'GET':
      try {
        res.status(200).json({
          success: true,
          data: {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              token: user.token
            },
            app_info: {
              name: 'FoodieApp',
              version: '1.0.0'
            }
          }
        });
      } catch (error) {
        res.status(500).json({
          error: 'Internal server error',
          message: 'Failed to fetch user profile'
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