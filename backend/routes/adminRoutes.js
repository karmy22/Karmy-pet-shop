const express = require('express');
const {
  createCategory,
  updateCategory,
  deleteCategory,
  listCategories,
  toggleCategoryVisibility,
  createProduct,
  updateProduct,
  deleteProduct,
  listProducts,
  toggleProductVisibility,
  listOrders,
  updateOrderStatus,
  updateShipmentDetails,
} = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);
router.get('/categories', listCategories);
router.patch('/categories/:id/visibility', toggleCategoryVisibility);

router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/products', listProducts);
router.patch('/products/:id/visibility', toggleProductVisibility);

router.get('/orders', listOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.patch('/orders/:id/shipment', updateShipmentDetails);

module.exports = router;
