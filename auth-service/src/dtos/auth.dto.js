
import Joi from 'joi';

export class LoginDTO {
  static schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }).unknown(false);

  constructor(data) {
    const { error, value } = LoginDTO.schema.validate(data, { abortEarly: false });
    if (error) {
      const details = error.details.map(d => d.message).join(', ');
      const err = new Error('Datos inválidos: ' + details);
      err.status = 400;
      throw err;
    }
    Object.assign(this, value);
  }
}