import { Router } from 'express';
import { TransaccionController } from '../controllers/transaccion.controller.js';
import { authRequired, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Ver todas → ADMIN
router.get('/', authRequired, requireRole('ADMIN'), TransaccionController.listar);

// Anular → ADMIN
router.post('/anular/:id', authRequired, requireRole('ADMIN'), TransaccionController.anular);

export default router;