# Meraki, copiloto multiagente de atención al cliente

Copiloto de soporte para un SaaS B2B que recibe unos **3.000 tickets por mes**. Clasifica cada ticket, consulta el CRM y la base de conocimiento, y lo deriva al agente que corresponde, con una persona aprobando lo sensible.

> Proyecto grupal de Aplicaciones de IA a los Negocios, Licenciatura en Negocios Digitales, Universidad ORT Uruguay, 2026. Cliente ficticio: MercadoSur Tech.

**[Ver el video de la demo completa](https://drive.google.com/file/d/1wMIsEQ7Me_zeRFJm96U0wbQIbRS0SMe6/view)** · **[Probar el MVP](https://v0-meraki-mvp-project.vercel.app)**

## Cómo funciona

- **Orquestación semántica** sobre Claude 3.5 Haiku y Sonnet: el modelo chico clasifica y el grande resuelve los casos complejos.
- **Herramientas MCP** para consultar el CRM y la base de conocimiento (RAG).
- **Control de acceso por rol:** Operador L1 y Supervisor L1.5 ven y pueden hacer cosas distintas.
- **Guardrails con humano en el circuito:**
  - Bloquea los reembolsos autónomos.
  - Escala las cancelaciones.
  - Detecta intentos de jailbreak.
- **Dos modos:** simulación local y determinística para probar sin llamadas en vivo, y un modo producción ya diseñado.

## Diseño responsable

Pensado para cumplir la **Ley 18.331** de protección de datos personales de Uruguay, y **GDPR** y **LGPD** para clientes de la región.

## Caso de negocio

| | Antes | Con Meraki |
|---|---|---|
| Operadores L1 | 5 | 2 |
| Costo mensual | USD 6.500 | USD 3.733 |
| Ahorro mensual | | USD 2.767 |
| Recupero de una inversión de USD 12.000 | | 4,3 meses |

## La demo

El MVP tiene un formulario de ticket con:
- ID de cliente
- categoría: facturación, envíos, productos y devoluciones, acceso a la cuenta, soporte técnico u otra
- descripción del problema

Un panel muestra la clasificación y el agente asignado. Incluye 16 casos de prueba, entre ellos cancelaciones, contraseñas, facturas, cobros duplicados, cambios de plan, caídas de servicio y webhooks de la API.

## Stack

Claude API · MCP · RAG · v0 · Next.js · Vercel

---

**Romina Cor Castro** · [LinkedIn](https://www.linkedin.com/in/rominacor/)
