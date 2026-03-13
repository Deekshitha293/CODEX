const express = require('express');
const { queryAssistant } = require('../controllers/aiController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/query', verifyToken, queryAssistant);

module.exports = router;
