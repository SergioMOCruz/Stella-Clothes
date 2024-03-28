var admin = require('firebase-admin');

// Middleware to verify Firebase ID token
const authenticateUser = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = { authenticateUser };