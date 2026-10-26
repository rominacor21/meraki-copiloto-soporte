// Orquestador del flujo de /api/procesar-ticket:
// triaje → KB → CRM → respuesta → registro → JSON para el frontend.

import { randomUUID } from 'node:crypto';
import { CATEGORIAS_SENSIBLES } from './categorias.js';
import { config } from './config.js';
import { buscarCliente } from './crm.js';
import { detectarJailbreak } from './guardrails.js';
import { buscarSeccion } from './kb.js';
import { guardarTicket } from './registro.js';
import { generarRespuesta } from './respuesta.js';
import { triaje } from './triaje.js';

export async function procesarTicket({ email, texto }, opciones = {}) {
  if (!texto?.trim()) throw new Error('El ticket no tiene texto');
  const pasos = [];
  const log = (paso, detalle) => pasos.push({ paso, detalle, ts: new Date().toISOString() });

  // Guardrail previo: un intento de jailbreak nunca llega al modelo de respuesta.
  if (detectarJailbreak(texto)) {
    log('guardrail', 'Posible intento de jailbreak, se deriva a un operador');
    return guardarTicket(armarTicket({ email, texto, pasos, estado: 'requiere_revisión',
      triado: { categoria: 'Otro', urgencia: 'Alta', confianza: 0 },
      notas: 'Bloqueado por guardrail de seguridad' }), opciones);
  }

  // Paso 1: triaje.
  const triado = await triaje(texto);
  log('triaje', triado);

  const sensible = CATEGORIAS_SENSIBLES.has(triado.categoria);
  const rutinario = !sensible && triado.categoria !== 'Otro';

  // Paso 2: KB, solo si hay confianza suficiente y el caso es rutinario.
  const kb = rutinario && triado.confianza >= config.umbralConfianza ? buscarSeccion(triado.categoria, texto) : null;
  log('kb', kb ? kb.seccion : 'sin consulta');

  // Paso 3: datos del cliente.
  const cliente = buscarCliente(email);
  log('crm', cliente ? `${cliente.nombre}, plan ${cliente.plan}, ${cliente.estado_pago}` : 'cliente no encontrado');

  // Paso 4: respuesta.
  const respuesta = await generarRespuesta({ textoTicket: texto, categoria: triado.categoria, kb, cliente });
  log('respuesta', `${respuesta.length} caracteres`);

  // Puerta de escalado (requerimiento 8.2).
  let estado = 'pendiente_envío';
  let notas = `Respuesta generada con confianza ${triado.confianza}`;
  if (sensible) {
    estado = 'escalado_humano';
    notas = 'Categoría sensible: la gestiona una persona';
  } else if (triado.confianza < config.umbralConfianza) {
    estado = 'requiere_revisión';
    notas = 'Confianza baja: el operador valida el borrador antes de enviar';
  }
  if (cliente?.estado_pago === 'Vencido') notas += '. Cliente con pago vencido';

  // Pasos 5 y 6: registro y respuesta al frontend.
  return guardarTicket(armarTicket({ email, texto, pasos, estado, triado, kb, cliente, respuesta, notas }), opciones);
}

function armarTicket({ email, texto, pasos, estado, triado, kb = null, cliente = null, respuesta = '', notas }) {
  return {
    ticket_id: randomUUID(),
    timestamp: new Date().toISOString(),
    email_origen: email ?? null,
    mensaje: texto,
    nombre_cliente: cliente?.nombre ?? null,
    plan_cliente: cliente?.plan ?? null,
    estado_pago: cliente?.estado_pago ?? null,
    categoria: triado.categoria,
    urgencia: triado.urgencia,
    confianza: triado.confianza,
    kb_seccion_usada: kb?.seccion ?? null,
    respuesta_generada: respuesta,
    estado,
    notas_operador: notas,
    csat: null,
    modo: config.modo,
    pasos,
  };
}
