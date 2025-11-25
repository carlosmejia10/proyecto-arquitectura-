// src/services/transaccion.service.js
import { TransaccionRepository } from '../repositories/transaccion.repository.js';
import { TarjetaService } from './tarjeta.service.js';
import { publishEvent } from '../lib/amqp.js';

export const TransaccionService = {
  async crear({ cedulaCliente, numeroTarjeta, total, estado, items }) {
    // Crea transacción y sus items
    return TransaccionRepository.create({
      cedulaCliente,
      numeroTarjeta,
      total,
      estado,
      items
    });
  },

  async listar() {
    return TransaccionRepository.findAll();
  },

  async obtenerPorId(id) {
    return TransaccionRepository.findById(id);
  },

  async anular(id) {
    const transaccion = await TransaccionRepository.findById(id);
    if (!transaccion) {
      throw new Error('Transacción no encontrada');
    }

    if (transaccion.estado !== 'EXITOSA') {
      throw new Error('Solo se pueden anular transacciones exitosas');
    }

    // Reembolsar a la tarjeta
    await TarjetaService.acreditar(transaccion.numeroTarjeta, transaccion.total);

    const transaccionActualizada = await TransaccionRepository.updateEstado(id, 'ANULADA');

    const eventData = {
      solicitudId: transaccionActualizada.id,
      descripcion: 'Transacción anulada',
      monto: transaccionActualizada.total,
      estado: 'ANULADA',
      // nombre, destinatario si los tienes
    };

    publishEvent('compras.transaccion.anulada', eventData);

    return transaccionActualizada;
  }
};