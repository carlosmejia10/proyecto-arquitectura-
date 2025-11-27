// src/controllers/paquete.controller.js
import { PaqueteService } from '../services/paquete.service.js';

export const PaqueteController = {
  async crear(req, res) {
    try {
      const paquete = await PaqueteService.crear(req.body);
      return res.status(201).json(paquete);
    } catch (err) {
      console.error('Error creando paquete:', err);
      return res.status(400).json({ error: err.message || 'Error creando paquete' });
    }
  },

  async listar(req, res) {
    try {
      const paquetes = await PaqueteService.listar();
      return res.json(paquetes);
    } catch (err) {
      console.error('Error listando paquetes:', err);
      return res.status(500).json({ error: 'Error listando paquetes' });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const paquete = await PaqueteService.obtenerPorId(id);
      if (!paquete) {
        return res.status(404).json({ error: 'Paquete no encontrado' });
      }
      return res.json(paquete);
    } catch (err) {
      console.error('Error obteniendo paquete:', err);
      return res.status(500).json({ error: 'Error obteniendo paquete' });
    }
  }
};