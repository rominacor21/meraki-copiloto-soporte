// Paso 5: registro de cada ticket procesado.
// En producción se agrega una fila al Google Sheet "MERAKI - Tickets"; acá se guarda en memoria y en un JSONL local.

import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { config } from './config.js';

const tickets = new Map();

export function cargarRegistro(ruta = config.rutas.registro) {
  if (tickets.size || !existsSync(ruta)) return;
  for (const linea of readFileSync(ruta, 'utf8').split('\n').filter(Boolean)) {
    const t = JSON.parse(linea);
    tickets.set(t.ticket_id, t);
  }
}

export function guardarTicket(ticket, { persistir = true } = {}) {
  tickets.set(ticket.ticket_id, ticket);
  if (persistir) appendFileSync(config.rutas.registro, JSON.stringify(ticket) + '\n');
  return ticket;
}

export function obtenerTicket(id) {
  return tickets.get(id) ?? null;
}

export function listarTickets({ estado, categoria, desde, pagina = 1, porPagina = 20 } = {}) {
  let lista = [...tickets.values()];
  if (estado) lista = lista.filter((t) => t.estado === estado);
  if (categoria) lista = lista.filter((t) => t.categoria === categoria);
  if (desde) lista = lista.filter((t) => t.timestamp >= desde);
  lista.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const total = lista.length;
  return { total, pagina, porPagina, tickets: lista.slice((pagina - 1) * porPagina, pagina * porPagina) };
}

export function actualizarTicket(id, cambios, opciones) {
  const t = obtenerTicket(id);
  if (!t) return null;
  return guardarTicket({ ...t, ...cambios }, opciones);
}
