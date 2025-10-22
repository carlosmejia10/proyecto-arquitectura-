import amqp from 'amqplib';
import { logger } from './logger.js';

export let channel;

export async function connectRabbit() {
  const url = process.env.RABBIT_URL;
  const exchange = process.env.EXCHANGE_NAME || 'notificaciones.exchange';
  const dlx = process.env.DLX_NAME || 'deadletter.exchange';

  const conn = await amqp.connect(url);
  channel = await conn.createChannel();

  await channel.assertExchange(exchange, 'topic', { durable: true });
  await channel.assertExchange(dlx, 'topic', { durable: true });

  logger.info('EmailSender: RabbitMQ conectado');
}

export async function setupComprasBindings() {
  const exchange = process.env.EXCHANGE_NAME || 'notificaciones.exchange';
  const dlx = process.env.DLX_NAME || 'deadletter.exchange';
  const queue = process.env.COMPRAS_QUEUE || 'mailer.compras.queue';
  const dlq = process.env.DLQ_NAME || 'mailer.compras.dlq';

  await channel.assertQueue(dlq, { durable: true });

  await channel.assertQueue(queue, {
    durable: true,
    deadLetterExchange: dlx
  });

  // Escucha eventos del micro de Compras
  await channel.bindQueue(queue, exchange, 'compras.orden.creada');
  await channel.bindQueue(queue, exchange, 'compras.orden.aprobada');


}