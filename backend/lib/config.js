// Configuración central del backend de Meraki.
// Sin ANTHROPIC_API_KEY el sistema corre en modo simulación: determinístico y sin llamadas externas.

import { fileURLToPath } from 'node:url';
import path from 'node:path';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export const config = {
  modo: process.env.ANTHROPIC_API_KEY ? 'produccion' : 'simulacion',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? '',
  modeloTriaje: process.env.MODELO_TRIAJE ?? 'claude-haiku-5-5',
  modeloRespuesta: process.env.MODELO_RESPUESTA ?? 'claude-sonnet-5-5',

  // Umbral de confianza: por debajo, el ticket nunca se responde solo (requerimiento 8.2).
  umbralConfianza: Number(process.env.UMBRAL_CONFIANZA ?? 0.7),

  rutas: {
    kb: process.env.KB_PATH ?? path.join(raiz, 'db', 'base_de_conocimiento.md'),
    crm: process.env.CRM_PATH ?? path.join(raiz, 'db', 'crm_piloto.csv'),
    registro: process.env.REGISTRO_PATH ?? path.join(raiz, 'db', 'registro_tickets.jsonl'),
  },

  pieDeRespuesta:
    'Este mensaje fue generado automáticamente; si no resuelve tu caso, responde este correo y te contactará una persona.',
};
