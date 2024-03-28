const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/employee');
const { authenticateUser } = require('../middleware/authenticate');

// GET /employee
// Get all employees
router.get('/', authenticateUser, getAll);
// Get employee by id
router.get('/:id', authenticateUser, getById);

// POST /employee
// Create a new employee
router.post('/', authenticateUser, create);

// PUT /employee
// Update a employee
router.put('/:id', authenticateUser, update);

// DELETE /employee
// Delete a employee
router.delete('/:id', authenticateUser, remove);

module.exports = router;