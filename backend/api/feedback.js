// POST /api/feedback  { ticket_id, score }
// Registra el CSAT (1 a 5) para medir la calidad de las respuestas.

import { enviarJSON, leerJSON, soloMetodo } from '../lib/http.js';
import { actualizarTicket, cargarRegistro } from '../lib/registro.js';

export default async function handler(req, res) {
  if (!soloMetodo(req, res, 'POST')) return;
  cargarRegistro();
  const { ticket_id, score } = await leerJSON(req);
  const csat = Number(score);
  if (!Number.isInteger(csat) || csat < 1 || csat > 5) {
    return enviarJSON(res, 400, { error: 'El score tiene que ser un entero de 1 a 5' });
  }
  const ticket = actualizarTicket(ticket_id, { csat });
  if (!ticket) return enviarJSON(res, 404, { error: 'Ticket no encontrado' });
  enviarJSON(res, 200, ticket);
}
