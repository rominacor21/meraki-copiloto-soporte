# Contrato de la API

## MVP publicado: `POST /api/procesar`

Vive en `frontend/app/api/procesar/route.ts` (Next.js Route Handler en Vercel).

**Request**

```json
{ "clienteId": "CLI-2024-103", "categoria": "cuenta", "mensaje": "Me olvidé la contraseña" }
```

**Response**

```json
{
  "agente": "resolvedor",
  "categoria": "Acceso / Cuenta",
  "urgencia": "media",
  "confianza": 0.93,
  "es_rutinario": true,
  "respuesta_cliente": "Hola! Para recuperar tu acceso andá a app.mercadosur.com/reset…",
  "nota_operador": ""
}
```

| Campo | Valores |
|---|---|
| `agente` | `resolvedor` para casos rutinarios que se responden solos; `copiloto` para casos sensibles que asiste a un operador |
| `urgencia` | `alta`, `media`, `baja` |
| `confianza` | 0 a 1; el caso sin categoría clara vuelve con 0,65 y nota de revisión manual |
| `nota_operador` | Instrucción para la persona cuando el caso es sensible (cancelación, cobro duplicado, API) |

Errores: `400` si falta `mensaje`, `500` con `error` y `details` si falla el procesamiento.

## MVP 2.0: API de tickets

Vive en `backend/`. Detalle de cada endpoint en el README y en [requerimientos_mvp2.md](requerimientos_mvp2.md).

| Método | Endpoint |
|---|---|
| POST | `/api/procesar-ticket` |
| GET | `/api/tickets` |
| GET | `/api/ticket/:id` |
| POST | `/api/enviar-email` |
| POST | `/api/feedback` |
