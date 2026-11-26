// Worker de ALIAR ROSARIO: sirve la web estática y maneja las postulaciones.
//   POST /api/postular        recibe el formulario y lo guarda en KV (binding POSTULACIONES)
//   GET  /api/postulaciones   lista lo guardado; exige el header x-clave = secreto ADMIN_PASSWORD
// La página privada para verlas está en /admin/ (admin/index.html).
// El secreto ADMIN_PASSWORD NO está en el repo: se define como binding secret_text al desplegar.
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } });

async function claveValida(recibida, esperada) {
  if (!esperada) return false;
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(recibida)), crypto.subtle.digest('SHA-256', enc.encode(esperada))]);
  return crypto.subtle.timingSafeEqual(a, b);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/postulaciones') {
      if (!(await claveValida(request.headers.get('x-clave') || '', env.ADMIN_PASSWORD))) {
        await new Promise((r) => setTimeout(r, 800));
        return json({ ok: false, error: 'Clave incorrecta' }, 401);
      }
      const claves = [];
      let cursor;
      do {
        const pagina = await env.POSTULACIONES.list({ prefix: 'postulacion:', cursor });
        claves.push(...pagina.keys.map((k) => k.name));
        cursor = pagina.list_complete ? undefined : pagina.cursor;
      } while (cursor);
      const items = [];
      for (let i = 0; i < claves.length; i += 25) {
        const lote = await Promise.all(claves.slice(i, i + 25).map((k) => env.POSTULACIONES.get(k, 'json')));
        items.push(...lote.filter(Boolean));
      }
      items.sort((x, y) => String(y.recibido).localeCompare(String(x.recibido)));
      return json({ ok: true, items });
    }

    if (url.pathname !== '/api/postular') return env.ASSETS.fetch(request);
    if (request.method !== 'POST') return json({ ok: false, error: 'Método no permitido' }, 405);

    let form;
    try { form = await request.formData(); } catch { return json({ ok: false, error: 'Datos inválidos' }, 400); }
    if (form.get('_honey')) return json({ ok: true }); // robot: se ignora sin avisar

    const datos = {};
    for (const [k, v] of form.entries()) if (!k.startsWith('_') && typeof v === 'string') datos[k] = v.slice(0, 300);
    if (!datos.nombre || !datos.farmacia || !datos.whatsapp) return json({ ok: false, error: 'Faltan datos' }, 400);

    const registro = { recibido: new Date().toISOString(), ...datos };
    await env.POSTULACIONES.put('postulacion:' + registro.recibido + ':' + crypto.randomUUID().slice(0, 8), JSON.stringify(registro));
    return json({ ok: true });
  },
};
