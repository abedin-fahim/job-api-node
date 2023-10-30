const { StatusCodes } = require('http-status-codes');
// const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: 'Not authorized to access the data' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, name } = payload;
    req.user = {
      userId,
      name,
    };
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: 'Not authorized to access the data' });
  }
};

module.exports = authMiddleware;
