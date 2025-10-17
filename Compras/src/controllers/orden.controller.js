import { OrdenService } from '../services/orden.service.js';
import { CrearOrdenDTO, AprobarOrdenDTO } from '../Dtos/orden.dto.js';

export const OrdenController = {
  async crear(req, res) {
    const dto = new CrearOrdenDTO(req.body); // valida y normaliza datos
    const orden = await OrdenService.crearOrden(dto);
    res.status(201).json(orden);
  },

  async aprobar(req, res) {
    const { id } = req.params;
    const dto = new AprobarOrdenDTO(req.body);
    const orden = await OrdenService.aprobarOrden(id, dto.aprobador);
    res.json(orden);
  },

  async listar(_, res) {
    const data = await OrdenService.listar();
    res.json(data);
  }
};