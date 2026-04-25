const authMiddleware = (req, res, next) => {
  const clerkId = req.headers['x-clerk-user-id'];
  
  if (!clerkId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  req.clerkId = clerkId;
  next();
};

module.exports = authMiddleware;