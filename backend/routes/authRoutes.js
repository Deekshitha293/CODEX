const express = require('express');
const { login, register, profile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, profile);

module.exports = router;
