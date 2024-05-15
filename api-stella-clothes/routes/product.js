const express = require('express');
const multer = require('multer');
const { authenticateToken } = require('../middleware/authenticate');
const {
  getAll,
  getById,
  getByRef,
  getAllbyRef,
  getByCategory,
  getStock,
  getLastFour,
  searchProducts,
  create,
  uploadImage,
  update,
  updateStock,
  remove,
  removeAllByRef,
} = require('../controllers/product');
const router = express.Router();
const upload = multer();

// GET /product
// Get product stock by reference and size
router.get('/stock', authenticateToken, getStock);
// Get the last 4 products added
router.get('/lastFour', getLastFour);
// Get products by name
router.get('/search', authenticateToken, searchProducts);
// Get all products
router.get('/', authenticateToken, getAll);
// Get product by reference with dash
router.get('/allByReference', getAllbyRef);
// Get product by id
router.get('/:id', authenticateToken, getById);
// Get product by reference
router.get('/reference/:reference', getByRef);
// Get product by category
router.get('/category/:category', getByCategory);


// POST /product
// Create a new product
router.post('/', authenticateToken, upload.single('image'), create);

// PUT /product
// Update stock of a product by reference
router.put('/stock', authenticateToken, updateStock);
// Update a product
router.put('/:id', authenticateToken, upload.single('image'), update);
// Upload an image
router.put('/upload/:id', authenticateToken, upload.single('image'), uploadImage);

// DELETE /product
// Delete a product
router.delete('/:id', authenticateToken, remove);
// Delete all products with the same reference
router.delete('/reference/:reference', authenticateToken, removeAllByRef);

module.exports = router;
