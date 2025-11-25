// src/controllers/transaccion.controller.js
import { TransaccionService } from '../services/transaccion.service.js';

export const TransaccionController = {
  async listar(req, res) {
    try {
      const transacciones = await TransaccionService.listar();
      return res.json(transacciones);
    } catch (err) {
      console.error('Error listando transacciones:', err);
      return res.status(500).json({ error: 'Error listando transacciones' });
    }
  },

  async anular(req, res) {
    try {
      const { id } = req.params;
      const transaccion = await TransaccionService.anular(id);
      return res.json({
        message: 'Transacción anulada exitosamente',
        transaccion
      });
    } catch (err) {
      console.error('Error anulando transacción:', err);
      return res.status(400).json({ error: err.message || 'Error anulando transacción' });
    }
  }
};