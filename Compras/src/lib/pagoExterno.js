import axios from 'axios';

export async function enviarPagoExterno(datos) {
  try {
    const URL = "https://felipelondonocamposvargas/crearpago1"; 
    // si es http:// o https://, cámbialo arriba

    const res = await axios.post(URL, datos, {
      headers: { "Content-Type": "application/json" }
    });

    console.log("Pago externo enviado correctamente:", res.data);
    return res.data;

  } catch (error) {
    console.error("Error enviando pago externo:", error.response?.data || error.message);
    throw new Error("No se pudo enviar el pago externo");
  }
}