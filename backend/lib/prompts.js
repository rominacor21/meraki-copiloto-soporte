// Prompts de los dos modelos, tal como se definieron en los requerimientos del MVP 2.0.

import { CATEGORIAS } from './categorias.js';
import { config } from './config.js';

export function promptTriaje(textoTicket) {
  const lista = CATEGORIAS.map((c, i) => `${i + 1}. ${c}`).join('\n');
  return `Clasifica este ticket en UNA de estas 8 categorías:
${lista}

Ticket: ${textoTicket}

Responde solo en JSON: { "categoria": string, "urgencia": "Alta" | "Media" | "Baja", "confianza": number entre 0.0 y 1.0 }`;
}

export function promptRespuesta({ textoTicket, categoria, kb, cliente }) {
  const datosCliente = cliente
    ? `${cliente.nombre}, plan ${cliente.plan}, estado de pago ${cliente.estado_pago}`
    : 'cliente no encontrado en el CRM';
  return `Eres un agente de soporte de MercadoSur Tech. Genera una respuesta amable y clara para este ticket.

TICKET: ${textoTicket}
CATEGORÍA: ${categoria}
CONTEXTO DE KB: ${kb?.contenido ?? 'sin sección aplicable'}
DATOS DEL CLIENTE: ${datosCliente}

Usa solo la información del contexto. No prometas reembolsos, créditos ni plazos que no estén en la KB.
Responde SOLO con el texto de la respuesta, sin explicaciones.
Incluye al final: '${config.pieDeRespuesta}'`;
}
