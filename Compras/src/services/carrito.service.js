// src/services/carrito.service.js
import { CarritoRepository } from '../repositories/carrito.repository.js';
import { PaqueteRepository } from '../repositories/paquete.repository.js';
import { TarjetaService } from './tarjeta.service.js';
import { TransaccionService } from './transaccion.service.js';
import { publishEvent } from '../lib/amqp.js';

export const CarritoService = {
  async agregar({ cedulaCliente, paqueteId, cantidad }) {
    // podrías validar que el paquete exista
    const paquete = await PaqueteRepository.findById(paqueteId);
    if (!paquete) {
      throw new Error('Paquete no existe');
    }

    return CarritoRepository.addItem({
      cedulaCliente,
      paqueteId,
      cantidad
    });
  },

  async ver(cedulaCliente) {
    return CarritoRepository.findByCliente(cedulaCliente);
  },

  async pagar({ cedulaCliente, numeroTarjeta }) {
    // 1. Obtener items del carrito
    const items = await CarritoRepository.findByCliente(cedulaCliente);
    if (!items || items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    // 2. Calcular total
    let total = 0;
    const detalle = [];
    for (const item of items) {
      const paquete = await PaqueteRepository.findById(item.paqueteId);
      if (!paquete) continue;

      const subtotal = paquete.precio * item.cantidad;
      total += subtotal;
      detalle.push({
        paqueteId: paquete.id,
        nombrePaquete: paquete.nombre,
        cantidad: item.cantidad,
        precioUnitario: paquete.precio,
        subtotal
      });
    }

    // 3. Consultar tarjeta
    const tarjeta = await TarjetaService.obtenerPorNumero(numeroTarjeta);
    if (!tarjeta) {
      throw new Error('Tarjeta no encontrada');
    }

    // 4. Validar saldo
    let estado = 'EXITOSA';
    if (tarjeta.saldo < total) {
      estado = 'RECHAZADA';
    }

    // 5. Crear transacción (EXITOSA o RECHAZADA)
    const transaccion = await TransaccionService.crear({
      cedulaCliente,
      numeroTarjeta,
      total,
      estado,
      items: detalle
    });

    // 6. Si exitosa → debitar saldo, limpiar carrito
    if (estado === 'EXITOSA') {
      await TarjetaService.debitar(numeroTarjeta, total);
      await CarritoRepository.clearByCliente(cedulaCliente);

      const eventData = {
        solicitudId: transaccion.id, // o si tienes solicitudId
        descripcion: 'Pago de carrito',
        monto: total,
        moneda: 'USD', // o COP, según tu modelo
        estado,
        nombre: transaccion.nombreCliente,
        destinatario: transaccion.emailCliente
      };

      publishEvent('compras.pago.realizado', eventData);
    } else {
      // Pago rechazado
      const eventData = {
        solicitudId: transaccion.id,
        descripcion: 'Pago de carrito rechazado',
        monto: total,
        moneda: 'USD',
        estado,
        nombre: transaccion.nombreCliente,
        destinatario: transaccion.emailCliente
      };

      publishEvent('compras.pago.rechazado', eventData);
    }

    return { transaccion, detalle, total, estado };
  }
};