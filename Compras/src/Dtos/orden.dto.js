import Joi from 'joi';

const Monedas = ['COP', 'USD', 'EUR'];
const TiposTarjeta = ['CREDITO', 'DEBITO'];

export class CrearOrdenDTO {
  static schema = Joi.object({
    solicitudId: Joi.string().trim().required().messages({
      'any.required': 'El campo solicitudId es obligatorio.'
    }),

    descripcion: Joi.string().trim().required(),
    monto: Joi.number().positive().required(),

    // Moneda de la orden
    moneda: Joi.string().valid(...Monedas).default('COP'),

    // Fechas del paquete (ida y regreso)
    fechaIda: Joi.date().iso().required().messages({
      'any.required': 'El campo fechaIda es obligatorio.',
      'date.format': 'El campo fechaIda debe estar en formato ISO (YYYY-MM-DD).'
    }),
    fechaRegreso: Joi.date().iso()
      .min(Joi.ref('fechaIda'))
      .required()
      .messages({
        'any.required': 'El campo fechaRegreso es obligatorio.',
        'date.min': 'La fechaRegreso debe ser igual o posterior a fechaIda.'
      }),

    // Datos de tarjeta para el pago
    numeroTarjeta: Joi.string()
      .pattern(/^\d{12,19}$/)
      .required()
      .messages({
        'any.required': 'El campo numeroTarjeta es obligatorio.',
        'string.pattern.base': 'El numeroTarjeta debe tener entre 12 y 19 dígitos numéricos.'
      }),

    tipoTarjeta: Joi.string()
      .valid(...TiposTarjeta)
      .required()
      .messages({
        'any.required': 'El campo tipoTarjeta es obligatorio.',
        'any.only': 'El tipoTarjeta debe ser CREDITO o DEBITO.'
      }),

    // Datos para notificación / mailer
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