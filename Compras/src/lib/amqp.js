import amqp from 'amqplib';
import crypto from 'crypto';
import { logger } from './logger.js';

let channel;

export async function connectRabbit() {
  try {
    const url = process.env.RABBIT_URL || 'amqp://guest:guest@localhost:5672';
    const exchange = process.env.EXCHANGE_NAME || 'notificaciones.exchange';

    const conn = await amqp.connect(url);
    channel = await conn.createChannel();
    await channel.assertExchange(exchange, 'topic', { durable: true });

    logger.info(`Conectado a RabbitMQ (${exchange})`);
  } catch (err) {
    logger.error({ err }, 'Error conectando a RabbitMQ');
    throw err;
  }
}

/**
 * @param {string} routingKey clave de enrutamiento (ej: compras.orden.creada)
 * @param {object} data payload a enviar 
 */
export function publishEvent(routingKey, data = {}) {
  if (!channel) {
    throw new Error('RabbitMQ no inicializado. Llama connectRabbit() primero.');
  }

  const exchange = process.env.EXCHANGE_NAME || 'notificaciones.exchange';

  const event = {
    eventId: crypto.randomUUID(),
    eventType: routingKey,
    occurredAt: new Date().toISOString(),
    data
  };

  try {
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(event)), {
      persistent: true,
      contentType: 'application/json'
    });

    logger.info({ routingKey, eventId: event.eventId }, 'Evento publicado en RabbitMQ');
  } catch (err) {
    logger.error({ err, routingKey }, 'Error publicando evento RabbitMQ');
  }
}