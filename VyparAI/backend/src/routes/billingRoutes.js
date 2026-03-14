import { Router } from 'express';
import { createBill, listBills } from '../controllers/billingController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);
router.route('/').get(listBills).post(createBill);

export default router;
