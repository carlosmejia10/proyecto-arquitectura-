import { logger } from '../lib/logger.js';

export function errorHandler(err, req, res, next) { // eslint-disable-line
  logger.error({ err }, 'Unhandled error');
  res.status(500).json({ success: false, message: 'Hubo un error al enviar el correo', detail: err.message });
}