// ./middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');


const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = decoded.user  // Assuming your token payload has a 'user' property

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('Not authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});


const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {  // Assuming your user object has a 'role' property
      return res.status(403).json({ message: 'Forbidden' }); // 403 for forbidden
    }
    next();
  };
};


module.exports = { protect, authorize };
