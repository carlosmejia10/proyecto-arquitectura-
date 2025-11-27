import { Router } from 'express';
import { OrdenController } from '../controllers/orden.controller.js';
import { authRequired, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * =====================================================
 * 📌  RUTAS DE ORDENES (Solicitudes TVP)
 * =====================================================
 *
 * CLIENTE:
 *   - Crear una orden (solicitud de viáticos y pasajes)
 *
 * ADMIN:
 *   - Aprobar orden
 *   - Listar todas las órdenes
 *   - Ver una orden por ID
 *
 * Ambas requieren token JWT válido.
 */

// ---------------------------------------------
// CLIENTE CREA UNA ORDEN DE COMPRA (TVP)
// ---------------------------------------------
router.post(
  '/',
  authRequired,           // JWT obligatorio
  requireRole('CLIENTE'), // Solo CLIENTE puede enviar solicitudes
  OrdenController.crear
);

// ---------------------------------------------
// ADMIN APRUEBA UNA ORDEN EXISTENTE
// ---------------------------------------------
router.post(
  '/:id/aprobar',
  authRequired,
  requireRole('ADMIN'),
  OrdenController.aprobar
);

// ---------------------------------------------
// LISTAR TODAS LAS ORDENES (ADMIN)
// ---------------------------------------------
router.get(
  '/',
  authRequired,
  requireRole('ADMIN'),
  OrdenController.listar
);

// ---------------------------------------------
// OBTENER UNA ORDEN POR ID (ADMIN)
// ---------------------------------------------
router.get(
  '/:id',
  authRequired,
  requireRole('ADMIN'),
  OrdenController.obtenerPorId
);

export default router;