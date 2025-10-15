import { defaultTemplate } from "./defaultTemplate.js";

export function renderEmailTemplate(type, data) {
  switch (type) {
    case "TVP_SOLICITUD_CREADA":
      return defaultTemplate({
        ...data,
        asunto: data.asunto || "Confirmación de solicitud de viáticos",
        mensaje:
          data.mensaje ||
          `Hemos recibido tu solicitud ${data.solicitudId}. Será revisada por el área responsable.`,
      });
    case "COMPRAS_ORDEN_APROBADA":
      return defaultTemplate({
        ...data,
        asunto: data.asunto || "Aprobación de pasajes",
        mensaje:
          data.mensaje ||
          `Tu orden asociada a la solicitud ${data.solicitudId} ha sido aprobada. Recibirás los comprobantes electrónicos.`,
      });
    case "PAGOS_EJECUTADO":
      return defaultTemplate({
        ...data,
        asunto: data.asunto || "Confirmación de desembolso",
        mensaje:
          data.mensaje ||
          `El pago asociado a la solicitud ${data.solicitudId} fue ejecutado.`,
      });
    default:
      return defaultTemplate(data);
  }
}
