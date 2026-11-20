---
name: publicacion-redes
description: Flujo obligatorio para crear publicaciones de ALIAR ROSARIO en redes (post 1:1, carrusel, historia 9:16, reel o video corto, texto del posteo). Usar cuando pidan "hacé una publicación", "un post", "un carrusel", "una historia", "un reel", "una pieza para Instagram/Facebook/WhatsApp", "una campaña" o "el texto para redes".
---

# Publicación en redes · ALIAR ROSARIO

La marca es **ALIAR ROSARIO** (nunca "FarmaGlass", el nombre viejo del prototipo). La fuente de verdad es
`docs/guia-de-estilos/guia-de-estilos.md`; el contexto del negocio está en `docs/idea-de-negocio/idea-de-negocio.md`.
Si esta skill y la guía no coinciden, manda la guía.

## 1. Brief (antes de diseñar)

Definí, o preguntá si no está claro, solo lo que cambia la pieza:

| Dato | Opciones |
|---|---|
| **Público** | Farmacias (B2B, convocatoria de Farmacias Fundadoras) · Vecinos (campañas) |
| **Objetivo** | Una sola acción: postular, escribir por WhatsApp, mandar la receta, conocer la red |
| **Formato** | Post 1:1 · carrusel 1:1 (máx. 10) · historia 9:16 · reel o video 9:16 |
| **Fecha o urgencia** | Dato concreto ("hasta el 10 de diciembre") o ninguno |

Para encargos grandes (campaña, varios formatos) usá `creative-brief`. Hitos vigentes: lanzamiento piloto el
**1.º de enero de 2027**; inscripción de Farmacias Fundadoras **hasta el 10 de diciembre**.

## 2. Herramienta según formato

| Formato | Cómo se hace |
|---|---|
| Post, carrusel, historia **estática** | **HTML → imagen** (esta skill, pasos 3–5). Es la vía por defecto. |
| Reel, historia **animada**, video | **HyperFrames** (`hyperframes`, leer primero) con la identidad de `design.md`, en **1080 × 1920**. Consultá `short-form-video`, `caption-animation` y `video-delivery-specs` antes de renderizar. |
| Retocar las piezas de Canva ya existentes (lanzamiento, recetas, verano) | Canva, con los links de la guía (14.2), si el conector está disponible. No crees piezas nuevas en Canva. |

**Por qué HTML y no Canva para piezas nuevas:** usa los tokens exactos de la marca (`marca/tokens.css`),
queda versionado en el repo, se revisa solo con `scripts/render.mjs`, comparte CSS con los videos de
HyperFrames y permite producir variantes en lote. Canva queda para ajustes manuales del equipo.

## 3. Escribir el texto (voz y tono, guía sección 12)

- Voseo rioplatense: *postulá, mandá, retirá*. Claro antes que ingenioso. Números concretos.
- Titular de **6 a 10 palabras**, con **una** palabra resaltada (`.pildora` **o** `.subrayado`).
- Bajada de **una sola oración**. Botón: verbo + objeto ("Postular mi farmacia", "Escribinos por WhatsApp").
- Vocabulario: red, farmacia de barrio, vecinos, Farmacias Fundadoras, cotizar una receta.
  Evitá: cadena, franquicia, sucursal, usuarios, leads, "vender medicamentos online".
- Fechas "1.º de enero de 2027" (nunca 01/01/27) · horas "18 h" · marca siempre en MAYÚSCULAS.
- Como máximo **un "!"** por pieza. Emojis: 1 o 2, solo en el texto del posteo, nunca en la imagen.
- Reutilizá los textos aprobados de la guía (2.1, 12.2, 12.3, 12.7) antes de inventar otros.

### Salud y normativa (no negociable, guía 12.8)

- Nada de medicamentos de venta bajo receta ni promesas de salud ("cura", "el mejor tratamiento").
- Si la pieza habla de productos de salud: marcala **"Requiere validación del referente farmacéutico"** en `texto.md`
  y no la des por terminada.
- Recetas, envíos o venta online: mencioná el encuadre normativo (Santa Fe y ANMAT).
- **Nunca** uses imágenes generadas con IA para representar farmacéuticos, farmacias o pacientes. Solo fotos
  reales y autorizadas; si no hay, la pieza va sin foto (tipografía, stickers y tarjetas).

## 4. Armar la pieza

1. Copiá la plantilla que corresponda de `publicaciones/_plantillas/` (`cuadrada.html`, `historia.html`,
   `carrusel.html`) a una carpeta nueva `publicaciones/AAAA-MM-DD-slug/pieza.html`. Un HTML puede tener varias
   `.pieza` (por ejemplo post + historia de la misma campaña); cada una lleva `data-nombre`.
2. Usá solo las clases de `marca/publicacion.css`. **No escribas HEX ni fuentes a mano**: si necesitás un color,
   es `var(--token)`. Componentes: `.eyebrow`, `.titular` (`--xl`, `--m`), `.pildora`, `.subrayado`, `.bajada`,
   `.tag` (`--urgente`, `--menta`, `--solida`, `--neutra`, `--inclinada`), `.card` (`--menta`, `--lila`,
   `--manteca`, `--lima`), `.icon-badge`, `.num`, `.btn` (`--primario`, `--secundario`, `--whatsapp`), `.nota`,
   `.foto`, `.logo`, `.pie`, `.empuje`, fondos `.fondo--*`.
3. Reglas de composición (guía 4, 5, 7 y 14.2):
   - Fondo: un pastel o Crema (puntos opcionales). En carruseles, dos diapositivas seguidas no repiten pastel.
   - **Coral solo** en `.btn--primario` o `.tag--urgente`. Como máximo **un** botón principal por pieza.
   - Texto sobre pastel en Tinta o Petróleo profundo. Una nota en Caveat como máximo (8 palabras o menos).
   - Giros entre −6° y +3°; ningún bloque de texto largo girado.
   - Logo abajo con su área de respeto. Margen interno 80 px; en historias, 250 px libres arriba y abajo.
   - Íconos: Lucide (copiá el SVG de lucide.dev dentro de `.icon-badge`), nunca en Coral.
   - Nada de desenfoques, degradados, vidrio ni sombras difusas: no uses `glassmorphism` ni fondos
     aurora/mesh de `motion-background`.

## 5. Renderizar y revisar

```bash
npm install                     # la primera vez (Playwright)
npm run render -- publicaciones/AAAA-MM-DD-slug/pieza.html          # PNG en export/
npm run render -- publicaciones/AAAA-MM-DD-slug/pieza.html --jpg    # JPG
```

El script exporta cada `.pieza` y revisa: fuentes de marca cargadas, colores fuera de paleta, Coral mal usado,
más de un botón principal o un "!", texto fuera del margen seguro o desbordado, texto < 24 px, fechas numéricas,
"FarmaGlass" y vocabulario a evitar. **Corregí todo ❌ antes de entregar.**

Si no hay conexión a Google Fonts, el render falla a propósito: usá `npm run render:borrador -- …` solo para
revisar composición y avisá que es un borrador con fuentes de respaldo.

Después **mirá las imágenes** (Read sobre los PNG): el script no ve jerarquía, ritmo ni si el mensaje se entiende.

## 6. Entregar `texto.md` junto a la pieza

En la misma carpeta, con este formato (ejemplo completo en `publicaciones/2026-11-20-convocatoria-fundadoras/`):

```markdown
# <Nombre de la pieza>
- **Público:** … · **Tono:** …
- **Formatos:** … (`export/<nombre>.png`)
- **Estado:** borrador | lista para revisión | requiere validación del referente farmacéutico

## Texto del posteo
<Mensaje clave también acá, no solo en la imagen. ALIAR ROSARIO + su significado la primera vez. 1–2 emojis. CTA.>

## Texto alternativo
- **<data-nombre>:** <describe la escena y transcribe el texto de la imagen>

## Checklist (guía, sección 16)
- [ ] Render sin errores
- [ ] Voseo, vocabulario de red y fechas con formato correcto
- [ ] Un solo botón principal y un "!" como máximo; Coral solo en botón y urgencia
- [ ] Mensaje clave en el posteo y texto alternativo cargado
- [ ] Sin promesas de salud ni medicamentos bajo receta / validado por el referente farmacéutico
- [ ] Revisado por una persona del equipo antes de publicar
```

Entregá al usuario las imágenes y el texto del posteo listo para copiar.
