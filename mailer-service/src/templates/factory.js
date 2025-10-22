import { defaultTemplate } from "./defaultTemplate.js";

export function renderEmailTemplate(type, data) {
  switch (type) {
    case 'COMPRAS_ORDEN_CREADA':
  return defaultTemplate({
    ...data,
    asunto: data.asunto || 'Orden registrada',
    mensaje: data.mensaje || `Tu orden ${data.solicitudId} fue creada y está en revisión.`
  });
case 'COMPRAS_ORDEN_APROBADA':
  return defaultTemplate({
    ...data,
    asunto: data.asunto || 'Orden aprobada',
    mensaje: data.mensaje || `Tu orden ${data.solicitudId} fue aprobada.`
  });
    default:
      return defaultTemplate(data);
  }
}
