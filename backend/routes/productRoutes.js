const express = require('express');
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  expiryAlerts
} = require('../controllers/productController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', verifyToken, getProducts);
router.post('/', verifyToken, createProduct);
router.get('/expiry-alerts', verifyToken, expiryAlerts);
router.put('/:id', verifyToken, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

module.exports = router;
