import { Router } from 'express';
import { PaqueteController } from '../controllers/paquete.controller.js';
import { authRequired, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Solo ADMIN puede crear paquetes
router.post('/', authRequired, requireRole('ADMIN'), PaqueteController.crear);

// ADMIN y CLIENTE pueden consultar
router.get('/', authRequired, PaqueteController.listar);

export default router;