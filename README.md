# ALIAR ROSARIO · Web y redes

Repo de **ALIAR ROSARIO** (Alianza y Respaldo para farmacias independientes): piezas para redes sociales y la
landing de convocatoria de Farmacias Fundadoras.

- **Marca:** [`docs/guia-de-estilos/guia-de-estilos.md`](docs/guia-de-estilos/guia-de-estilos.md) («Barrio pop» v2.0)
- **Negocio:** [`docs/idea-de-negocio/idea-de-negocio.md`](docs/idea-de-negocio/idea-de-negocio.md)
- **Instrucciones para Claude:** [`CLAUDE.md`](CLAUDE.md)

## Hacer una publicación

1. Copiá una plantilla de `publicaciones/_plantillas/` a `publicaciones/AAAA-MM-DD-slug/pieza.html` y cambiá los textos.
2. Exportá las imágenes (se guardan en `export/` dentro de esa carpeta):

   ```bash
   npm install
   npm run render -- publicaciones/AAAA-MM-DD-slug/pieza.html
   ```

   El script avisa si la pieza rompe alguna regla de la guía (colores, Coral, márgenes, signos, fechas…).
3. Completá `texto.md` con el texto del posteo, el texto alternativo y el checklist. Ejemplo:
   [`publicaciones/2026-11-20-convocatoria-fundadoras/`](publicaciones/2026-11-20-convocatoria-fundadoras/).

Con Claude alcanza con pedirlo ("hacé un post para…"): usa la skill `publicacion-redes`, que sigue estos pasos.

## Créditos

Skills de Claude en `.claude/skills/` (origen: [iart-ai/motion-skills](https://github.com/iart-ai/motion-skills),
HyperFrames y claude-code-video-toolkit; licencias en `licenses/`). La skill `publicacion-redes` es propia del proyecto.
Fuentes Bricolage Grotesque, Figtree y Caveat: Google Fonts, SIL Open Font License.
