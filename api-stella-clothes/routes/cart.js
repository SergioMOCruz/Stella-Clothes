const express = require('express');
const router = express.Router();
const { getCartByClientId, getCartByClientIdOrganized, create, updateQuantityInCart, removeItemfromCart } = require('../controllers/cart');
const { authenticateToken } = require('../middleware/authenticate');

// GET /cart
// Get cart by client id
router.get('/', authenticateToken, getCartByClientId);
router.get('/organized', authenticateToken, getCartByClientIdOrganized);

// POST /cart
// Create a new cart
router.post('/', authenticateToken, create);

// PUT /cart
// Update a cart by client id
router.put('/', authenticateToken, updateQuantityInCart);

// DELETE /cart
// Delete a cart
router.delete('/', authenticateToken, removeItemfromCart);

module.exports = router;