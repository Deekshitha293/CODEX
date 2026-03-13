import { Router } from 'express';
import { login, register } from '../controllers/authController.js';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 */
router.post('/register', register);
router.post('/login', login);

export default router;
