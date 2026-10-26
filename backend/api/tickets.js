// GET /api/tickets?estado=&categoria=&desde=&pagina=&porPagina=
// Lista paginada de tickets procesados, del más nuevo al más viejo.

import { enviarJSON, parametros, soloMetodo } from '../lib/http.js';
import { cargarRegistro, listarTickets } from '../lib/registro.js';

export default function handler(req, res) {
  if (!soloMetodo(req, res, 'GET')) return;
  cargarRegistro();
  const { estado, categoria, desde, pagina = '1', porPagina = '20' } = parametros(req);
  enviarJSON(res, 200, listarTickets({ estado, categoria, desde, pagina: Number(pagina), porPagina: Number(porPagina) }));
}
