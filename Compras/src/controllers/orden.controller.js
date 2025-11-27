// src/controllers/orden.controller.js
import { OrdenService } from "../services/orden.service.js";
import { CrearOrdenDTO, AprobarOrdenDTO } from "../Dtos/orden.dto.js";

export const OrdenController = {
  async crear(req, res, next) {
    try {
      const dto = new CrearOrdenDTO(req.body); // valida y normaliza datos

      // extras para el evento de notificación (no necesariamente se persisten)
      const traceId =
        req.headers["x-trace-id"] || req.headers["x-request-id"] || null;

      // Pasamos al service lo que el Mailer necesita en el evento AMQP
      const orden = await OrdenService.crearOrden({
        ...dto, // incluye solicitudId, descripcion, monto, moneda,
        // fechaIda, fechaRegreso, numeroTarjeta, tipoTarjeta, etc.

        destinatario: req.body.destinatario,
        nombre: req.body.nombre,

        // campos nuevos del TVP
        fechaIda: req.body.fechaIda,
        fechaRegreso: req.body.fechaRegreso,
        numeroTarjeta: req.body.numeroTarjeta,
        tipoTarjeta: req.body.tipoTarjeta,

        moneda: req.body.moneda || "COP",

        traceId,
      });

      res.status(201).json(orden);
    } catch (err) {
      next(err);
    }
  },

  async aprobar(req, res, next) {
    try {
      const { id } = req.params;
      const dto = new AprobarOrdenDTO(req.body);
      const traceId =
        req.headers["x-trace-id"] || req.headers["x-request-id"] || null;

      // También pasamos destinatario/nombre para el correo de “aprobada”
      const orden = await OrdenService.aprobarOrden(id, dto.aprobador, {
        destinatario: req.body.destinatario,
        nombre: req.body.nombre,
        moneda: req.body.moneda || "COP",
        traceId,
      });

      res.json(orden);
    } catch (err) {
      next(err);
    }
  },

  async listar(_req, res, next) {
    try {
      const data = await OrdenService.listar();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const orden = await OrdenService.obtenerPorId(id);
      
      if (!orden) {
        return res.status(404).json({ error: 'Orden no encontrada' });
      }
      
      res.json(orden);
    } catch (error) {
      console.error('Error obteniendo orden:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};
  