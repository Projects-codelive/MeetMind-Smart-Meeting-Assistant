const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const clerkId = req.headers['x-clerk-user-id'];
  const token = req.headers['authorization']?.replace('Bearer ', '');
  
  if (clerkId) {
    req.clerkId = clerkId;
    return next();
  }
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');
      req.userId = decoded.id;
      req.email = decoded.email;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
  
  return res.status(401).json({ error: 'Unauthorized' });
};

module.exports = authMiddleware;