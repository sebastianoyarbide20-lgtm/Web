# SPEC · Reel «Cuando bajás la persiana» (guion B de `video/aliar-reel/STORYLINES.md`)

GOAL:    Que la dueña o el dueño de una farmacia de barrio sienta en 24 s que cerrar el local ya no
         corta la venta, y toque «Postular mi farmacia» antes del 10 de diciembre.
OUTPUT:  HyperFrames, 1080 × 1920 (9:16), 30 fps. Reels / Stories / TikTok / Shorts.
TIME:    24 s × 30 = 720 cuadros. 150 BPM → negra = 0,4 s = 12 cuadros, compás = 1,6 s = 48 cuadros.
         Cada corte cae en una negra; los cambios de escena, en compás.

LOOK:    Más libre que la guía (pedido explícito): fotos reales a sangre, noche oscura y día luminoso,
         cortes cada 0,4–1,6 s, zooms y latigazos con desenfoque de movimiento.
         Lo que SÍ sigue la guía («banners»): tipografía Bricolage 800 / Figtree / Caveat, titulares en
         bloques-sticker con borde Tinta 5 px y sombra sólida desplazada (10 px; Lima sobre bloques Tinta),
         giros −4°…+3°, tarjetas flotantes de la web, botón Coral con círculo Tinta, isotipo y cierre Crema.
         Titulares en MAYÚSCULAS 100–300 px, tracking −0,035 em; ninguna línea pasa de 790 px.
         Coral: botón, sello «CERRADO» y punto de urgencia.
MEDIA:   Fotos reales de Wikimedia Commons (licencias CC0 / CC BY / CC BY-SA, créditos en README):
         Monumento a la Bandera de noche, skyline de Rosario de noche y al atardecer, persianas metálicas,
         celulares en mano, una farmacia de barrio de Buenos Aires (puerta, interior). Sin personas
         identificables. El cartel con el nombre real de la farmacia queda tapado por el sticker
         «TU FARMACIA» (no se sugiere que ese comercio integre la red).
         Banners del repo: campañas de lanzamiento, recetas y verano.
MOTION:  Golpes: escala 1,5 → 1 en 0,22 s expo.out. Latigazos: 0,16 s power3.in / 0,3 s expo.out.
         Persiana: cae en 0,28 s power3.in y rebota con temblor de 3 ciclos (±14 px, 0,2 s).
         Fotos: siempre en movimiento (empuje 1,25 → 1,0 o 1,0 → 1,2). Desenfoque de movimiento en render.
         Titular aterrizado = quieto hasta que se va. Destellos: máximo uno por segundo.
SAFE:    Texto dentro de x 100–888 / y 288–1248. Debajo de y 840 las líneas no pasan de 680 px.

SHOTS (compás = 1,6 s):
 1  noche      0,0–3,2   Monumento de noche, reloj 20:59 → 21:00 (0,4). 0,92: cae la persiana; 1,2 golpe;
                         «BAJÁS LA / PERSIANA.» 1,6: tres persianas cerradas + sello «CERRADO».
                         2,4: skyline de noche, «TU VECINO / NECESITA ALGO.»
 2  busca      3,2–6,4   Celular en mano, buscador escribe «farmacia abierta cerca». 4,0 «Y SE VA» 4,2 «A OTRA.»
                         4,8 fondo Tinta: «¿Y SI LA / PERSIANA / NO CORTARA / LA VENTA?» en cada negra, zoom que
                         acelera; 6,2 cae la persiana; silencio de 1/8.
 3  drop       6,4–9,6   La persiana se arranca hacia arriba: interior de farmacia + destello, «LA VENTA / SIGUE.»
                         + sticker ALIAR ROSARIO. 8,0: celular + tres notificaciones en cascada (23:47 · 00:12 · 08:58),
                         «TU TIENDA ONLINE / NO CIERRA.»
 4  servicio   9,6–12,8  Lila + banner de recetas: «RECETA / POR FOTO.» + botón WhatsApp «Cotizás por WhatsApp».
                         11,2 latigazo: atardecer en Rosario, ruta punteada + pin, banner de verano,
                         «RETIRO O ENVÍO / EN EL DÍA.»
 5  red        12,8–16,0 Skyline de noche con pines que se encienden: «SIEMPRE HAY UNA / DE LA RED / ABIERTA.»
                         14,4: los tres banners entran en abanico: «TUS REDES, / LISTAS.» Zoom a través.
 6  tuya       16,0–19,2 Puerta real de farmacia: «TU NOMBRE / SIGUE EN / LA PUERTA.» + sticker «TU FARMACIA».
                         El sticker crece hasta ser fondo Lima: «SIN ABONO.» «PAGÁS SOLO / CUANDO VENDÉS.»
 7  frase      19,2–20,8 Vuelve a caer la persiana: «CERRÁS / EL LOCAL.» 20,0: «NO LAS / VENTAS.» Zoom a través.
 8  cierre     20,8–24,0 Crema (guía estricta): isotipo + ALIAR ROSARIO, «INSCRIPCIÓN HASTA EL 10 DE DICIEMBRE»,
                         «Sé Farmacia / Fundadora.», botón «Postular mi farmacia», «Sin abono · Lanzamiento:
                         1.º de enero de 2027». Quieto desde 21,9 s.

SOUND:   Base sintetizada (audio-src/score.js), 150 BPM, La menor. Noche en medio tiempo con tic de reloj y
         sub; subida con redoble que acelera y barrido; drop en 6,4 (bombo en negras, clap, bajo con bombeo,
         acordes de supersierra, gancho); break en 19,2; remate en 23,2. Traqueteo de persiana sintetizado.
         SFX de Pixabay: golpes graves en las persianas y el drop, glitch en «a otra», notificación en el
         pedido, whooshes en los latigazos. Mezcla −15…−14 LUFS, pico ≤ −1 dBTP.
BANNED:  vacío oscuro con cosas chiquitas flotando; títulos que se mueven mientras se leen; todo con fade;
         tres tarjetas en fila; logo pegado en una esquina; personas identificables; carteles con nombres de
         comercios reales a la vista; medicamentos en primer plano; promesas de salud; nombrar cadenas.
QA:      0,0 · 1,3 · 1,8 · 2,7 · 3,6 · 4,2 · 5,9 · 6,7 · 8,9 · 10,4 · 12,0 · 13,6 · 15,2 · 16,8 · 18,6 ·
         19,6 · 20,3 · 22,5 · 23,9 y cada corte ±0,1 s.
