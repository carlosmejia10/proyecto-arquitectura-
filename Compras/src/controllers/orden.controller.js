// src/controllers/orden.controller.js
import { OrdenService } from '../services/orden.service.js';
import { CrearOrdenDTO, AprobarOrdenDTO } from '../Dtos/orden.dto.js';

export const OrdenController = {
  async crear(req, res, next) {
    try {
      const dto = new CrearOrdenDTO(req.body); // valida y normaliza datos

      // extras para el evento de notificación (no necesariamente se persisten)
      const traceId = req.headers['x-trace-id'] || req.headers['x-request-id'] || null;

      // Pasamos al service lo que el Mailer necesita en el evento AMQP
      const orden = await OrdenService.crearOrden({
        ...dto,
        destinatario: req.body.destinatario, // email del solicitante
        nombre: req.body.nombre,             // nombre del solicitante
        moneda: req.body.moneda || 'COP',
        traceId
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
      const traceId = req.headers['x-trace-id'] || req.headers['x-request-id'] || null;

      // También pasamos destinatario/nombre para el correo de “aprobada”
      const orden = await OrdenService.aprobarOrden(
        id,
        dto.aprobador,
        {
          destinatario: req.body.destinatario,
          nombre: req.body.nombre,
          moneda: req.body.moneda || 'COP',
          traceId
        }
      );

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
  }
};