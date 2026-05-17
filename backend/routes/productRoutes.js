const express = require('express');
const router  = express.Router();
const {
  getProducts, getProductById, createProduct, updateProduct, deleteProduct,
} = require('../controllers/productController');
const { protect }   = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/',      getProducts);
router.get('/:id',   getProductById);

// Admin-only: create/update/delete products
// Images are passed as comma-separated URLs in req.body.images (no file upload needed)
router.post('/',         protect, adminOnly, createProduct);
router.put('/:id',       protect, adminOnly, updateProduct);
router.delete('/:id',    protect, adminOnly, deleteProduct);

module.exports = router;
