const express = require('express');
const multer = require('multer');
const { authenticateToken } = require('../middleware/authenticate');
const {
  getAll,
  getById,
  getByRef,
  getStock,
  getLastFour,
  create,
  update,
  remove,
} = require('../controllers/product');
const router = express.Router();
const upload = multer({ dest: 'clothing/' });

// GET /product
// Get all products
router.get('/', authenticateToken, getAll);
// Get product by id
router.get('/:id', authenticateToken, getById);
// Get product by reference
router.get('/ref/:ref', authenticateToken, getByRef);
// Get product stock by ref and size
router.get('/stock', authenticateToken, getStock);
// Get the last 4 products added
router.get('/lastFour', authenticateToken, getLastFour);


// POST /product
// Create a new product
router.post('/', authenticateToken, upload.single('image'), create);

// PUT /product
// Update a product
router.put('/:id', authenticateToken, upload.single('image'), update);

// DELETE /product
// Delete a product
router.delete('/:id', authenticateToken, remove);

module.exports = router;
