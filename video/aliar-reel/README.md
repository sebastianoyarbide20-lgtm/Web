# Reel ALIAR ROSARIO · «Cuatro farmacias, una red»

Video publicitario vertical para redes (Instagram Reels / Stories, TikTok, YouTube Shorts)
de la convocatoria de **Farmacias Fundadoras**. Hecho con [HyperFrames](https://hyperframes.heygen.com)
(HTML → video) siguiendo la guía de estilos «Barrio pop» v2.0 (`docs/guia-de-estilos/`).

| | |
|---|---|
| Archivo final | `renders/aliar-rosario-fundadoras-9x16.mp4` |
| Formato | 1080 × 1920 (9:16), 30 fps, H.264 + AAC, 26 s |
| Público | Dueñas y dueños de farmacias de barrio de Rosario (B2B) |
| Llamado | «Postular mi farmacia» · inscripción hasta el 10 de diciembre · lanzamiento 1.º de enero de 2027 |

## Guion (26 s, 120 BPM)

| Tiempo | Escena | Qué pasa |
|---|---|---|
| 0–4 s | `hook` | «Las cadenas tienen app, web y envíos.» → «¿Y tu farmacia de barrio?» Cae la farmacia sola. |
| 4–10 s | `red` | «Sola, no llega a todo.» → llegan farmacias de Fisherton, Echesortu y Alberdi, se arma la cruz y se vuelve el isotipo («el punto es la red»). |
| 10–12 s | `online` | «Vendé online.» + tarjeta «¡Pedido nuevo! Del Parque · retiro 18 h». |
| 12–14 s | `recetas` | «Cotizá recetas por WhatsApp.» + «Receta cotizada». |
| 14–16 s | `barrios` | «Llegá a más vecinos.» + cinta de barrios del piloto. |
| 16–18 s | `duenio` | «Vos seguís siendo el único dueño.» + Tu negocio / Tu mostrador / Tus clientes. |
| 18–21 s | `costo` | «0 % costo fijo. Solo pagás cuando concretás una venta.» |
| 21–26 s | `cierre` | Logo, «Inscripción hasta el 10 de diciembre», «Sumate como Farmacia Fundadora», botón «Postular mi farmacia», «Lanzamiento: 1.º de enero de 2027». |

## Cómo editar y volver a renderizar

Requiere Node.js 22+ y FFmpeg. Desde esta carpeta:

```bash
npm run dev      # vista previa editable en el navegador (HyperFrames Studio)
npm run check    # lint + diseño + contraste + lectura
npm run render   # exporta a renders/
```

- **Textos del cierre** (fecha límite, botón, lanzamiento): son variables de la escena `cierre`; se cambian en
  `data-variable-values` del host `#cierre` en `index.html`.
- **Resto de los textos:** en cada archivo de `compositions/`.
- **Música:** base sintetizada en código (`audio-src/score.js`). Para regenerarla:
  `node audio-src/render-score.cjs /tmp/musica.wav` y convertir a `assets/audio/musica.mp3`.
  Si tienen un tema propio o con licencia, reemplacen `assets/audio/musica.mp3` (120 BPM encaja con los cortes).
- **Efectos de sonido:** Pixabay Content License (uso comercial sin atribución), ver `assets/audio/sfx/CREDITS.md`.
- **Tipografías:** Bricolage Grotesque, Figtree y Caveat (SIL Open Font License) en `assets/fonts/`.
- **Íconos:** Lucide 0.469.0 (ISC), dibujados en línea dentro de las escenas.

`STORYLINES.md` tiene los tres guiones evaluados, `SPEC.md` las decisiones de diseño en números y
`REVIEW.md` la revisión del render.
