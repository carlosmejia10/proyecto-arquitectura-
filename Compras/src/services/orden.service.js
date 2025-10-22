// src/services/orden.service.js
import { OrdenRepository } from '../repositories/orden.repository.js';
import { publishEvent } from '../lib/amqp.js';

function buildEventData(orden, extra = {}) {
  return {
    id: orden.id,
    solicitudId: orden.solicitudId,
    descripcion: orden.descripcion,
    monto: orden.monto,
    moneda: extra.moneda || 'COP',
    estado: orden.estado,
    aprobador: orden.aprobador ?? null,
    createdAt: orden.createdAt,
    updatedAt: orden.updatedAt,
    // datos para correo (no se persisten por defecto):
    destinatario: extra.destinatario,
    nombre: extra.nombre,
    // trazabilidad
    traceId: extra.traceId || null
  };
}

/**
 * Helper: normaliza la respuesta al cliente
 */
function toResponse(orden) {
  return {
    id: orden.id,
    solicitudId: orden.solicitudId,
    descripcion: orden.descripcion,
    monto: orden.monto,
    estado: orden.estado,
    aprobador: orden.aprobador ?? null,
    createdAt: orden.createdAt,
    updatedAt: orden.updatedAt
  };
}

export const OrdenService = {
  /**
   * Crea una orden en estado PENDIENTE y publica evento 'compras.orden.creada'
   * @param {{ solicitudId:string, descripcion:string, monto:number, destinatario?:string, nombre?:string, moneda?:string, traceId?:string }} dto
   */
  async crearOrden(dto) {
    // Persistimos solo lo necesario en la tabla
    const orden = await OrdenRepository.create({
      solicitudId: dto.solicitudId,
      descripcion: dto.descripcion,
      monto: dto.monto
      // estado se setea por defecto a PENDIENTE vía Prisma/enum (si lo tienes así)
    });

    // Publicar evento con datos para Mailer
    const eventData = buildEventData(orden, {
      destinatario: dto.destinatario,
      nombre: dto.nombre,
      moneda: dto.moneda,
      traceId: dto.traceId
    });
    publishEvent('compras.orden.creada', eventData);

    return toResponse(orden);
  },

  /**
   * Aprueba una orden existente y publica 'compras.orden.aprobada'
   * @param {string} id
   * @param {string} aprobador
   * @param {{ destinatario?:string, nombre?:string, moneda?:string, traceId?:string }} extra
   */
  async aprobarOrden(id, aprobador, extra = {}) {
    // Traemos la orden para validar estado
    const existente = await OrdenRepository.findById(id);
    if (!existente) {
      const err = new Error('Orden no encontrada');
      err.status = 404;
      throw err;
    }
    if (existente.estado === 'APROBADA') {
      return toResponse(existente);
    }
    if (existente.estado === 'RECHAZADA') {
      const err = new Error('La orden está RECHAZADA y no puede aprobarse');
      err.status = 409;
      throw err;
    }

    const orden = await OrdenRepository.update(id, {
      estado: 'APROBADA',
      aprobador
    });

    const eventData = buildEventData(orden, {
      destinatario: extra.destinatario,
      nombre: extra.nombre,
      moneda: extra.moneda,
      traceId: extra.traceId
    });
    publishEvent('compras.orden.aprobada', eventData);

    return toResponse(orden);
  },

  async listar() {
    const items = await OrdenRepository.findAll();
    return items.map(toResponse);
  }
};