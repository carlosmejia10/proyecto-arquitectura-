// src/routes/clientes.routes.js
import { Router } from 'express';
import { ClienteController } from '../controllers/cliente.controller.js';
import { authRequired, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * Crear cliente
 * Solo ADMIN puede crear clientes
 */
router.post(
  '/',
  authRequired,
  requireRole('ADMIN'),
  ClienteController.crear
);

/**
 * Listar todos los clientes
 * Puede verlo ADMIN (si quieres, podrías dejar también CLIENTE)
 */
router.get(
  '/',
  authRequired,
  requireRole('ADMIN'),
  ClienteController.listar
);

/**
 * Consultar cliente por cédula
 * ADMIN puede consultar cualquier cliente
 */
router.get(
  '/:cedula',
  authRequired,
  requireRole('ADMIN'),
  ClienteController.obtenerPorCedula
);

export default router;