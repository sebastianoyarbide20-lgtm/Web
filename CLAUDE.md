# ALIAR ROSARIO · publicaciones en redes y landing

Repo de **ALIAR ROSARIO** (Alianza y Respaldo para farmacias independientes): una red que junta a las farmacias
de barrio de Rosario en una plataforma común. Se usa para producir **piezas para redes sociales** (uso principal)
y la landing de convocatoria. El nombre viejo del prototipo, "FarmaGlass", no se usa en ninguna pieza.

## Leer antes de crear cualquier pieza

1. `docs/guia-de-estilos/guia-de-estilos.md`: **fuente de verdad** de marca (logotipo, color, tipografía,
   componentes, movimiento, voz y tono, accesibilidad, checklist). El PDF es solo para humanos; las imágenes de
   referencia están en `docs/guia-de-estilos/img/`.
2. `docs/idea-de-negocio/idea-de-negocio.md`: qué es el negocio, públicos, diferencial y riesgos. Es un borrador:
   para nombres, textos y fechas manda la guía.

## Pedido de una publicación → skill `publicacion-redes`

Ante cualquier pedido de post, carrusel, historia, reel, campaña o texto para redes, cargá la skill
**`publicacion-redes`** y seguí su flujo: brief → texto → pieza → render con controles → `texto.md` con posteo,
texto alternativo y checklist.

| Formato | Herramienta |
|---|---|
| Post 1:1, carrusel, historia estática | **HTML → imagen**: plantillas en `publicaciones/_plantillas/`, estilos en `marca/publicacion.css`, render con `npm run render -- <pieza.html>` |
| Reel, historia animada, video | **HyperFrames** (único motor del proyecto; no usar Remotion) con la identidad de `design.md`, en 1080 × 1920 |
| Ajustes a las piezas de Canva ya existentes | Canva (links en la guía, 14.2). No crear piezas nuevas ahí. |

Las piezas nuevas se hacen en HTML y no en Canva porque así usan los tokens exactos, quedan versionadas en el
repo, se revisan automáticamente y comparten estilos con los videos.

## Reglas que no se negocian (resumen de la guía)

- **Coral `#F97316` solo** en el botón principal (texto en Tinta) y en señales de urgencia. Un botón principal por pieza.
- Fuentes **Bricolage Grotesque** (titulares) / **Figtree** (texto) / **Caveat** (una nota como máximo).
- Bordes de Tinta `#0D2B27` y **sombras sólidas desplazadas, sin desenfoque**. Fondo Crema o un pastel por pieza.
- **Voseo rioplatense**, claro antes que ingenioso, números concretos. Vocabulario de red: red, farmacia de barrio,
  vecinos, Farmacias Fundadoras. Nunca: cadena, franquicia, sucursal, usuarios, leads.
- Fechas "1.º de enero de 2027" · marca siempre **ALIAR ROSARIO** en mayúsculas · máximo un "!" por pieza ·
  emojis (1–2) solo en el texto del posteo.
- **Salud:** sin medicamentos de venta bajo receta ni promesas de salud en piezas al público. Si hay productos de
  salud, la pieza queda pendiente de validación del referente farmacéutico. Mencionar Santa Fe y ANMAT al hablar
  de recetas, envíos o venta online.
- **Imágenes:** nunca generadas con IA para representar farmacéuticos, farmacias o pacientes. Solo fotos reales y
  autorizadas; si no hay, la pieza va sin foto.
- Accesibilidad: contraste AA (solo combinaciones de la guía 4.4), texto alternativo en cada publicación y el
  mensaje clave también en el texto del posteo.
- Hitos vigentes: inscripción de Farmacias Fundadoras **hasta el 10 de diciembre**; piloto el **1.º de enero de 2027**.

## Mapa del repo

| Ruta | Qué es |
|---|---|
| `marca/tokens.css` | Copia exacta de los tokens de la guía (sección 15). Si cambia la guía, se regenera. |
| `marca/publicacion.css` | Componentes de la guía escalados a 1080 px para redes. |
| `publicaciones/_plantillas/` | Plantillas HTML: `cuadrada`, `historia`, `carrusel`. |
| `publicaciones/AAAA-MM-DD-slug/` | Una carpeta por publicación: `pieza.html`, `texto.md`, `export/` (generado, no versionado). |
| `scripts/render.mjs` | HTML → PNG/JPG con controles de marca. |
| `design.md` | Identidad para video (formato que piden `video-design` y `hyperframes`). Copialo a la carpeta del proyecto de video. |

## Skills de `.claude/skills/`

**Redes (estáticas):** `publicacion-redes` (siempre), `creative-brief` (campañas o pedidos vagos).

**Video, reels e historias animadas** (motor: HyperFrames):
- Base: `hyperframes` (leer primero), `hyperframes-cli`, `hyperframes-registry`, `media-use`.
- Verticales 9:16: `short-form-video`, `caption-animation`. Especificaciones: `video-delivery-specs` (siempre antes de renderizar).
- Por tipo: `ad-creative-video`, `promo-video`, `launch-video`, `product-demo-video`, `testimonial-video`, `explainer-video`, `chart-animation`.
- Oficio: `motion-art-direction`, `video-design`, `shot-composition`, `beat-sync-editing`, `kinetic-typography`, `logo-animation`, `svg-animation`, `animation-principles`, `color-motion`, `lower-thirds`.
- Audio: `soundtrack`, `elevenlabs` (necesita API key), `ffmpeg`.
- Presentaciones: `presentation-video` (video), `slideshow` (en vivo con notas).

**Landing web:** `gsap-web`, `micro-interaction`, `60fps-animation`, `accessible-animation`, `page-transition-animation`,
`svg-animation`, `kinetic-typography`, `logo-animation`, `animation-principles`, `color-motion`. Toda animación web
respeta `prefers-reduced-motion` y anima solo `transform`/`opacity`.

**No usar con esta marca** (contradicen «Barrio pop»): `glassmorphism` (desenfoque y vidrio) y los fondos aurora,
mesh o shader de `motion-background` (degradados). De `motion-background` solo vale la textura de puntos.
Las skills `remotion-*` quedan instaladas pero no se usan: el motor elegido es HyperFrames.

## Limitaciones conocidas

- Varias skills citan archivos que no vinieron con la copia: `scripts/` (`seek-shot.sh`, `contact-sheet.sh`) en
  unas 20 skills, y `tools/qc.py`, `tools/contact_sheet.py`, `tools/mark_sheet.py` en `video-design`. **No intentes
  ejecutarlos.** Para piezas estáticas, el control es `scripts/render.mjs`; para video, `hyperframes-cli`
  (`lint`/`validate`/`inspect`) y revisar fotogramas exportados con `ffmpeg`.
- La guía nombra `styles.css` (código de la landing) como primera fuente de verdad, pero ese código no está en este
  repo. Mientras tanto, los valores válidos son los de la guía y `marca/tokens.css`.
- El render necesita acceso a Google Fonts. Sin conexión, `npm run render:borrador` exporta con fuentes de respaldo
  solo para revisar composición; esas imágenes no se publican.
