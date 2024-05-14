const express = require('express');
const router = express.Router();
const { login, getAll, getById, create, update, remove } = require('../controllers/account');
const { authenticateAccount } = require('../middleware/authenticate');

// GET /account
// Get account by token
router.get('/token', authenticateAccount, (req, res) => {
  res.status(200).json(req.user);
});
// Get all accounts
router.get('/', authenticateAccount, getAll);
// Get account by id
router.get('/:id', authenticateAccount, getById);

// POST /account
// LOGIN /account/login
// Login an account
router.post('/login', login);
// REGISTER /account/register
// Create a new account
router.post('/create', authenticateAccount, create);

// PUT /account
// Update a account
router.put('/:id', authenticateAccount, update);

// DELETE /account
// Delete a account
router.delete('/:id', authenticateAccount, remove);

module.exports = router;
