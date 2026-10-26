// GET /api/ticket/:id
// Detalle de un ticket con todos los pasos del procesamiento.

import { enviarJSON, soloMetodo } from '../../lib/http.js';
import { cargarRegistro, obtenerTicket } from '../../lib/registro.js';

export default function handler(req, res) {
  if (!soloMetodo(req, res, 'GET')) return;
  cargarRegistro();
  const id = req.query?.id ?? new URL(req.url, 'http://localhost').pathname.split('/').pop();
  const ticket = obtenerTicket(id);
  if (!ticket) return enviarJSON(res, 404, { error: 'Ticket no encontrado' });
  enviarJSON(res, 200, ticket);
}
