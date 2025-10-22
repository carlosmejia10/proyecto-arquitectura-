import { channel } from '../lib/amqp.js';
import { logger } from '../lib/logger.js';
import { sendGratitudeEmail } from '../services/email.service.js';

function toTemplate(event) {
  const { eventType, data } = event;
  if (eventType === 'compras.orden.creada') {
    return {
      templateType: 'COMPRAS_ORDEN_CREADA',
      asunto: `Orden registrada (${data?.solicitudId || ''})`,
      mensaje:
        `Tu orden ha sido registrada con estado PENDIENTE por un monto de ${data?.monto} ${data?.moneda || 'COP'}.`
    };
  }
  if (eventType === 'compras.orden.aprobada') {
    return {
      templateType: 'COMPRAS_ORDEN_APROBADA',
      asunto: `Orden aprobada (${data?.solicitudId || ''})`,
      mensaje:
        `Tu orden ha sido APROBADA. Aprobador: ${data?.aprobador || 'N/D'}.`
    };
  }
  return { templateType: 'DEFAULT', asunto: 'Actualización de Compras', mensaje: 'Se registró un evento.' };
}

export async function startComprasConsumer() {
  const queue = process.env.COMPRAS_QUEUE || 'mailer.compras.queue';
  if (!channel) throw new Error('Rabbit channel no inicializado');

  await channel.prefetch(5);

  channel.consume(queue, async (msg) => {
    if (!msg) return;
    try {
      const event = JSON.parse(msg.content.toString()); 
      const { data = {} } = event;
      const email = data.destinatario || data.email || data.correo;
      const nombre = data.nombre || 'Usuario';
      const solicitudId = data.solicitudId;

      if (!email) throw new Error('Evento de Compras sin destinatario (data.destinatario/email)');

      const { templateType, asunto, mensaje } = toTemplate(event);

      await sendGratitudeEmail({
        email,
        nombre,
        asunto,
        mensaje,
        solicitudId,
        templateType
      });

      channel.ack(msg);
      logger.info({ eventType: event.eventType, id: event.eventId }, 'Email enviado por evento de Compras');
    } catch (err) {
      // Enviar a DLQ
      channel.nack(msg, false, false);
      console.error('Fallo procesando evento de Compras:', err.message);
    }
  });

  console.log('Consumer de Compras iniciado');
}