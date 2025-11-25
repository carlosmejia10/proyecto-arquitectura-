import { OrdenRepository } from '../repositories/orden.repository.js';
import { publishEvent } from '../lib/amqp.js';
import { enviarPagoExterno } from '../lib/pagoExterno.js';

export const OrdenService = {

  async crearOrden(dto) {
    const orden = await OrdenRepository.create({
      solicitudId: dto.solicitudId,
      descripcion: dto.descripcion,
      monto: dto.monto,
      moneda: dto.moneda
    });

    // publicamos evento de creación
    publishEvent('compras.orden.creada', orden);

    return orden;
  },

  async aprobarOrden(id, aprobador) {
    // 1. Actualizamos la orden
    const orden = await OrdenRepository.update(id, {
      estado: 'APROBADA',
      aprobador
    });

    // 2. Publicamos evento interno
    publishEvent('compras.orden.aprobada', orden);

    // 3. Armamos datos para webhook de pago externo
    const pagoData = {
      titulo: `Pago orden ${orden.solicitudId}`,
      cantidad: 1,
      precio: orden.monto,
      nombre: orden.aprobador || "Administrador",
      email: "notificaciones@tvp.com" // puedes poner un campo real si lo tienes
    };

    // 4. Enviamos al servicio externo
    let pagoRespuesta;
    try {
      pagoRespuesta = await enviarPagoExterno(pagoData);
    } catch (error) {
      console.error("❌ Error enviando pago externo:", error.message);
      // NO detenemos la aprobación, solo lo registramos
    }

    // 5. Devolvemos todo
    return {
      orden,
      pagoExterno: pagoRespuesta || null
    };
  },

  async listar() {
    return OrdenRepository.findAll();
  },

  async obtenerPorId(id) {
    return OrdenRepository.findById(id);
  }

  
};