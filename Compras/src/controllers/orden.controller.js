import { OrdenService } from '../services/orden.service.js';

export const OrdenController = {
  async crear(req, res) {
    const orden = await OrdenService.crearOrden(req.body);
    res.status(201).json(orden);
  },

  async aprobar(req, res) {
    const { id } = req.params;
    const { aprobador } = req.body;
    const orden = await OrdenService.aprobarOrden(id, aprobador);
    res.json(orden);
  },

  async listar(req, res) {
    const data = await OrdenService.listar();
    res.json(data);
  }
};