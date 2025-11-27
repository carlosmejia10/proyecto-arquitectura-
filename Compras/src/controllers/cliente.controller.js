// src/controllers/cliente.controller.js
import { ClienteService } from '../services/cliente.service.js';

export const ClienteController = {
  async crear(req, res) {
    try {
      const cliente = await ClienteService.crear(req.body);
      return res.status(201).json(cliente);
    } catch (err) {
      console.error('Error creando cliente:', err);
      return res.status(400).json({ error: err.message || 'Error creando cliente' });
    }
  },

  async listar(req, res) {
    try {
      const clientes = await ClienteService.listar();
      return res.json(clientes);
    } catch (err) {
      console.error('Error listando clientes:', err);
      return res.status(500).json({ error: 'Error listando clientes' });
    }
  },

  async obtenerPorCedula(req, res) {
    try {
      const { cedula } = req.params;
      const cliente = await ClienteService.obtenerPorCedula(cedula);

      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      return res.json(cliente);
    } catch (err) {
      console.error('Error consultando cliente:', err);
      return res.status(500).json({ error: 'Error consultando cliente' });
    }
  }
};