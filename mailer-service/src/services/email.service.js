// src/services/email.service.js
import { transporter } from '../lib/mailer.js';
import { EmailRepository } from '../repositories/email.repository.js';
import { renderEmailTemplate } from '../templates/factory.js';

export async function sendGratitudeEmail({ email, nombre, asunto, mensaje, solicitudId, templateType }) {
  const html = renderEmailTemplate(templateType || 'DEFAULT', { nombre, mensaje, asunto, solicitudId });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: asunto || 'Notificación',
    html
  };

  const info = await transporter.sendMail(mailOptions);
  await EmailRepository.createLog({
    to: email,
    subject: mailOptions.subject,
    html,
    status: 'SENT',
    providerMessageId: info.messageId || null
  });

  return { success: true, messageId: info.messageId || null };
}