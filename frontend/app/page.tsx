"use client";

import { useState } from "react";

interface TicketResponse {
  categoria: string;
  urgencia: string;
  confianza: number;
  es_rutinario: boolean;
  agente: string;
  respuesta_cliente: string;
  nota_operador: string;
  error?: string;
  details?: string;
}

const ejemplos = {
  // CANCELACION (Copiloto)
  cancelacion1: {
    clienteId: "CLI-2024-101",
    categoria: "otro",
    mensaje: "Quiero cancelar el servicio definitivamente, no nos sirve más",
    badge: "Copiloto",
    badgeColor: "blue",
  },
  cancelacion2: {
    clienteId: "CLI-2024-102",
    categoria: "otro",
    mensaje: "Necesito dar de baja la cuenta, migramos a otro proveedor",
    badge: "Copiloto",
    badgeColor: "blue",
  },
  // CONTRASEÑA (Resolvedor)
  password1: {
    clienteId: "CLI-2024-103",
    categoria: "cuenta",
    mensaje: "Me olvidé la contraseña y necesito entrar urgente",
    badge: "Resolvedor",
    badgeColor: "green",
  },
  password2: {
    clienteId: "CLI-2024-104",
    categoria: "cuenta",
    mensaje: "No puedo hacer login, me dice que mis credenciales son incorrectas",
    badge: "Resolvedor",
    badgeColor: "green",
  },
  // FACTURA (Resolvedor)
  factura1: {
    clienteId: "CLI-2024-105",
    categoria: "facturacion",
    mensaje: "Necesito la factura de abril para mi contador",
    badge: "Resolvedor",
    badgeColor: "green",
  },
  factura2: {
    clienteId: "CLI-2024-106",
    categoria: "facturacion",
    mensaje: "No encuentro el comprobante de pago del mes pasado",
    badge: "Resolvedor",
    badgeColor: "green",
  },
  // PLAN / UPGRADE (Resolvedor)
  plan1: {
    clienteId: "CLI-2024-107",
    categoria: "otro",
    mensaje: "Necesitamos agregar más usuarios al plan actual",
    badge: "Resolvedor",
    badgeColor: "green",
  },
  plan2: {
    clienteId: "CLI-2024-108",
    categoria: "otro",
    mensaje: "El plan Starter nos quedó chico, ¿cómo hacemos el upgrade?",
    badge: "Resolvedor",
    badgeColor: "green",
  },
  // INCIDENTE (Resolvedor)
  incidente1: {
    clienteId: "CLI-2024-109",
    categoria: "tecnico",
    mensaje: "La plataforma está caída desde hace una hora",
    badge: "Resolvedor",
    badgeColor: "green",
  },
  incidente2: {
    clienteId: "CLI-2024-110",
    categoria: "tecnico",
    mensaje: "No carga el dashboard, da error 502",
    badge: "Resolvedor",
    badgeColor: "green",
  },
  // COBRO DUPLICADO (Copiloto)
  cobro1: {
    clienteId: "CLI-2024-111",
    categoria: "facturacion",
    mensaje: "Me cobraron dos veces el mismo mes",
    badge: "Copiloto",
    badgeColor: "blue",
  },
  cobro2: {
    clienteId: "CLI-2024-112",
    categoria: "facturacion",
    mensaje: "Quiero el reembolso de un cobro incorrecto",
    badge: "Copiloto",
    badgeColor: "blue",
  },
  // INTEGRACION / API (Copiloto)
  api1: {
    clienteId: "CLI-2024-113",
    categoria: "tecnico",
    mensaje: "Los webhooks dejaron de funcionar después de la actualización",
    badge: "Copiloto",
    badgeColor: "blue",
  },
  api2: {
    clienteId: "CLI-2024-114",
    categoria: "tecnico",
    mensaje: "El token de API expiró y no sé cómo renovarlo",
    badge: "Copiloto",
    badgeColor: "blue",
  },
  // DATOS ADMINISTRATIVOS (Resolvedor)
  datos1: {
    clienteId: "CLI-2024-115",
    categoria: "facturacion",
    mensaje: "Necesito actualizar el RUT de la empresa",
    badge: "Resolvedor",
    badgeColor: "green",
  },
  datos2: {
    clienteId: "CLI-2024-116",
    categoria: "facturacion",
    mensaje: "Cambiamos la razón social y hay que actualizar los datos",
    badge: "Resolvedor",
    badgeColor: "green",
  },
};

export default function MerakiPage() {
  const [clienteId, setClienteId] = useState("");
  const [categoria, setCategoria] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TicketResponse | null>(null);
  const [elapsedTime, setElapsedTime] = useState("");

  const loadExample = (tipo: keyof typeof ejemplos) => {
    const ejemplo = ejemplos[tipo];
    setClienteId(ejemplo.clienteId);
    setCategoria(ejemplo.categoria);
    setMensaje(ejemplo.mensaje);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResult(null);

    const startTime = Date.now();

    try {
      const response = await fetch("/api/procesar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clienteId, categoria, mensaje }),
      });

      const data = await response.json();
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      setElapsedTime(elapsed);

      if (!response.ok && !data.agente) {
        throw new Error(data.error || data.details || `Error ${response.status}`);
      }

      setResult(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isResolvedor = result?.agente === "resolvedor" || result?.categoria === "resolvedor";
  const confidencePercent = result ? Math.round((result.confianza || 0) * 100) : 0;
  const urgency = (result?.urgencia || "media").toLowerCase();

  const getCategoriaLabel = () => {
    const labels: Record<string, string> = {
      facturacion: "Facturacion",
      envio: "Envios",
      producto: "Productos",
      cuenta: "Cuenta",
      tecnico: "Tecnico",
      otro: "Otro",
    };
    return labels[categoria] || categoria;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12 py-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-2xl flex items-center justify-center text-3xl">
              🤖
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">
              MERAKI
            </h1>
          </div>
          <p className="text-slate-400 text-lg">Copiloto Inteligente de Atencion al Cliente</p>
          <span className="inline-block bg-slate-800 px-4 py-2 rounded-full text-sm text-slate-400 mt-4 border border-slate-600">
            MercadoSur Tech - Demo MVP
          </span>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-slate-800 rounded-3xl p-6 border border-slate-600">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-600">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center text-xl">
                📝
              </div>
              <h3 className="text-lg font-semibold">Nuevo Ticket de Soporte</h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block mb-2 font-medium text-sm">ID del Cliente</label>
                <input
                  type="text"
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  placeholder="Ej: CLI-2024-001"
                  required
                  className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-xl text-[#f8fafc] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="mb-5">
                <label className="block mb-2 font-medium text-sm">Categoria del Problema</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  required
                  className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-xl text-[#f8fafc] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                  <option value="">Selecciona una categoria...</option>
                  <option value="facturacion">Facturacion y Pagos</option>
                  <option value="envio">Envios y Entregas</option>
                  <option value="producto">Productos y Devoluciones</option>
                  <option value="cuenta">Cuenta y Acceso</option>
                  <option value="tecnico">Soporte Tecnico</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="mb-5">
                <label className="block mb-2 font-medium text-sm">Descripcion del Problema</label>
                <textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Describe el problema del cliente con el mayor detalle posible..."
                  required
                  className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-xl text-[#f8fafc] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 min-h-32 resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-4 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <span>Analizando...</span>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </>
                ) : (
                  <span>Analizar con IA</span>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-xl text-red-500">
                {error}
              </div>
            )}

            {/* Examples */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4 text-sm text-slate-400">
                <span>Ejemplos de Prueba (16 casos)</span>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {/* Cancelacion - Copiloto */}
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide pt-2">Cancelacion</div>
                <button
                  type="button"
                  onClick={() => loadExample("cancelacion1")}
                  className="w-full text-left bg-[#0f172a] border border-slate-600 rounded-xl p-3 hover:border-blue-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium">Cancelar servicio</h5>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Copiloto</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{ejemplos.cancelacion1.mensaje}</p>
                </button>
                <button
                  type="button"
                  onClick={() => loadExample("cancelacion2")}
                  className="w-full text-left bg-[#0f172a] border border-slate-600 rounded-xl p-3 hover:border-blue-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium">Dar de baja cuenta</h5>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Copiloto</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{ejemplos.cancelacion2.mensaje}</p>
                </button>

                {/* Contrasena - Resolvedor */}
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide pt-3">Contrasena / Acceso</div>
                <button
                  type="button"
                  onClick={() => loadExample("password1")}
                  className="w-full text-left bg-[#0f172a] border border-slate-600 rounded-xl p-3 hover:border-green-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium">Olvide contrasena</h5>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Resolvedor</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{ejemplos.password1.mensaje}</p>
                </button>
                <button
                  type="button"
                  onClick={() => loadExample("password2")}
                  className="w-full text-left bg-[#0f172a] border border-slate-600 rounded-xl p-3 hover:border-green-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium">Error de login</h5>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Resolvedor</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{ejemplos.password2.mensaje}</p>
                </button>

                {/* Factura - Resolvedor */}
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide pt-3">Facturacion</div>
                <button
                  type="button"
                  onClick={() => loadExample("factura1")}
                  className="w-full text-left bg-[#0f172a] border border-slate-600 rounded-xl p-3 hover:border-green-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium">Solicitar factura</h5>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Resolvedor</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{ejemplos.factura1.mensaje}</p>
                </button>
                <button
                  type="button"
                  onClick={() => loadExample("factura2")}
                  className="w-full text-left bg-[#0f172a] border border-slate-600 rounded-xl p-3 hover:border-green-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium">Buscar comprobante</h5>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Resolvedor</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{ejemplos.factura2.mensaje}</p>
                </button>

                {/* Cobro duplicado - Copiloto */}
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide pt-3">Cobro Duplicado</div>
                <button
                  type="button"
                  onClick={() => loadExample("cobro1")}
                  className="w-full text-left bg-[#0f172a] border border-slate-600 rounded-xl p-3 hover:border-blue-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium">Cobro doble</h5>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Copiloto</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{ejemplos.cobro1.mensaje}</p>
                </button>
                <button
                  type="button"
                  onClick={() => loadExample("cobro2")}
                  className="w-full text-left bg-[#0f172a] border border-slate-600 rounded-xl p-3 hover:border-blue-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium">Solicitar reembolso</h5>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Copiloto</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{ejemplos.cobro2.mensaje}</p>
                </button>

                {/* Plan / Upgrade - Resolvedor */}
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide pt-3">Plan / Upgrade</div>
                <button
                  type="button"
                  onClick={() => loadExample("plan1")}
                  className="w-full text-left bg-[#0f172a] border border-slate-600 rounded-xl p-3 hover:border-green-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium">Agregar usuarios</h5>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Resolvedor</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{ejemplos.plan1.mensaje}</p>
                </button>
                <button
                  type="button"
                  onClick={() => loadExample("plan2")}
                  className="w-full text-left bg-[#0f172a] border border-slate-600 rounded-xl p-3 hover:border-green-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium">Hacer upgrade</h5>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Resolvedor</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{ejemplos.plan2.mensaje}</p>
                </button>

                {/* Incidente - Resolvedor */}
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide pt-3">Incidente / Caida</div>
                <button
                  type="button"
                  onClick={() => loadExample("incidente1")}
                  className="w-full text-left bg-[#0f172a] border border-slate-600 rounded-xl p-3 hover:border-green-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium">Plataforma caida</h5>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Resolvedor</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{ejemplos.incidente1.mensaje}</p>
                </button>
                <button
                  type="button"
                  onClick={() => loadExample("incidente2")}
                  className="w-full text-left bg-[#0f172a] border border-slate-600 rounded-xl p-3 hover:border-green-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium">Error 502</h5>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Resolvedor</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{ejemplos.incidente2.mensaje}</p>
                </button>

                {/* API / Integracion - Copiloto */}
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide pt-3">Integracion / API</div>
                <button
                  type="button"
                  onClick={() => loadExample("api1")}
                  className="w-full text-left bg-[#0f172a] border border-slate-600 rounded-xl p-3 hover:border-blue-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium">Webhooks no funcionan</h5>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Copiloto</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{ejemplos.api1.mensaje}</p>
                </button>
                <button
                  type="button"
                  onClick={() => loadExample("api2")}
                  className="w-full text-left bg-[#0f172a] border border-slate-600 rounded-xl p-3 hover:border-blue-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium">Token API expirado</h5>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Copiloto</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{ejemplos.api2.mensaje}</p>
                </button>

                {/* Datos Administrativos - Resolvedor */}
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide pt-3">Datos Administrativos</div>
                <button
                  type="button"
                  onClick={() => loadExample("datos1")}
                  className="w-full text-left bg-[#0f172a] border border-slate-600 rounded-xl p-3 hover:border-green-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium">Actualizar RUT</h5>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Resolvedor</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{ejemplos.datos1.mensaje}</p>
                </button>
                <button
                  type="button"
                  onClick={() => loadExample("datos2")}
                  className="w-full text-left bg-[#0f172a] border border-slate-600 rounded-xl p-3 hover:border-green-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium">Cambiar razon social</h5>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Resolvedor</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{ejemplos.datos2.mensaje}</p>
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-slate-800 rounded-3xl p-6 border border-slate-600">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-600">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center text-xl">
                🎯
              </div>
              <h3 className="text-lg font-semibold">Analisis del Copiloto</h3>
            </div>

            {!result ? (
              <div className="text-center py-12 text-slate-400">
                <div className="text-6xl mb-4">🤖</div>
                <p>Envia un ticket para ver el analisis inteligente</p>
                <p className="text-sm mt-2">El sistema clasificara y asignara al agente adecuado</p>
              </div>
            ) : (
              <div>
                {/* Agent Card */}
                <div
                  className={`rounded-2xl p-6 mb-6 ${
                    isResolvedor
                      ? "bg-gradient-to-br from-green-500/10 to-green-500/5 border-2 border-green-500"
                      : "bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-2 border-blue-500"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        isResolvedor ? "bg-green-500/20" : "bg-blue-500/20"
                      }`}
                    >
                      {isResolvedor ? "✅" : "👤"}
                    </div>
                    <div>
                      <div
                        className={`text-xl font-bold ${
                          isResolvedor ? "text-green-400" : "text-blue-400"
                        }`}
                      >
                        {isResolvedor ? "Agente Resolvedor" : "Agente Copiloto"}
                      </div>
                      <div className="text-sm text-slate-400">
                        {isResolvedor
                          ? "Caso rutinario - Respuesta automatica lista para enviar"
                          : "Caso complejo - Requiere revision de operador humano"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex gap-4 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] rounded-full text-sm border border-slate-600">
                    <span className="text-slate-400">Confianza:</span>
                    <span className="font-semibold">{confidencePercent}%</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] rounded-full text-sm border border-slate-600">
                    <span className="text-slate-400">Urgencia:</span>
                    <span
                      className={`font-semibold ${
                        urgency === "alta"
                          ? "text-red-500"
                          : urgency === "media"
                          ? "text-amber-500"
                          : "text-green-500"
                      }`}
                    >
                      {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Response Box */}
                <div
                  className={`bg-[#0f172a] rounded-xl p-5 mb-4 border-l-4 ${
                    isResolvedor ? "border-green-500" : "border-blue-500"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-3 ${
                      isResolvedor ? "text-green-400" : "text-blue-400"
                    }`}
                  >
                    <span>{isResolvedor ? "✅" : "📝"}</span>
                    <span>{isResolvedor ? "Respuesta Final al Cliente" : "Borrador para Revision"}</span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {result.respuesta_cliente}
                  </p>
                </div>

                {/* Operator Note (only for Copiloto) */}
                {!isResolvedor && result.nota_operador && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-amber-400 mb-3">
                      <span>📋</span>
                      <span>Nota para el Operador</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{result.nota_operador}</p>
                  </div>
                )}

                {/* Stats */}
                <div className="flex gap-4 mt-6 pt-6 border-t border-slate-600">
                  <div className="flex-1 text-center p-3 bg-[#0f172a] rounded-xl">
                    <div className="text-2xl font-bold text-indigo-500">{elapsedTime}s</div>
                    <div className="text-xs text-slate-400 mt-1">Tiempo de Analisis</div>
                  </div>
                  <div className="flex-1 text-center p-3 bg-[#0f172a] rounded-xl">
                    <div className="text-2xl font-bold text-indigo-500">{getCategoriaLabel()}</div>
                    <div className="text-xs text-slate-400 mt-1">Categoria</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 text-slate-400 text-sm">
          <p>MERAKI MVP 2024 | Desarrollado para MercadoSur Tech</p>
          <p className="mt-2">Sistema de clasificacion inteligente de tickets</p>
        </footer>
      </div>
    </div>
  );
}
