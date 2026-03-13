const express = require('express');
const {
  todaySales,
  topProduct,
  demand,
  inventorySummary,
  reorderRecommendations,
  expiryDiscounts,
  weeklySales,
  customerInsights,
  forecast,
  businessScore,
  adminSummary
} = require('../controllers/analyticsController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/today-sales', verifyToken, todaySales);
router.get('/top-product', verifyToken, topProduct);
router.get('/demand', verifyToken, demand);
router.get('/inventory-summary', verifyToken, inventorySummary);
router.get('/reorder-recommendations', verifyToken, reorderRecommendations);
router.get('/expiry-discounts', verifyToken, expiryDiscounts);
router.get('/weekly-sales', verifyToken, weeklySales);
router.get('/customer-insights', verifyToken, customerInsights);
router.get('/forecast', verifyToken, forecast);
router.get('/business-score', verifyToken, businessScore);
router.get('/admin-summary', verifyToken, adminSummary);

module.exports = router;
