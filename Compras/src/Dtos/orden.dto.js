import Joi from 'joi';

const Monedas = ['COP', 'USD', 'EUR'];

export class CrearOrdenDTO {
  static schema = Joi.object({
    solicitudId: Joi.string().trim().required().messages({
      'any.required': 'El campo solicitudId es obligatorio.'
    }),
    descripcion: Joi.string().trim().required(),
    monto: Joi.number().positive().required(),

    moneda: Joi.string().valid(...Monedas).default('COP'),
    destinatario: Joi.string().email().optional(),
    nombre: Joi.string().trim().max(120).optional()
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
    aprobador: Joi.string().trim().required(),

    moneda: Joi.string().valid(...Monedas).default('COP'),
    destinatario: Joi.string().email().optional(),
    nombre: Joi.string().trim().max(120).optional()
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