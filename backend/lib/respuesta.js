// Paso 4: generación de la respuesta.
// Producción: Claude Sonnet con categoría + KB + datos del cliente. Simulación: plantilla con la sección de la KB.

import { config } from './config.js';
import { llamarClaude } from './claude.js';
import { promptRespuesta } from './prompts.js';

export function respuestaSimulada({ categoria, kb, cliente }) {
  const saludo = cliente ? `Hola ${cliente.nombre.split(' ')[0]},` : 'Hola,';
  if (categoria === 'Cancelación/reembolso') {
    return `${saludo} tu solicitud fue registrada. Un representante se va a contactar con vos en un plazo máximo de 24 horas hábiles.\n\n${config.pieDeRespuesta}`;
  }
  if (!kb) {
    return `${saludo} recibimos tu consulta y la estamos revisando. Te respondemos a la brevedad.\n\n${config.pieDeRespuesta}`;
  }
  const primerParrafo = kb.contenido.split('\n\n')[0];
  return `${saludo} ${primerParrafo}\n\n${config.pieDeRespuesta}`;
}

export async function generarRespuesta({ textoTicket, categoria, kb, cliente }) {
  if (config.modo === 'simulacion') return respuestaSimulada({ categoria, kb, cliente });
  return llamarClaude({
    modelo: config.modeloRespuesta,
    prompt: promptRespuesta({ textoTicket, categoria, kb, cliente }),
  });
}
