// Cliente mínimo de la API de Anthropic (Messages API), sin dependencias.

import { config } from './config.js';

export async function llamarClaude({ modelo, prompt, maxTokens = 600 }) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': config.anthropicApiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: modelo,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Claude respondió ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content.map((b) => b.text ?? '').join('').trim();
}
