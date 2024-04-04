const express = require('express');
const multer = require('multer');
const { authenticateUser } = require('../middleware/authenticate');
const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require('../controllers/product');
const router = express.Router();
const upload = multer({ dest: 'clothing/' });

// GET /service
// Get all services
router.get('/', authenticateUser, getAll);
// Get service by id
router.get('/:id', authenticateUser, getById);

// POST /service
// Create a new service
router.post('/', authenticateUser, upload.single('image'), create);

// PUT /service
// Update a service
router.put('/:id', authenticateUser, upload.single('image'), update);

// DELETE /service
// Delete a service
router.delete('/:id', authenticateUser, remove);

module.exports = router;
