// Las 8 categorías del triaje y su relación con la base de conocimiento.

export const CATEGORIAS = [
  'Reset de contraseña',
  'Problema de facturación',
  'Cambios administrativos',
  'Problema técnico/bug',
  'Consulta de estado',
  'Upgrade/downgrade de plan',
  'Cancelación/reembolso',
  'Otro',
];

// Categorías que nunca se responden en automático, sin importar la confianza.
export const CATEGORIAS_SENSIBLES = new Set(['Cancelación/reembolso']);

// Sección de la KB que se consulta por defecto para cada categoría.
export const SECCION_POR_CATEGORIA = {
  'Reset de contraseña': 'RESET DE CONTRASEÑA',
  'Problema de facturación': 'CONSULTA DE FACTURA',
  'Cambios administrativos': 'CAMBIO DE DATOS ADMINISTRATIVOS',
  'Problema técnico/bug': 'PROBLEMAS DE ACCESO / LOGIN',
  'Consulta de estado': 'ESTADO DEL SERVICIO / INCIDENTES',
  'Upgrade/downgrade de plan': 'UPGRADE / DOWNGRADE DE PLAN',
  'Cancelación/reembolso': 'CANCELACIONES Y REEMBOLSOS',
  Otro: null,
};

// Palabras clave que afinan la sección cuando el texto es más específico que la categoría.
export const SECCION_POR_PALABRA_CLAVE = [
  { patron: /integraci|endpoint|\bapi\b|salesforce|hubspot|webhook/i, seccion: 'INTEGRACIONES Y API' },
  { patron: /duplicad|cobro|pago rechazado|tarjeta|pasarela/i, seccion: 'PROBLEMAS CON PAGOS / PASARELA' },
  { patron: /raz[oó]n social|\brut\b|direcci[oó]n fiscal/i, seccion: 'CAMBIO DE DATOS ADMINISTRATIVOS' },
  { patron: /contrase[ñn]a|password/i, seccion: 'RESET DE CONTRASEÑA' },
];
