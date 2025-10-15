import { Router } from 'express';
import { OrdenController } from '../controllers/orden.controller.js';

const router = Router();

router.get('/', OrdenController.listar);
router.post('/', OrdenController.crear);
router.put('/:id/aprobar', OrdenController.aprobar);

export default router;