#!/usr/bin/env node
/**
 * ALIAR ROSARIO · Render de piezas para redes (HTML → PNG/JPG)
 *
 * Uso:
 *   node scripts/render.mjs publicaciones/AAAA-MM-DD-slug/pieza.html [--jpg] [--permitir-fuentes-respaldo]
 *
 * Cada elemento `.pieza` del HTML se exporta como una imagen en `export/` junto al HTML,
 * con el nombre de su atributo `data-nombre` (o `pieza-1`, `pieza-2`…). Un carrusel es un
 * HTML con varias `.pieza`.
 *
 * Antes de exportar revisa reglas de la guía de estilos y lista los problemas:
 *   - fuentes de marca cargadas (Bricolage Grotesque, Figtree, Caveat)
 *   - solo colores de la paleta
 *   - Coral solo en .btn--primario y .tag--urgente
 *   - como máximo un .btn--primario y un "!" por pieza
 *   - texto dentro del margen seguro (80 px; historias: 250 px arriba y abajo)
 *   - texto de al menos 24 px
 * Sale con código 1 si hay errores (las advertencias no frenan la exportación).
 */
import { createRequire } from 'node:module';
import { resolve, dirname, join, basename } from 'node:path';
import { mkdirSync, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch {
  console.error('Falta Playwright. Instalalo con:  npm install  (o  npm i -D playwright && npx playwright install chromium)');
  process.exit(1);
}

const args = process.argv.slice(2);
const file = args.find(a => !a.startsWith('--'));
const asJpg = args.includes('--jpg');
const allowFallbackFonts = args.includes('--permitir-fuentes-respaldo');
if (!file || !existsSync(file)) {
  console.error('Uso: node scripts/render.mjs <pieza.html> [--jpg] [--permitir-fuentes-respaldo]');
  process.exit(1);
}

const htmlPath = resolve(file);
const outDir = join(dirname(htmlPath), 'export');
mkdirSync(outDir, { recursive: true });

async function launch() {
  const opts = { headless: true };
  try { return await chromium.launch(opts); }
  catch { return await chromium.launch({ ...opts, channel: 'chrome' }); }
}

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 2100 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))));

const report = await page.evaluate(() => {
  const PALETA = ['#FFF9F0','#FBF1E3','#FFFFFF','#BFF0DA','#DDF8EB','#DDF57A','#B6DB2E','#E4DBFF','#FFEDB3',
    '#0D2B27','#3D5752','#E8DFD1','#0F766E','#0B4F49','#F97316','#FB8B3C','#FFE3D0','#B4410C','#C81E1E','#FFF1F1','#5E716C'];
  const CORAL = '#F97316';
  const toHex = c => {
    const m = c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
    if (!m) return null;
    if (m[4] !== undefined && parseFloat(m[4]) === 0) return null; // transparente
    return '#' + [m[1], m[2], m[3]].map(v => Math.round(+v).toString(16).padStart(2, '0')).join('').toUpperCase();
  };
  const fuentes = {
    'Bricolage Grotesque': document.fonts.check('800 40px "Bricolage Grotesque"'),
    'Figtree': document.fonts.check('400 40px "Figtree"'),
    'Caveat': document.fonts.check('700 40px "Caveat"'),
  };
  // document.fonts.check devuelve true si la familia no existe en el FontFaceSet; verificamos que haya cargado
  const cargadas = new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/"/g, '')));
  for (const k of Object.keys(fuentes)) fuentes[k] = cargadas.has(k);

  return [...document.querySelectorAll('.pieza')].map((pieza, i) => {
    const nombre = pieza.dataset.nombre || `pieza-${i + 1}`;
    const errores = [], avisos = [];
    const pr = pieza.getBoundingClientRect();
    const historia = pieza.classList.contains('pieza--historia');
    const tol = 10; // tolerancia: los stickers girados (−2° a −3°) asoman unos píxeles
    const mX = 80 - tol, mY = (historia ? 250 : 80) - tol;

    const fuera = new Set(), chicos = new Set(), colores = new Set(), coralMal = new Set();
    for (const el of [pieza, ...pieza.querySelectorAll('*')]) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      const deco = el.closest('[data-deco], .pagina');
      const props = [['color', cs.color], ['fondo', cs.backgroundColor], ['borde', cs.borderTopColor]];
      if (cs.borderTopWidth === '0px') props.pop();
      for (const [, v] of props) {
        const h = toHex(v); if (!h) continue;
        if (!PALETA.includes(h)) colores.add(`${h} en <${el.tagName.toLowerCase()} class="${el.className}">`);
        if (h === CORAL && !el.closest('.btn--primario, .tag--urgente')) coralMal.add(`<${el.tagName.toLowerCase()} class="${el.className}">`);
      }
      const tieneTexto = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (!tieneTexto || deco) continue;
      const fs = parseFloat(cs.fontSize);
      const muestra = el.textContent.trim().slice(0, 40);
      if (fs < 24) chicos.add(`${fs}px: "${muestra}"`);
      const r = el.getBoundingClientRect();
      if (r.left - pr.left < mX || pr.right - r.right < mX || r.top - pr.top < mY || pr.bottom - r.bottom < mY)
        fuera.add(`"${muestra}"`);
    }
    // Desborde del texto del contenedor
    if (pieza.scrollHeight > pieza.clientHeight + 2) errores.push(`El contenido no entra: mide ${pieza.scrollHeight}px de alto y la pieza ${pieza.clientHeight}px.`);

    const textoPlano = pieza.innerText;
    const excl = (textoPlano.match(/!/g) || []).length;
    const prim = pieza.querySelectorAll('.btn--primario').length;

    if (colores.size) errores.push('Colores fuera de la paleta: ' + [...colores].join('; '));
    if (coralMal.size) errores.push('Coral fuera de botón principal o urgencia: ' + [...coralMal].join('; '));
    if (prim > 1) errores.push(`Hay ${prim} botones principales; como máximo uno por pieza.`);
    if (excl > 1) errores.push(`Hay ${excl} signos "!"; como máximo uno por pieza.`);
    if (fuera.size) errores.push('Texto fuera del margen seguro: ' + [...fuera].join(', '));
    if (chicos.size) avisos.push('Texto menor a 24 px (solo vale en stickers muy cortos): ' + [...chicos].join(', '));
    if (/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/.test(textoPlano)) errores.push('Fecha en formato numérico; usá "1.º de enero de 2027".');
    if (/farmaglass/i.test(textoPlano)) errores.push('Aparece "FarmaGlass": el nombre vigente es ALIAR ROSARIO.');
    if (/aliar rosario/.test(textoPlano.replace(/ALIAR ROSARIO/g, ''))) avisos.push('El nombre de marca va siempre en mayúsculas: ALIAR ROSARIO.');
    if (/\b(cadena|franquicia|sucursal|usuarios|leads)\b/i.test(textoPlano)) avisos.push('Vocabulario a evitar (cadena, franquicia, sucursal, usuarios, leads): revisá si está bien usado.');
    return { nombre, errores, avisos, w: Math.round(pr.width), h: Math.round(pr.height) };
  }).concat([{ fuentes }]);
});

const { fuentes } = report.pop();
let hayErrores = false;
const usaNota = await page.$('.nota') !== null;
const faltan = Object.entries(fuentes)
  .filter(([f, ok]) => !ok && (f !== 'Caveat' || usaNota))
  .map(([f]) => f);
if (faltan.length) {
  const msg = `Fuentes de marca sin cargar: ${faltan.join(', ')} (¿sin conexión a Google Fonts?).`;
  if (allowFallbackFonts) console.warn('⚠️  ' + msg + ' Exportado como BORRADOR con fuentes de respaldo.');
  else { console.error('❌ ' + msg + '\n   Exportar así rompe la marca. Usá --permitir-fuentes-respaldo solo para borradores.'); hayErrores = true; }
}

const piezas = await page.$$('.pieza');
for (let i = 0; i < piezas.length; i++) {
  const r = report[i];
  console.log(`\n▸ ${r.nombre}  (${r.w}×${r.h})`);
  r.errores.forEach(e => console.log('  ❌ ' + e));
  r.avisos.forEach(a => console.log('  ⚠️  ' + a));
  if (!r.errores.length && !r.avisos.length) console.log('  ✅ Sin problemas detectados');
  if (r.errores.length) hayErrores = true;
  const out = join(outDir, `${r.nombre}.${asJpg ? 'jpg' : 'png'}`);
  await piezas[i].screenshot({ path: out, type: asJpg ? 'jpeg' : 'png', quality: asJpg ? 92 : undefined });
  console.log('  → ' + out.replace(process.cwd() + '/', ''));
}

await browser.close();
console.log(hayErrores
  ? `\nSe exportó ${basename(file)}, pero hay errores: corregilos antes de publicar.`
  : `\nListo: ${piezas.length} imagen(es) en ${outDir.replace(process.cwd() + '/', '')}. Falta el checklist humano de texto.md.`);
process.exit(hayErrores ? 1 : 0);
