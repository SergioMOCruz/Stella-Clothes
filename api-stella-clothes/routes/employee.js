const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/employee');
const { authenticateToken } = require('../middleware/authenticate');

// GET /employee
// Get all employees
router.get('/', authenticateToken, getAll);
// Get employee by id
router.get('/:id', authenticateToken, getById);

// POST /employee
// Create a new employee
router.post('/', authenticateToken, create);

// PUT /employee
// Update a employee
router.put('/:id', authenticateToken, update);

// DELETE /employee
// Delete a employee
router.delete('/:id', authenticateToken, remove);

module.exports = router;