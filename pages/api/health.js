/**
 * Health check endpoint - no authentication required
 */
export default function handler(req, res) {
  const { method } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      error: 'Method not allowed',
      message: `Method ${method} not allowed`
    });
  }

  res.status(200).json({
    success: true,
    message: 'FoodieApp is running',
    data: {
      app_name: 'foodie-app',
      version: '1.0.0',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      endpoints: [
        'GET /api/[user_auth_token]/menu',
        'GET /api/[user_auth_token]/cart',
        'POST /api/[user_auth_token]/cart',
        'PUT /api/[user_auth_token]/cart',
        'DELETE /api/[user_auth_token]/cart',
        'GET /api/[user_auth_token]/orders',
        'POST /api/[user_auth_token]/orders',
        'GET /api/[user_auth_token]/profile'
      ]
    }
  });
}