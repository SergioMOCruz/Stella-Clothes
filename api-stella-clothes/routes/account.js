const express = require('express');
const router = express.Router();
const { login, getAll, getById, create, createAdmin, update, remove } = require('../controllers/account');
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

// POST /account
// LOGIN /account/login
// Login an account
router.post('/login', login);
// REGISTER /account/register
// Create a new account
router.post('/register', create);
// TODO: Remove this route in production
router.post('/create', createAdmin);

// PUT /account
// Update a account
router.put('/:id', authenticateToken, update);

// DELETE /account
// Delete a account
router.delete('/:id', authenticateToken, remove);

module.exports = router;
