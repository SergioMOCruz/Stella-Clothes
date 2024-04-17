const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/cart');
const { authenticateToken } = require('../middleware/authenticate');

// GET /cart
// Get all carts
router.get('/', authenticateToken, getAll);
// Get cart by id
router.get('/:id', authenticateToken, getById);

// POST /cart
// Create a new cart
router.post('/', authenticateToken, create);

// PUT /cart
// Update a cart
router.put('/:id', authenticateToken, update);

// DELETE /cart
// Delete a cart
router.delete('/:id', authenticateToken, remove);

module.exports = router;