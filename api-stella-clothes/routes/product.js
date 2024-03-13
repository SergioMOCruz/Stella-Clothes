const express = require('express');
const router = express.Router();
const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require('../controllers/product');
const { authenticateUser } = require('../middleware/authenticate');

// GET /service
// Get all services
router.get('/', authenticateUser, getAll);
// Get service by id
router.get('/:id', authenticateUser, getById);

// POST /service
// Create a new service
router.post('/', authenticateUser, create);

// PUT /service
// Update a service
router.put('/:id', authenticateUser, update);

// DELETE /service
// Delete a service
router.delete('/:id', authenticateUser, remove);

module.exports = router;
