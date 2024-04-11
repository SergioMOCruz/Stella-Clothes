const express = require('express');
const router = express.Router();
const { login, getAll, getById, create, update, remove } = require('../controllers/client');
const { authenticateToken } = require('../middleware/authenticate');

// GET /client
// Get all clients
router.get('/', authenticateToken, getAll);
// Get client by id
router.get('/:id', authenticateToken, getById);
// Get client by token
router.get('/token', authenticateToken, (req, res) => {
  res.status(200).json(req.user);
});

// POST /client
// LOGIN /client/login
// Login an client
router.post('/login', login);
// REGISTER /client/register
// Create a new client
router.post('/register', create);

// PUT /client
// Update a client
router.put('/:id', authenticateToken, update);

// DELETE /client
// Delete a client
router.delete('/:id', authenticateToken, remove);

module.exports = router;
