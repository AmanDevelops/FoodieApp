/**
 * Simplified Super Auth Integration
 * Basic template with sample data - no external API calls
 */

/**
 * Simple user validation - just checks if token exists and is valid format
 * @param {string} user_auth_token - Token from G1
 * @returns {Promise<Object>} User object
 */
export async function User(user_auth_token) {
  try {
    // Basic token validation
    if (!user_auth_token || typeof user_auth_token !== 'string') {
      throw new Error('Invalid user_auth_token format');
    }

    // Simple token format check (should start with 'g1_token_')
    if (!user_auth_token.startsWith('g1_token_')) {
      throw new Error('Invalid token format');
    }

    // Extract user ID from token for demo purposes
    const tokenParts = user_auth_token.split('_');
    const userId = tokenParts[2] || 'user123';
    
    // Return mock user data
    return {
      id: userId,
      email: `${userId}@example.com`,
      name: `User ${userId}`,
      token: user_auth_token
    };
  } catch (error) {
    throw new Error('Authentication failed: ' + error.message);
  }
}

/**
 * Simple middleware to extract and validate user_auth_token
 */
export function withAuth(handler) {
  return async (req, res) => {
    try {
      let user_auth_token;
      
      // Get token from URL path parameter
      if (req.query.user_auth_token) {
        user_auth_token = req.query.user_auth_token;
      }
      // Get token from Authorization header
      else if (req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
          user_auth_token = authHeader.substring(7);
        }
      }
      
      if (!user_auth_token) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'No user_auth_token provided'
        });
      }
      
      // Validate token and get user
      const user = await User(user_auth_token);
      
      // Attach user to request
      req.user = user;
      req.user_auth_token = user_auth_token;
      
      // Call the handler
      return handler(req, res);
      
    } catch (error) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: error.message
      });
    }
  };
}