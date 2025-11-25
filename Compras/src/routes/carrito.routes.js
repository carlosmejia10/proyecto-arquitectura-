import { Router } from 'express';
import { CarritoController } from '../controllers/carrito.controller.js';
import { authRequired, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Agregar al carrito → CLIENTE
router.post('/', authRequired, requireRole('CLIENTE'), CarritoController.agregar);

// Pagar carrito → CLIENTE
router.post('/pagar', authRequired, requireRole('CLIENTE'), CarritoController.pagar);

// Ver carrito → CLIENTE
router.get('/', authRequired, requireRole('CLIENTE'), CarritoController.ver);

export default router;