import { Router } from 'express';
import { predictDemand } from '../controllers/predictController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', authMiddleware, predictDemand);

export default router;
