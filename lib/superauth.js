/**
 * Super Auth G1 Integration
 * Handles authentication with G1's ephemeral token system
 */

// Mock G1 API endpoint - replace with actual G1 core endpoint
const G1_CORE_API = process.env.G1_CORE_API || 'https://api.g1.core/auth';

/**
 * Validates user_auth_token with G1 core and returns user context
 * @param {string} user_auth_token - Ephemeral token from G1
 * @returns {Promise<Object>} User object with scoped permissions
 */
export async function User(user_auth_token) {
  try {
    // Validate token format
    if (!user_auth_token || typeof user_auth_token !== 'string') {
      throw new Error('Invalid user_auth_token format');
    }

    // In production, this would make a real API call to G1 core
    // For now, we'll simulate the response based on token validation
    const response = await validateTokenWithG1Core(user_auth_token);
    
    if (!response.valid) {
      throw new Error('Invalid or expired user_auth_token');
    }

    return {
      id: response.user_id,
      email: response.email,
      name: response.name,
      permissions: response.permissions,
      scoped_data: response.scoped_data,
      token_expires_at: response.expires_at,
      app_context: response.app_context
    };
  } catch (error) {
    console.error('Super Auth validation failed:', error);
    throw new Error('Authentication failed');
  }
}

/**
 * Simulates G1 core API validation
 * In production, this would be a real HTTP request to G1's authentication service
 */
async function validateTokenWithG1Core(token) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Mock validation logic - replace with actual G1 API call
  if (token.startsWith('g1_token_')) {
    // Extract mock user data from token (in real implementation, this comes from G1)
    const tokenParts = token.split('_');
    const userId = tokenParts[2] || 'user123';
    
    return {
      valid: true,
      user_id: userId,
      email: `user${userId}@example.com`,
      name: `User ${userId}`,
      permissions: ['food:order', 'food:view', 'cart:manage'],
      scoped_data: {
        app_name: 'foodie-app',
        allowed_actions: ['order', 'cart', 'view_menu']
      },
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
      app_context: {
        super_app: 'foodie-app',
        session_id: `session_${Date.now()}`
      }
    };
  }
  
  return { valid: false };
}

/**
 * Middleware to extract and validate user_auth_token from request
 * Supports both path parameter and header-based token passing
 */
export function withSuperAuth(handler) {
  return async (req, res) => {
    try {
      let user_auth_token;
      
      // Try to get token from URL path parameter
      if (req.query.user_auth_token) {
        user_auth_token = req.query.user_auth_token;
      }
      // Try to get token from Authorization header
      else if (req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
          user_auth_token = authHeader.substring(7);
        }
      }
      // Try to get token from custom header
      else if (req.headers['x-g1-auth-token']) {
        user_auth_token = req.headers['x-g1-auth-token'];
      }
      
      if (!user_auth_token) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'No user_auth_token provided'
        });
      }
      
      // Validate token and get user context
      const user = await User(user_auth_token);
      
      // Attach user to request object
      req.user = user;
      req.user_auth_token = user_auth_token;
      
      // Call the actual handler
      return handler(req, res);
      
    } catch (error) {
      console.error('Super Auth middleware error:', error);
      return res.status(401).json({
        error: 'Authentication failed',
        message: error.message
      });
    }
  };
}

/**
 * Helper function to check if user has specific permission
 */
export function hasPermission(user, permission) {
  return user.permissions && user.permissions.includes(permission);
}

/**
 * Helper function to get user's app-specific data
 */
export function getUserAppData(user) {
  return user.scoped_data || {};
}