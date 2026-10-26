// POST /api/enviar-email  { ticket_id, email_destino?, cuerpo? }
// El operador valida la respuesta y la envía. Los casos escalados no se pueden enviar desde acá.
// El envío real por Gmail API está en el roadmap; hoy se registra el envío y se actualiza el estado.

import { enviarJSON, leerJSON, soloMetodo } from '../lib/http.js';
import { actualizarTicket, cargarRegistro, obtenerTicket } from '../lib/registro.js';

export default async function handler(req, res) {
  if (!soloMetodo(req, res, 'POST')) return;
  cargarRegistro();
  const { ticket_id, email_destino, cuerpo } = await leerJSON(req);
  const ticket = obtenerTicket(ticket_id);
  if (!ticket) return enviarJSON(res, 404, { error: 'Ticket no encontrado' });
  if (ticket.estado === 'escalado_humano') {
    return enviarJSON(res, 409, { error: 'Caso sensible: lo responde un representante, no Meraki' });
  }
  const destino = email_destino ?? ticket.email_origen;
  if (!destino) return enviarJSON(res, 400, { error: 'Falta el email de destino' });
  enviarJSON(res, 200, actualizarTicket(ticket_id, {
    estado: 'enviado',
    respuesta_enviada: cuerpo ?? ticket.respuesta_generada,
    email_destino: destino,
    enviado_en: new Date().toISOString(),
  }));
}
