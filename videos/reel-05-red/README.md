# Reel 5 · «1 + 1 + 1 + 1» (ALIAR ROSARIO)

Reel vertical para captar Farmacias Fundadoras. Guion: `docs/redes/guiones-reels-farmacias.md` (guion 5).
Hecho con [HyperFrames](https://hyperframes.heygen.com) (HTML a video).

- **Video final:** `renders/aliar-reel-05-red.mp4` · 1080 × 1920 · 30 fps · 18,6 s · H.264 + AAC · −15,9 LUFS.
- **Escenas:** `compositions/horas.html` (0–8,2 s), `compositions/red.html` (8,2–15,2 s), `compositions/cierre.html` (15,2–18,6 s).
- **Sonido:** solo efectos (sin música). Para pauta en Meta, sumar una música con licencia comercial.

## Editar y volver a renderizar

Desde la raíz del repositorio (con las skills de `.claude/skills/`):

```bash
cd videos/reel-05-red
node ../../.claude/skills/hyperframes/scripts/plugin-cli.mjs preview
node ../../.claude/skills/hyperframes/scripts/plugin-cli.mjs check --safe-zone reels
node ../../.claude/skills/hyperframes/scripts/plugin-cli.mjs render -o renders/aliar-reel-05-red.mp4 --quality delivery
```

## Licencias

- Fuentes Bricolage Grotesque, Figtree y Caveat (`assets/fonts/`): SIL Open Font License 1.1, vía Fontsource.
- Efectos de sonido (`assets/sfx/`): Pixabay Content License, incluidos con la skill `media-use`.
- Los horarios y los nombres de farmacias (Del Parque, Alameda, El Nogal, Los Aromos) son datos de ejemplo del prototipo.
