const express = require('express');
const router = express.Router();
const { getAll, create, update, remove } = require('../controllers/category');
const { authenticateToken } = require('../middleware/authenticate');

// GET /category
// Get all categories
router.get('/', authenticateToken, getAll);

// POST /category
// Create a new category
router.post('/', authenticateToken, create);

// PUT /category
// Update a category
router.put('/:id', authenticateToken, update);

// DELETE /category
// Delete a category
router.delete('/:id', authenticateToken, remove);

module.exports = router;
