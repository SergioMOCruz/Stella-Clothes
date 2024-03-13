const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/client');
const { authenticateUser } = require('../middleware/authenticate');

// GET /client
// Get all clients
router.get('/', authenticateUser, getAll);
// Get client by id
router.get('/:id', authenticateUser, getById);

// POST /client
// Create a new client
router.post('/', authenticateUser, create);

// PUT /client
// Update a client
router.put('/:id', authenticateUser, update);

// DELETE /client
// Delete a client
router.delete('/:id', authenticateUser, remove);

module.exports = router;