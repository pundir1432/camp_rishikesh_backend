const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];  // Fixed: Split(' ')[1] for Bearer token
  if (!token) {
    return res.status(401).json({ message: 'Invalid Authorization header format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach decoded user to req
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Optional: Admin-only middleware (if role check needed)
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  });
};

module.exports = {
  verifyToken,
  verifyAdmin  // Export both for flexibility
};