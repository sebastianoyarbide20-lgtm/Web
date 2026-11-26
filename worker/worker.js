// Worker de ALIAR ROSARIO: sirve la web estática y recibe las postulaciones en /api/postular.
// Guarda cada postulación en KV (binding POSTULACIONES) y, además, intenta avisar por correo con FormSubmit.
const CORREO = 'proyectoalianzayrespaldo@gmail.com';
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/postular') return env.ASSETS.fetch(request);
    if (request.method !== 'POST') return json({ ok: false, error: 'Método no permitido' }, 405);

    let form;
    try { form = await request.formData(); } catch { return json({ ok: false, error: 'Datos inválidos' }, 400); }
    if (form.get('_honey')) return json({ ok: true }); // robot: se ignora sin avisar

    const datos = {};
    for (const [k, v] of form.entries()) if (!k.startsWith('_') && typeof v === 'string') datos[k] = v.slice(0, 300);
    if (!datos.nombre || !datos.farmacia || !datos.whatsapp) return json({ ok: false, error: 'Faltan datos' }, 400);

    const registro = { recibido: new Date().toISOString(), ...datos };
    await env.POSTULACIONES.put(`postulacion:${registro.recibido}:${crypto.randomUUID().slice(0, 8)}`, JSON.stringify(registro));

    // Aviso por correo (mejor esfuerzo: si falla o tarda, la postulación igual quedó guardada).
    const aviso = new FormData();
    for (const [k, v] of Object.entries(datos)) aviso.append(k, v);
    aviso.append('_subject', 'Nueva postulación de Farmacia Fundadora · ALIAR ROSARIO');
    aviso.append('_template', 'table');
    aviso.append('_captcha', 'false');
    ctx.waitUntil(
      fetch(`https://formsubmit.co/ajax/${CORREO}`, { method: 'POST', body: aviso, headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(8000) }).catch(() => {})
    );
    return json({ ok: true });
  },
};
