import { withSuperAuth, getUserAppData } from '../../../lib/superauth';

async function handler(req, res) {
  const { method } = req;
  const { user } = req;

  switch (method) {
    case 'GET':
      try {
        const appData = getUserAppData(user);
        
        res.status(200).json({
          success: true,
          data: {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              permissions: user.permissions,
              app_context: user.app_context
            },
            app_data: appData,
            token_info: {
              expires_at: user.token_expires_at,
              scoped_permissions: user.permissions
            }
          }
        });
      } catch (error) {
        console.error('Profile fetch error:', error);
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

export default withSuperAuth(handler);