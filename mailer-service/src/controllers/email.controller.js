import { z } from 'zod';
import { sendGratitudeEmail } from '../services/email.service.js';

const EmailSchema = z.object({
  email: z.string().email(),
  nombre: z.string().min(1).max(120),
  asunto: z.string().min(1).max(160),
  mensaje: z.string().min(1)
});

export async function postSendEmail(req, res) {
  const parse = EmailSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, errors: parse.error.flatten() });
  }

  const { email, nombre, asunto, mensaje } = parse.data;
  const result = await sendGratitudeEmail({ email, nombre, asunto, mensaje });
  return res.status(200).json({ success: true, message: 'Correo enviado', messageId: result.messageId });
}