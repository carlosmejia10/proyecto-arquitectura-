import { OrdenRepository } from '../repositories/orden.repository.js';
import { publishEvent } from '../lib/amqp.js';

export const OrdenService = {
  async crearOrden(dto) {
    const orden = await OrdenRepository.create({
      solicitudId: dto.solicitudId,
      descripcion: dto.descripcion,
      monto: dto.monto
    });

    publishEvent('compras.orden.creada', orden);
    return orden;
  },

  async aprobarOrden(id, aprobador) {
    const orden = await OrdenRepository.update(id, {
      estado: 'APROBADA',
      aprobador
    });

    publishEvent('compras.orden.aprobada', orden);
    return orden;
  },

  async listar() {
    return OrdenRepository.findAll();
  }
};