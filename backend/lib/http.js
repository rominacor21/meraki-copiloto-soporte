// Utilidades HTTP compartidas por los endpoints (compatibles con Vercel Functions y con server.js).

export async function leerJSON(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let crudo = '';
  for await (const parte of req) crudo += parte;
  return crudo ? JSON.parse(crudo) : {};
}

export function enviarJSON(res, status, data) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('access-control-allow-origin', process.env.CORS_ORIGIN ?? '*');
  res.end(JSON.stringify(data));
}

export function soloMetodo(req, res, metodo) {
  if (req.method === metodo) return true;
  enviarJSON(res, 405, { error: `Usá ${metodo}` });
  return false;
}

export function parametros(req) {
  return Object.fromEntries(new URL(req.url, 'http://localhost').searchParams);
}
