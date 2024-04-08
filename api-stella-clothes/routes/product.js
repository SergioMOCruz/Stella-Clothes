const express = require('express');
const multer = require('multer');
const { authenticateToken } = require('../middleware/authenticate');
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
router.get('/', authenticateToken, getAll);
// Get service by id
router.get('/:id', authenticateToken, getById);

// POST /service
// Create a new service
router.post('/', authenticateToken, upload.single('image'), create);

// PUT /service
// Update a service
router.put('/:id', authenticateToken, upload.single('image'), update);

// DELETE /service
// Delete a service
router.delete('/:id', authenticateToken, remove);

module.exports = router;
