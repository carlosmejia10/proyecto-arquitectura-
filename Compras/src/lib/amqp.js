import amqp from 'amqplib';
import { logger } from './logger.js';

let channel;

export async function connectRabbit() {
  const url = process.env.RABBIT_URL;
  const exchange = process.env.EXCHANGE_NAME || 'notificaciones.exchange';

  const conn = await amqp.connect(url);
  channel = await conn.createChannel();
  await channel.assertExchange(exchange, 'topic', { durable: true });

  logger.info('Conectado a RabbitMQ');
}

export function publishEvent(routingKey, data) {
  const exchange = process.env.EXCHANGE_NAME;
  const event = {
    eventId: crypto.randomUUID(),
    eventType: routingKey,
    occurredAt: new Date().toISOString(),
    data
  };

  channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(event)));
  logger.info({ routingKey, id: event.eventId }, 'Evento publicado');
}