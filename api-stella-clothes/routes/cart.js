const express = require('express');
const router = express.Router();
const { getCartByClientId, create, update, remove } = require('../controllers/cart');
const { authenticateToken } = require('../middleware/authenticate');

// GET /cart

// Get cart by client id
router.get('/', authenticateToken, getCartByClientId);

// POST /cart
// Create a new cart
router.post('/', authenticateToken, create);

// PUT /cart
// Update a cart by client id
router.put('/', authenticateToken, update);

// DELETE /cart
// Delete a cart
router.delete('/', authenticateToken, remove);

module.exports = router;