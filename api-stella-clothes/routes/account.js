const express = require('express');
const router = express.Router();
const { login, getAll, getById, verifyToken, create, resetPassword, createAdmin, update, updatePasswordToken, remove } = require('../controllers/account');
const { authenticateToken } = require('../middleware/authenticate');

// GET /account
// Get account by token
router.get('/token', authenticateToken, (req, res) => {
  res.status(200).json(req.user);
});
// Get all accounts
router.get('/', authenticateToken, getAll);
// Get account by id
router.get('/:id', authenticateToken, getById);
// Verify a password reset token
router.get('/:token/verify-token', verifyToken);

// POST /account
// LOGIN /account/login
// Login an account
router.post('/login', login);
// REGISTER /account/register
// Create a new account
router.post('/register', create);
// Reset an account password
router.post('/reset-pw', resetPassword);
// TODO: Remove this route in production
router.post('/create', createAdmin);

// PUT /account
// Update a account
router.put('/:id', authenticateToken, update);
// Update an account password with a token
router.put('/:token/update-pw', updatePasswordToken);

// DELETE /account
// Delete a account
router.delete('/:id', authenticateToken, remove);

module.exports = router;
