// POST /api/procesar-ticket  { email, texto }
// Devuelve categoría, urgencia, confianza, respuesta, datos del cliente y sección de KB usada.

import { enviarJSON, leerJSON, soloMetodo } from '../lib/http.js';
import { procesarTicket } from '../lib/procesar.js';

export default async function handler(req, res) {
  if (!soloMetodo(req, res, 'POST')) return;
  try {
    const { email, texto } = await leerJSON(req);
    if (!texto) return enviarJSON(res, 400, { error: 'Falta el texto del ticket' });
    enviarJSON(res, 200, await procesarTicket({ email, texto }));
  } catch (err) {
    enviarJSON(res, 500, { error: err.message });
  }
}
