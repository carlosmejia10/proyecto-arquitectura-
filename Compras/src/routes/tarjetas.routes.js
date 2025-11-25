import { Router } from 'express';
import { TarjetaController } from '../controllers/tarjeta.controller.js';
import { authRequired, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Crear tarjeta → solo ADMIN
router.post('/', authRequired, requireRole('ADMIN'), TarjetaController.crear);

// Recargar tarjeta → solo ADMIN
router.post('/recarga', authRequired, requireRole('ADMIN'), TarjetaController.recargar);

// Consultar tarjetas → solo ADMIN (o podrías permitir cliente si quieres solo suyas)
router.get('/:numero', authRequired, requireRole('ADMIN'), TarjetaController.obtenerPorNumero);

export default router;