// Guardrails que se evalúan antes de generar cualquier respuesta.

const JAILBREAK = [
  /ignor(a|á|e) (todas )?(las|tus) instrucciones/i,
  /olvid(a|á) (tus|las) reglas/i,
  /act(u|ú)a como (si fueras )?(un )?admin/i,
  /system prompt|prompt del sistema/i,
  /mostrame (tu|el) prompt/i,
];

export function detectarJailbreak(texto) {
  return JAILBREAK.some((p) => p.test(texto));
}
