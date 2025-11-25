// src/routes/auth.routes.js
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

const router = Router();

// POST /auth/login
router.post('/login', AuthController.login);

export default router;