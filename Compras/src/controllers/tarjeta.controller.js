// src/controllers/tarjeta.controller.js
import { TarjetaService } from '../services/tarjeta.service.js';

export const TarjetaController = {
  async crear(req, res) {
    try {
      const tarjeta = await TarjetaService.crear(req.body);
      return res.status(201).json(tarjeta);
    } catch (err) {
      console.error('Error creando tarjeta:', err);
      return res.status(400).json({ error: err.message || 'Error creando tarjeta' });
    }
  },

  async recargar(req, res) {
    try {
      const { numeroTarjeta, monto } = req.body;
      const tarjeta = await TarjetaService.recargar({ numeroTarjeta, monto });
      return res.json({
        message: 'Recarga realizada exitosamente',
        tarjeta
      });
    } catch (err) {
      console.error('Error recargando tarjeta:', err);
      return res.status(400).json({ error: err.message || 'Error recargando tarjeta' });
    }
  },

  async obtenerPorNumero(req, res) {
    try {
      const { numero } = req.params;
      const tarjeta = await TarjetaService.obtenerPorNumero(numero);
      if (!tarjeta) {
        return res.status(404).json({ error: 'Tarjeta no encontrada' });
      }
      return res.json(tarjeta);
    } catch (err) {
      console.error('Error consultando tarjeta:', err);
      return res.status(500).json({ error: 'Error consultando tarjeta' });
    }
  }
};