// Paso 2: búsqueda en la base de conocimiento.
// La KB se lee una sola vez y queda en memoria (en producción, el Google Doc se exporta a este formato).

import { readFileSync } from 'node:fs';
import { config } from './config.js';
import { SECCION_POR_CATEGORIA, SECCION_POR_PALABRA_CLAVE } from './categorias.js';

let cache = null;

export function cargarKB(ruta = config.rutas.kb) {
  if (cache) return cache;
  const texto = readFileSync(ruta, 'utf8');
  cache = new Map();
  for (const bloque of texto.split(/^## /m).slice(1)) {
    const [titulo, ...cuerpo] = bloque.split('\n');
    cache.set(titulo.trim(), cuerpo.join('\n').trim());
  }
  return cache;
}

export function buscarSeccion(categoria, textoTicket) {
  const kb = cargarKB();
  const porPalabra = SECCION_POR_PALABRA_CLAVE.find(({ patron }) => patron.test(textoTicket));
  const titulo = porPalabra?.seccion ?? SECCION_POR_CATEGORIA[categoria];
  if (!titulo || !kb.has(titulo)) return null;
  return { seccion: titulo, contenido: kb.get(titulo) };
}
