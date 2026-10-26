// Paso 3: lookup del cliente en el CRM piloto.
// En producción el CRM es un Google Sheet; acá se lee su exportación CSV.

import { readFileSync } from 'node:fs';
import { config } from './config.js';

export function parsearCSV(texto) {
  const filas = [];
  let fila = [];
  let campo = '';
  let enComillas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (enComillas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') enComillas = false;
      else campo += c;
    } else if (c === '"') enComillas = true;
    else if (c === ',') { fila.push(campo); campo = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && texto[i + 1] === '\n') i++;
      fila.push(campo); campo = '';
      if (fila.some((v) => v !== '')) filas.push(fila);
      fila = [];
    } else campo += c;
  }
  if (campo || fila.length) { fila.push(campo); filas.push(fila); }
  const [encabezado, ...datos] = filas;
  return datos.map((f) => Object.fromEntries(encabezado.map((col, j) => [col, f[j] ?? ''])));
}

let clientes = null;

export function cargarCRM(ruta = config.rutas.crm) {
  if (!clientes) {
    clientes = new Map(parsearCSV(readFileSync(ruta, 'utf8')).map((c) => [c.email.toLowerCase(), c]));
  }
  return clientes;
}

export function buscarCliente(email) {
  if (!email) return null;
  return cargarCRM().get(email.trim().toLowerCase()) ?? null;
}
