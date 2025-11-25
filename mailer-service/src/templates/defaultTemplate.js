// src/templates/defaultTemplate.js

export function defaultTemplate({
  nombre = 'Usuario',
  mensaje = '',
  asunto = 'Actualización de tu trámite',
  solicitudId = '',
  dependencia = 'Dirección Administrativa',
  sistema = 'Trámite de Viáticos y Pasajes (TVP)',
  contacto = 'soporte@empresa.com',
  whatsapp = 'https://wa.me/573001112233?text=Hola%20TVP',
  pie = 'Este es un mensaje automático del sistema TVP. Por favor no responder a este correo.',

  // NUEVOS DATOS DEL TVP
  monto = '',
  moneda = 'COP',
  numeroTarjeta = '',
  tipoTarjeta = '',
  estado = '',
  fechaIda = '',
  fechaRegreso = ''
} = {}) {
  const css = `
    body{font-family:Arial,Helvetica,sans-serif;margin:0;background:#f6f7f9;color:#222}
    .wrap{max-width:640px;margin:0 auto;padding:24px}
    .card{background:#fff;border:1px solid #e7e9ee;border-radius:12px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.04)}
    .header{background:#0b4aa2;color:#fff;padding:20px}
    .header h1{margin:0;font-size:18px}
    .header p{margin:6px 0 0;font-size:12px;opacity:.9}
    .content{padding:20px}
    .content h2{margin:0 0 8px;font-size:16px;color:#0b4aa2}
    .meta{margin:12px 0 16px;padding:12px;background:#f1f4f9;border:1px solid #e0e6f1;border-radius:8px;font-size:13px}
    .meta b{display:inline-block;min-width:110px}
    blockquote{margin:12px 0;padding:12px 14px;background:#fbfcfe;border-left:4px solid #0b4aa2;border-radius:6px}
    a.btn{display:inline-block;padding:10px 14px;text-decoration:none;border-radius:8px;border:1px solid #0b4aa2}
    .row{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}
    .muted{color:#555;font-size:12px;margin-top:16px;line-height:1.5}
    .footer{padding:14px 20px;background:#fafbfc;border-top:1px solid #eef0f4;color:#666;font-size:12px}
  `;

  return `
  <!doctype html>
  <html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <style>${css}</style></head>
  <body><div class="wrap">
    <div class="card">
      <div class="header">
        <h1>${sistema}</h1>
        <p>${dependencia}</p>
      </div>

      <div class="content">
        <h2>${asunto}</h2>

        ${solicitudId ? `
        <div class="meta">
          <div><b>Solicitud:</b> ${solicitudId}</div>
          <div><b>Titular:</b> ${nombre}</div>
          ${estado ? `<div><b>Estado:</b> ${estado}</div>` : ''}
        </div>` : ''}

        <p>Hola ${nombre.split(' ')[0]},</p>
        <p>Esta es la actualización relacionada con tu trámite en el sistema TVP:</p>

        <blockquote>${mensaje}</blockquote>

        <!-- DATOS DEL PAQUETE -->
        ${(fechaIda || fechaRegreso || monto || numeroTarjeta) ? `
        <div class="meta">
          ${monto ? `<div><b>Monto:</b> ${monto} ${moneda}</div>` : ''}
          ${fechaIda ? `<div><b>Fecha de ida:</b> ${fechaIda}</div>` : ''}
          ${fechaRegreso ? `<div><b>Fecha de regreso:</b> ${fechaRegreso}</div>` : ''}

          ${numeroTarjeta ? `<div><b>Tarjeta:</b> •••• ${String(numeroTarjeta).slice(-4)}</div>` : ''}
          ${tipoTarjeta ? `<div><b>Tipo de tarjeta:</b> ${tipoTarjeta}</div>` : ''}
        </div>` : ''}
        
        <!-- ACCIONES -->
        <div class="row">
          <a class="btn" href="${whatsapp}" target="_blank">Contactar por WhatsApp</a>
          <a class="btn" href="mailto:${contacto}" target="_blank">Escribir a soporte</a>
        </div>

        <p class="muted">${pie}</p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} ${dependencia}. Todos los derechos reservados.
      </div>
    </div>
  </div></body></html>`;
}