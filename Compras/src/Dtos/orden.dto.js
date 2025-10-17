import Joi from 'joi';
/**
 * DTO para validar y transformar los datos de creación de una orden
 */
export class CrearOrdenDTO {
  static schema = Joi.object({
    solicitudId: Joi.string().trim().required().messages({
      'any.required': 'El campo solicitudId es obligatorio.'
    }),
    descripcion: Joi.string().trim().required(),
    monto: Joi.number().positive().required()
  });

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

/**
 * DTO para aprobar una orden existente
 */
export class AprobarOrdenDTO {
  static schema = Joi.object({
    aprobador: Joi.string().trim().required()
  });

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