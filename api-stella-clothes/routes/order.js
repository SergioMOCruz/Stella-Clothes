const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/order');
const { authenticateUser } = require('../middleware/authenticate');

// GET /order
// Get all orders
router.get('/', authenticateUser, getAll);
// Get order by id
router.get('/:id', authenticateUser, getById);

// POST /order
// Create a new order
router.post('/', authenticateUser, create);

// PUT /order
// Update a order
router.put('/:id', authenticateUser, update);

// DELETE /order
// Delete a order
router.delete('/:id', authenticateUser, remove);

module.exports = router;