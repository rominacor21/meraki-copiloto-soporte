// Corre los 16 tickets del piloto por el flujo completo y compara con lo registrado en la prueba original.
// Uso: npm run demo

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parsearCSV } from '../lib/crm.js';
import { procesarTicket } from '../lib/procesar.js';

const ruta = fileURLToPath(new URL('../../db/tickets_piloto.csv', import.meta.url));
const piloto = parsearCSV(readFileSync(ruta, 'utf8'));

const filas = [];
for (const t of piloto) {
  const r = await procesarTicket({ email: t.email, texto: t.mensaje }, { persistir: false });
  filas.push({
    mensaje: t.mensaje.slice(0, 48),
    categoria: r.categoria,
    confianza: r.confianza,
    kb: r.kb_seccion_usada ?? '-',
    estado: r.estado,
    estado_piloto: t.estado,
  });
}
console.table(filas);

const porEstado = filas.reduce((acc, f) => ({ ...acc, [f.estado]: (acc[f.estado] ?? 0) + 1 }), {});
console.log('Tickets por estado:', porEstado);
