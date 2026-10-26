import { NextRequest, NextResponse } from "next/server";

interface TicketResponse {
  agente: string;
  categoria: string;
  urgencia: string;
  confianza: number;
  es_rutinario: boolean;
  respuesta_cliente: string;
  nota_operador: string;
}

// Mock responses based on keyword matching
const mockResponses: {
  keywords: string[];
  response: TicketResponse;
}[] = [
  {
    // CANCELACION
    keywords: ["cancelar", "cancelación", "cancelacion", "baja", "dar de baja", "discontinuar", "rescindir"],
    response: {
      agente: "copiloto",
      categoria: "Cancelación",
      urgencia: "alta",
      confianza: 0.95,
      es_rutinario: false,
      respuesta_cliente: "Hola, entendemos tu solicitud. Un ejecutivo de cuenta se va a comunicar con vos en las próximas 24 horas para acompañarte en el proceso de baja.",
      nota_operador: "⚠️ Cliente quiere cancelar. NO confirmar baja ni reembolso. Derivar a equipo de retención inmediatamente.",
    },
  },
  {
    // CONTRASEÑA / ACCESO
    keywords: ["contraseña", "contrasena", "password", "no puedo entrar", "acceso", "login", "olvidé", "olvide"],
    response: {
      agente: "resolvedor",
      categoria: "Acceso / Cuenta",
      urgencia: "media",
      confianza: 0.93,
      es_rutinario: true,
      respuesta_cliente: "Hola! Para recuperar tu acceso andá a app.mercadosur.com/reset, ingresá tu email corporativo y seguí los pasos. El link vence en 24hs. Si no te llega el email revisá la carpeta de spam.",
      nota_operador: "",
    },
  },
  {
    // FACTURA
    keywords: ["factura", "facturación", "facturacion", "comprobante", "recibo", "cobro"],
    response: {
      agente: "resolvedor",
      categoria: "Facturación",
      urgencia: "baja",
      confianza: 0.91,
      es_rutinario: true,
      respuesta_cliente: "Hola! Podés descargar tu factura desde app.mercadosur.com/facturacion. Se generan el día 1 de cada mes. Si necesitás reenvío por email avisanos respondiendo este mensaje.",
      nota_operador: "",
    },
  },
  {
    // PLAN / UPGRADE
    keywords: ["plan", "upgrade", "cambiar plan", "mejorar", "más usuarios", "mas usuarios", "más storage", "mas storage"],
    response: {
      agente: "resolvedor",
      categoria: "Plan / Upgrade",
      urgencia: "baja",
      confianza: 0.88,
      es_rutinario: true,
      respuesta_cliente: "Hola! Podés hacer el upgrade directamente desde Configuración → Mi Plan dentro de la app. Los planes disponibles son: Starter (50 usuarios, 10GB), Growth (200 usuarios, 50GB) y Enterprise (ilimitado, soporte 24/7). ¿Necesitás más info sobre alguno?",
      nota_operador: "",
    },
  },
  {
    // INCIDENTE / CAIDA
    keywords: ["caída", "caida", "no funciona", "caído", "caido", "error", "no carga", "incidente", "lento"],
    response: {
      agente: "resolvedor",
      categoria: "Incidente / Estado del servicio",
      urgencia: "alta",
      confianza: 0.89,
      es_rutinario: true,
      respuesta_cliente: "Hola! Podés ver el estado en tiempo real del servicio en status.mercadosur.com. Si hay un incidente activo vas a encontrar ahí el detalle y tiempo estimado de resolución. Te avisamos por email cuando se normalice.",
      nota_operador: "",
    },
  },
  {
    // COBRO DUPLICADO / PAGO
    keywords: ["cobro doble", "me cobraron dos veces", "duplicado", "cargo incorrecto", "reembolso"],
    response: {
      agente: "copiloto",
      categoria: "Pago / Cobro duplicado",
      urgencia: "alta",
      confianza: 0.92,
      es_rutinario: false,
      respuesta_cliente: "Hola, recibimos tu reclamo por el cobro. Estamos revisando el caso con el equipo de finanzas y te respondemos en menos de 48 horas con el detalle.",
      nota_operador: "⚠️ Reclamo de cobro duplicado. Derivar a finanzas con el comprobante. NO prometer reversión inmediata.",
    },
  },
  {
    // INTEGRACION / API
    keywords: ["API", "api", "webhook", "integración", "integracion", "token", "endpoint", "SDK", "sdk"],
    response: {
      agente: "copiloto",
      categoria: "Integración técnica",
      urgencia: "media",
      confianza: 0.85,
      es_rutinario: false,
      respuesta_cliente: "Hola! Recibimos tu consulta técnica. Un especialista de soporte nivel 2 va a revisarla y te contacta en menos de 4 horas si tenés plan Enterprise, o 24 horas para Growth y Starter.",
      nota_operador: "Derivar a soporte técnico nivel 2. Pedir logs del error al cliente antes de escalar.",
    },
  },
  {
    // DATOS ADMINISTRATIVOS
    keywords: ["cambiar datos", "razón social", "razon social", "RUT", "rut", "dirección fiscal", "direccion fiscal", "datos de facturación", "datos de facturacion"],
    response: {
      agente: "resolvedor",
      categoria: "Datos administrativos",
      urgencia: "baja",
      confianza: 0.87,
      es_rutinario: true,
      respuesta_cliente: "Hola! Podés actualizar razón social, RUT y dirección fiscal desde Configuración → Datos de facturación dentro de la app. Los cambios se reflejan en la próxima factura. Las facturas ya emitidas no se pueden modificar.",
      nota_operador: "",
    },
  },
];

// Fallback response for unmatched tickets
const fallbackResponse: TicketResponse = {
  agente: "copiloto",
  categoria: "Consulta general",
  urgencia: "media",
  confianza: 0.65,
  es_rutinario: false,
  respuesta_cliente: "Hola! Recibimos tu consulta y la estamos derivando al equipo correspondiente. Te respondemos a la brevedad.",
  nota_operador: "Revisar manualmente. No entra en categoría estándar, requiere análisis humano.",
};

function classifyTicket(mensaje: string): TicketResponse {
  const lowerMessage = mensaje.toLowerCase();

  // Check each category for keyword matches
  for (const mock of mockResponses) {
    for (const keyword of mock.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return mock.response;
      }
    }
  }

  // Return fallback if no match
  return fallbackResponse;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mensaje } = body;

    if (!mensaje) {
      return NextResponse.json({ error: "El mensaje es requerido" }, { status: 400 });
    }

    // Classify ticket using keyword matching
    const response = classifyTicket(mensaje);

    // Add small delay to simulate processing (100-300ms)
    await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200));

    return NextResponse.json(response);
  } catch (error) {
    const err = error as Error;
    console.error("[v0] Error processing request:", err.message);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
