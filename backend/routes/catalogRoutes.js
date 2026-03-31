const express = require('express');
const { listCategories } = require('../controllers/categoryController');
const { listProducts, getProductBySlug } = require('../controllers/productController');

const router = express.Router();

router.get('/categories', listCategories);
router.get('/products', listProducts);
router.get('/products/:slug', getProductBySlug);

module.exports = router;
