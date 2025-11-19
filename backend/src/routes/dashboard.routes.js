const express = require("express");
const router = express.Router();

// Correct controller import
const {
  getDashboardSummary,
  getRecentFeedback,
  getFeedbackByCategory
} = require("../controllers/dashboard.controller");
const auth = require('../middleware/auth.middleware');


// Protected dashboard routes
router.get('/summary', auth, getDashboardSummary);
router.get('/recent', auth, getRecentFeedback);
router.get('/categories', auth, getFeedbackByCategory);

module.exports = router;