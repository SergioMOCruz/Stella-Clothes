require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Client = require('../models/client');

// Middleware to authenticate user using JWT token.
const authenticateToken = (req, res, next) => {
  // Extract the JWT token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401);
  }

  // Get the JWT secret from the environment variables
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT secret is not provided');
    return res.sendStatus(500);
  }

  // Verify the token
  jwt.verify(token, jwtSecret, async (err, user) => {
    if (err) {
      console.error('JWT Verification Error:', err);
      return res.sendStatus(403);
    }

    // If token is valid, retrieve user from database
    try {
      const userData = await Client.findById(user.id)
      if (!userData) {
        return res.sendStatus(404);
      }
      // Store user information in the request object for further processing
      req.user = userData;
      next();
    } catch (err) {
      console.error('Error finding user:', err);
      return res.sendStatus(500);
    }
  });
};

// Hash a password
const hashPassword = async (password) => {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Password hashing failed');
  }
};

module.exports = { authenticateToken, hashPassword };
