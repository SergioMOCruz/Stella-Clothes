require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Account = require('../models/account');

// Middleware to authenticate user using JWT token.
const authenticateToken = (req, res, next) => {
  // Extract the JWT token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1];
  if (token == null) {
    return res.status(401).json({ message: 'O token não foi enviado!' });
  }

  // Get the JWT secret from the environment variables
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({ message: 'O JWT secret não foi enviado!' });
  }

  // Verify the token
  jwt.verify(token, jwtSecret, async (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Existiu um erro na verificação do token:' + err });
    }

    // If token is valid, retrieve user from database
    try {
      const userData = await Account.findById(user.id);
      if (!userData) {
        return res.sendStatus(404);
      }
      // Store user information in the request object for further processing
      req.user = userData;
      next();
    } catch (err) {
      return res.status(500).json({ message: 'Error finding user:' + err });
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
