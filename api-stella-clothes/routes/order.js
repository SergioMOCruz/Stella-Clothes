const express = require('express');
const router = express.Router();
const { getAll, getById, verifyOrder, getByAccount, create, update, remove } = require('../controllers/order');
const { authenticateToken } = require('../middleware/authenticate');

// GET /order
// Get all orders
router.get('/', authenticateToken, getAll);
// Get order by account id
router.get('/account', authenticateToken, getByAccount);
// Verify if order belongs to account
router.get('/verify-orders/:id', authenticateToken, verifyOrder);
// Get order by id
router.get('/:id', authenticateToken, getById);

// POST /order
// Create a new order
router.post('/', authenticateToken, create);

// PUT /order
// Update a order
router.put('/:id', authenticateToken, update);

// DELETE /order
// Delete a order
router.delete('/:id', authenticateToken, remove);

module.exports = router;