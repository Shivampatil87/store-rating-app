const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');


const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Bearer token

  if (!token) {
    return res.status(403).json({ message: 'Access Denied: No Token Provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid Token' });
    }
    req.user = decoded;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
};

const isStoreOwner = (req, res, next) => {
  if (req.user.role !== 'owner') {
    return res.status(403).json({ message: 'Forbidden: Store owners only' });
  }
  next();
};

const isUser = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'Forbidden: Users only' });
  }
  next();
};

module.exports = { verifyToken, isAdmin, isStoreOwner, isUser };
