// Paso 1: triaje. Clasifica el ticket en una de las 8 categorías, con urgencia y confianza.
// Producción: Claude Haiku. Simulación: reglas determinísticas para probar sin llamadas en vivo.

import { CATEGORIAS } from './categorias.js';
import { config } from './config.js';
import { llamarClaude } from './claude.js';
import { promptTriaje } from './prompts.js';

// El orden importa: lo sensible se evalúa primero.
const REGLAS = [
  { categoria: 'Cancelación/reembolso', patron: /cancelar|cancelaci[oó]n|dar(me)? de baja|reembols|devoluci[oó]n del dinero/gi },
  { categoria: 'Problema de facturación', patron: /\bfacturas?\b|cobro|duplicad|monto|pago rechazado/gi },
  { categoria: 'Consulta de estado', patron: /estado (actual )?del servicio|incidente|lentitud|ca[ií]da|status/gi },
  { categoria: 'Upgrade/downgrade de plan', patron: /\bplan(es)?\b|upgrade|downgrade|starter|growth|enterprise/gi },
  { categoria: 'Cambios administrativos', patron: /raz[oó]n social|\brut\b|direcci[oó]n fiscal|nuevos usuarios|crear(les)? cuentas/gi },
  { categoria: 'Reset de contraseña', patron: /contrase[ñn]a|password|olvid[eé]|no puedo (entrar|acceder)/gi },
  { categoria: 'Problema técnico/bug', patron: /se cuelga|\berror\b|\bbug\b|no funciona|integraci|endpoint|\bapi\b/gi },
];

// Señales de que el caso necesita a una persona aunque la categoría sea clara:
// errores sin resolver o cobros que pueden terminar en devolución.
const SENALES_ESCALADO = /persiste|se cuelga|\berror\b|duplicad|correcci[oó]n urgente/i;

const URGENCIA_ALTA = /urgente|no puedo|persiste|se cuelga|duplicad|cancelar|lentitud|incidente/i;
const URGENCIA_BAJA = /\bversi[oó]n m[oó]vil\b|razón social|razon social|¿hay versi[oó]n/i;

export function triajeSimulado(texto) {
  if (/cancelar|cancelaci[oó]n|reembols/i.test(texto)) {
    return { categoria: 'Cancelación/reembolso', urgencia: 'Alta', confianza: 1.0 };
  }
  const puntajes = REGLAS
    .map(({ categoria, patron }) => ({ categoria, aciertos: (texto.match(patron) ?? []).length }))
    .filter((r) => r.aciertos > 0)
    .sort((a, b) => b.aciertos - a.aciertos);

  if (puntajes.length === 0) {
    return { categoria: 'Otro', urgencia: urgencia(texto), confianza: 0.55 };
  }
  const [primera, segunda] = puntajes;
  let confianza = Math.min(0.95, 0.7 + 0.1 * primera.aciertos);
  if (segunda) confianza -= 0.12 * segunda.aciertos; // ambigüedad entre categorías
  if (SENALES_ESCALADO.test(texto)) confianza -= 0.3;
  return {
    categoria: primera.categoria,
    urgencia: urgencia(texto),
    confianza: Math.max(0.3, Number(confianza.toFixed(2))),
  };
}

function urgencia(texto) {
  if (URGENCIA_ALTA.test(texto)) return 'Alta';
  if (URGENCIA_BAJA.test(texto)) return 'Baja';
  return 'Media';
}

export async function triaje(texto) {
  if (config.modo === 'simulacion') return triajeSimulado(texto);
  const crudo = await llamarClaude({ modelo: config.modeloTriaje, prompt: promptTriaje(texto), maxTokens: 150 });
  const json = JSON.parse(crudo.slice(crudo.indexOf('{'), crudo.lastIndexOf('}') + 1));
  const categoria = CATEGORIAS.includes(json.categoria) ? json.categoria : 'Otro';
  return {
    categoria,
    urgencia: ['Alta', 'Media', 'Baja'].includes(json.urgencia) ? json.urgencia : 'Media',
    confianza: Math.max(0, Math.min(1, Number(json.confianza) || 0)),
  };
}
