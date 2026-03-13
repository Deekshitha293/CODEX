const express = require('express');
const { createInvoice, getInvoices } = require('../controllers/invoiceController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/', verifyToken, createInvoice);
router.get('/', verifyToken, getInvoices);

module.exports = router;
