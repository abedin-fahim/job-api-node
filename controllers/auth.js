const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
// const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  // Replacing the following code with built-in pre middleware in the User model
  // const { name, email, password } = req.body;

  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);
  // // const hashedPassword = await bcrypt.hash(password, 8);
  // const hashedUser = { name, email, password: hashedPassword };

  const user = await User.create({ ...req.body });

  // Each mongoose schema we create has the access to instance method in which we can attach functions when we create one.
  // We can create that token over in the model, resulting in a cleaner controller

  // const token = jwt.sign({ userId: user._id, name: user.name,
  //   }, 'jwt_secret',{ expiresIn: '1d',}
  // );

  return (
    res
      .status(StatusCodes.CREATED)
      // That's how we can access the instance method
      .json({ user: { name: user.name }, token: user.getToken() })
  );
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Please provide the correct email and password' });
  }
  const user = await User.findOne({ email });

  if (!user) {
    // return res
    //   .status(StatusCodes.UNAUTHORIZED)
    //   .json({ msg: 'Invalid credentials!' });
    throw new UnauthenticatedError('Invalid credentials');
  }

  // Compare password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: 'Invalid credentials!' });
  }

  return res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name }, token: user.getToken() });
};

module.exports = {
  register,
  login,
};
