// Servidor local para desarrollo: monta los mismos handlers que usa Vercel.
// Uso: npm start  →  http://localhost:3001

import { createServer } from 'node:http';
import { config } from './lib/config.js';
import procesarTicket from './api/procesar-ticket.js';
import tickets from './api/tickets.js';
import ticket from './api/ticket/[id].js';
import enviarEmail from './api/enviar-email.js';
import feedback from './api/feedback.js';
import { enviarJSON } from './lib/http.js';

const rutas = [
  [/^\/api\/procesar-ticket$/, procesarTicket],
  [/^\/api\/tickets$/, tickets],
  [/^\/api\/ticket\/[\w-]+$/, ticket],
  [/^\/api\/enviar-email$/, enviarEmail],
  [/^\/api\/feedback$/, feedback],
];

const puerto = Number(process.env.PORT ?? 3001);

createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET,POST,OPTIONS',
      'access-control-allow-headers': 'content-type',
    });
    return res.end();
  }
  const { pathname } = new URL(req.url, 'http://localhost');
  const ruta = rutas.find(([patron]) => patron.test(pathname));
  if (!ruta) return enviarJSON(res, 404, { error: 'Ruta no encontrada' });
  ruta[1](req, res);
}).listen(puerto, () => console.log(`Meraki backend en http://localhost:${puerto} (modo ${config.modo})`));
