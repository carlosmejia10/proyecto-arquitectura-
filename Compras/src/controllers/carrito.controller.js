// src/controllers/carrito.controller.js
import { CarritoService } from '../services/carrito.service.js';

export const CarritoController = {
  async agregar(req, res) {
    try {
      const { cedulaCliente, paqueteId, cantidad } = req.body;
      const item = await CarritoService.agregar({ cedulaCliente, paqueteId, cantidad });
      return res.status(201).json({
        message: 'Paquete agregado al carrito',
        item
      });
    } catch (err) {
      console.error('Error agregando al carrito:', err);
      return res.status(400).json({ error: err.message || 'Error agregando al carrito' });
    }
  },

  async ver(req, res) {
    try {
      const { cedulaCliente } = req.query; // o desde token
      const carrito = await CarritoService.ver(cedulaCliente);
      return res.json(carrito);
    } catch (err) {
      console.error('Error consultando carrito:', err);
      return res.status(500).json({ error: 'Error consultando carrito' });
    }
  },

  async pagar(req, res) {
    try {
      const { cedulaCliente, numeroTarjeta } = req.body;
      const result = await CarritoService.pagar({ cedulaCliente, numeroTarjeta });
      return res.json(result);
    } catch (err) {
      console.error('Error pagando carrito:', err);
      return res.status(400).json({ error: err.message || 'Error pagando carrito' });
    }
  }
};