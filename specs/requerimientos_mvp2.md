# Requerimientos del MVP 2.0

Objetivo: automatizar la recepción y la respuesta de tickets por email con comprensión semántica, siempre con una persona validando antes de que la respuesta llegue al cliente.

**Entrada:** email a la cuenta de soporte o formulario manual.
**Salida:** respuesta lista para enviar y registro del ticket.
**Núcleo:** clasificación en 8 categorías, consulta a la base de conocimiento y respuesta contextual.

## Frontend

| Requerimiento | Detalle |
|---|---|
| Dashboard | Tabla en vivo con timestamp, remitente, categoría, urgencia, confianza y estado |
| Formulario manual | Para cargar tickets sin email, útil para testing |
| Logs en tiempo real | Cada paso: triaje, KB, CRM, respuesta |
| Indicador de estado | Verde procesado, amarillo requiere revisión, rojo error |
| Botón "Enviar respuesta" | El operador valida antes de que salga |
| Vista de KB | Qué sección se usó para resolver |
| Vista de cliente | Nombre, plan y estado de pago desde el CRM |
| Feedback | CSAT de 1 a 5 por ticket |

Stack previsto: Next.js + React en Vercel, React Query, Tailwind + shadcn/ui, React Hook Form.

## Backend

| Método | Endpoint | Qué hace |
|---|---|---|
| POST | `/api/procesar-ticket` | Recibe el ticket y devuelve categoría, urgencia, confianza, respuesta y notas |
| POST | `/api/enviar-email` | Envía la respuesta validada y marca el ticket como enviado |
| GET | `/api/tickets` | Lista paginada, con filtros por estado, categoría y fecha |
| GET | `/api/ticket/:id` | Detalle con todos los pasos del procesamiento |
| POST | `/api/feedback` | Registra el CSAT del ticket |

## Flujo de `/api/procesar-ticket`

1. **Triaje** con Claude Haiku: categoría, urgencia (Alta, Media, Baja) y confianza de 0 a 1.
2. **KB:** si la confianza es 0,7 o más y el caso es rutinario, se busca la sección relevante.
3. **CRM:** se busca al cliente por email para obtener plan, estado de pago e historial.
4. **Respuesta** con Claude Sonnet, usando categoría, KB y datos del cliente.
5. **Registro** en el log de tickets.
6. **Retorno** al frontend con el ticket completo.

## Las 8 categorías

1. Reset de contraseña
2. Problema de facturación
3. Cambios administrativos
4. Problema técnico/bug
5. Consulta de estado
6. Upgrade/downgrade de plan
7. Cancelación/reembolso
8. Otro

## Reglas clave

- **Comprensión semántica, no solo palabras clave:** "no puedo entrar" y "olvidé la contraseña" son casos distintos aunque los dos sean de acceso.
- **La confianza es la puerta de escalado:** con confianza menor a 0,7, o en categorías sensibles como cancelación o reembolso, no hay respuesta automática. El ticket vuelve con un borrador para que lo valide una persona.
- **Registro exhaustivo:** cada acción queda con timestamp, sección de KB y datos consultados, para auditoría y para entrenar versiones futuras.
- **Rate limits:** para pruebas se procesan pocos tickets; para escalar, batching o caché de respuestas similares.
- **Seguridad:** nada de credenciales en el código. Variables de entorno en Vercel y Service Account para las APIs de Google.

## Integraciones previstas

| Integración | Uso | Implementación |
|---|---|---|
| Gmail API | Entrada de tickets y envío de respuestas | Polling cada 5 minutos en `/api/check-emails` |
| Google Docs | Base de conocimiento, 9 secciones | Lectura con cache en memoria |
| Google Sheets | CRM piloto | Lookup por email |
| Google Sheets | Log de tickets | Una fila por ticket procesado |
