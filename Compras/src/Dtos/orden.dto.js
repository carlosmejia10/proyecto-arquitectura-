import Joi from 'joi';

const Monedas = ['COP', 'USD', 'EUR'];

export class CrearOrdenDTO {
  static schema = Joi.object({
    solicitudId: Joi.string().trim().required().messages({
      'any.required': 'El campo solicitudId es obligatorio.'
    }),

    descripcion: Joi.string().trim().required().messages({
      'any.required': 'La descripción es obligatoria.'
    }),

    monto: Joi.number().positive().required().messages({
      'number.base': 'El monto debe ser numérico.',
      'number.positive': 'El monto debe ser positivo.',
      'any.required': 'El monto es obligatorio.'
    }),

    moneda: Joi.string().valid(...Monedas).default('COP'),

    destinatario: Joi.string().email().required().messages({
      'string.email': 'El destinatario debe ser un correo válido.',
      'any.required': 'El destinatario (correo) es obligatorio.'
    }),

    nombre: Joi.string().trim().max(120).required().messages({
      'any.required': 'El nombre del solicitante es obligatorio.'
    }),

    fechaIda: Joi.date().iso().optional(),
    fechaRegreso: Joi.date().iso().optional(),

    traceId: Joi.string().optional(),

    // ⛔ No queremos que la orden reciba datos de tarjeta
    numeroTarjeta: Joi.forbidden().messages({
      'any.unknown': 'numeroTarjeta no se debe enviar en la creación de la orden.'
    }),
    tipoTarjeta: Joi.forbidden().messages({
      'any.unknown': 'tipoTarjeta no se debe enviar en la creación de la orden.'
    })
  })
  .unknown(false);

  constructor(data) {
    const { error, value } = CrearOrdenDTO.schema.validate(data, { abortEarly: false });
    if (error) {
      const detalles = error.details.map(d => d.message);
      const err = new Error('Datos inválidos: ' + detalles.join(', '));
      err.status = 400;
      throw err;
    }
    Object.assign(this, value);
  }
}

export class AprobarOrdenDTO {
  static schema = Joi.object({
    aprobador: Joi.string().trim().required().messages({
      'any.required': 'El aprobador es obligatorio.'
    }),

    comentario: Joi.string().trim().max(255).optional(),

    // misma política: la aprobación no toca tarjeta
    numeroTarjeta: Joi.forbidden(),
    tipoTarjeta: Joi.forbidden()
  }).unknown(false);

  constructor(data) {
    const { error, value } = AprobarOrdenDTO.schema.validate(data, { abortEarly: false });
    if (error) {
      const detalles = error.details.map(d => d.message);
      const err = new Error('Datos inválidos: ' + detalles.join(', '));
      err.status = 400;
      throw err;
    }
    Object.assign(this, value);
  }
}