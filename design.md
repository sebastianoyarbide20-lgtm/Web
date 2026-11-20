# Design: ALIAR ROSARIO · videos, reels e historias animadas

Source: marca propia, `docs/guia-de-estilos/guia-de-estilos.md` («Barrio pop» v2.0). Tokens en `marca/tokens.css`.
Brand: ALIAR ROSARIO (nunca "FarmaGlass").

Este archivo es el *handoff* que leen `video-design` y `hyperframes`. Resume la guía en el formato que esas
skills esperan; si algo no coincide, manda la guía.

## Formato por defecto

Reels, historias y TikTok: **1080 × 1920, 30 fps** (no el 1920 × 1080 que trae HyperFrames por defecto).
Zonas seguras: **250 px libres arriba y abajo**, 80 px a los costados. Motor elegido: **HyperFrames**
(no usar Remotion en este proyecto). Antes de renderizar: `video-delivery-specs`.

## Acts
| Act | Scenes | Says | Field |
| --- | --- | --- | --- |
| 1 Gancho | hook | El problema o la promesa en una frase (≤ 3 s) | identity |
| 2 Cómo funciona | pasos, beneficios | Una idea por escena, números concretos | record |
| 3 Cierre | cta, logo | Una sola acción + fecha si hay urgencia | close |

## Fields
| Field | Ground | Ink | Data accent | Other data | Secondary ink |
| --- | --- | --- | --- | --- | --- |
| identity | #DDF57A (Lima) | #0D2B27 (Tinta) | #0F766E (Petróleo) | #E4DBFF (Lila) | #3D5752 |
| record | #FFF9F0 (Crema) | #0D2B27 | #0F766E | #BFF0DA / #FFEDB3 (Menta / Manteca) | #3D5752 |
| close | #0D2B27 (Tinta) | #FFF9F0 | #DDF57A | #0F766E | #FFF9F0 80% |

Coral `#F97316` **no es data accent**: solo el botón principal del cierre (texto en Tinta) y el punto de urgencia.

## Type
Family: Bricolage Grotesque (display, 800/700) · Figtree (texto, 400–800) · Caveat (nota, 700, una por video como máximo)
Steps (1080 × 1920): display 150 · figure 120 · title 96 · label 40 · note 34 (piso: 28 px)
Display tracking −0.035em, leading 1.0. Antetítulos y stickers en MAYÚSCULAS con +0.07em.

## Ground
Plano, un color por acto. Textura de puntos opcional (Tinta al 14 %, paso 36 px). Sin degradados, blobs,
aurora, mesh, vidrio ni fotos de banco de imágenes. Fotos solo reales y autorizadas, en marco de arco con borde
Tinta de 6 px y sombra sólida.

## Layout
Title edge: x = 80. Logo abajo a la izquierda con área de respeto (mitad del alto del contenedor).
Componentes como stickers: borde Tinta 4 px, sombras sólidas desplazadas abajo a la derecha (6/10/16 px), sin blur.
Giros entre −6° y +3°.

## Motion
Curvas: `--ease` cubic-bezier(0.2, 0.75, 0.25, 1) para entradas · `--spring` cubic-bezier(0.34, 1.56, 0.64, 1)
para *pop* de stickers e isotipo. Entradas 0,5–0,9 s; respuestas 0,15–0,25 s. Nada parpadea más de 3 veces por
segundo. Solo `transform` y `opacity`.

## Rules turned off
- Effect transitions (glitch, light leak, zoom blur) — chocan con el estilo sticker; usar cortes y *pop*.
- Data accent en color de marca cálido — el acento es Petróleo; Coral queda reservado a la acción.
