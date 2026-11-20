# Landing page

Proyecto de una landing page. Las skills de `.claude/skills/` aplican a este proyecto:

- Animación al scroll y secuencias: `gsap-web`
- Hover, botones, toggles, feedback: `micro-interaction`
- Rendimiento de animaciones (60fps): `60fps-animation`
- Respetar `prefers-reduced-motion`: `accessible-animation`
- Transiciones entre páginas/vistas: `page-transition-animation`
- Animación de SVG: `svg-animation`
- Efecto vidrio / glassmorphism: `glassmorphism`
- Fondos animados (mesh, aurora, gradientes): `motion-background`
- Que el movimiento se sienta natural: `animation-principles`
- Titulares animados: `kinetic-typography`
- Paletas y transiciones de color: `color-motion`
- Animación del logo: `logo-animation`

Reglas (web): toda animación debe respetar `prefers-reduced-motion` y animar solo `transform`/`opacity`.

## Video, reels, stories, publicidad y presentaciones

Motores de render (elige uno por proyecto, no mezcles):
- HyperFrames (HTML a video): `hyperframes` (leer primero), `hyperframes-cli`, `hyperframes-registry`, `media-use`
- Remotion (React a video): `remotion-best-practices` (router), `remotion-create`, `remotion-markup`, `remotion-captions`, `remotion-render`

Formatos y publicidad:
- Reels / TikTok / Shorts / stories verticales 9:16: `short-form-video`, `caption-animation`
- Anuncios y promos: `ad-creative-video`, `promo-video`, `launch-video`, `product-demo-video`, `testimonial-video`
- Especificaciones por plataforma (tamaños, duración, zonas seguras): `video-delivery-specs`
- Explicativos y datos: `explainer-video`, `chart-animation`

Presentaciones:
- Presentación en video: `presentation-video`
- Presentación en vivo con notas del orador: `slideshow`

Dirección y oficio:
- Brief y dirección: `creative-brief`, `motion-art-direction`
- Diseño visual y composición: `video-design`, `shot-composition`
- Ritmo y cortes: `beat-sync-editing`
- Overlays: `lower-thirds`

Audio y proceso:
- Música y sonido: `soundtrack`, `elevenlabs` (voz en off, necesita API key)
- Conversión y compresión: `ffmpeg`

Regla: antes de renderizar, consulta `video-delivery-specs` para el formato de destino.

## Guía de estilos (ALIAR ROSARIO · «Barrio pop» v2.0)

Antes de diseñar o escribir cualquier pieza (web, redes, flyers, video), lee `docs/guia-de-estilos/guia-de-estilos.md`. Es la fuente de verdad de marca: logotipo, color, tipografía, componentes, movimiento, voz y tono, accesibilidad y checklist. Los tokens CSS están en su sección 15. La versión PDF (`guia-de-estilos.pdf`) es solo para humanos; las imágenes están en `docs/guia-de-estilos/img/`.

Reglas clave: Coral `#F97316` solo en botones principales y urgencia · fuentes Bricolage Grotesque / Figtree / Caveat · bordes de 2 px en Tinta `#0D2B27` con sombras sólidas desplazadas · voseo rioplatense.
