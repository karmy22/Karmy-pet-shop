const express = require('express');
const { createOrder, listMyOrders } = require('../controllers/orderController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);
router.get('/', listMyOrders);
router.post('/', createOrder);

module.exports = router;
