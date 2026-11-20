# REVIEW · render del 20/11/2026

Archivo: `renders/aliar-rosario-persiana-9x16.mp4`

## Decisiones creativas

- **Guion B** de `video/aliar-reel/STORYLINES.md` («Cuando bajás la persiana»), con palabras y conceptos
  nuevos: «Bajás la persiana», «Y se va a otra», «La venta sigue», «Tu tienda online no cierra»,
  «Tu nombre sigue en la puerta», «Sin abono», «Cerrás el local. No las ventas.», «Sé Farmacia Fundadora».
- **Más vértigo** (pedido): 150 BPM, un corte o golpe en cada negra (0,4 s), latigazos, zooms a través,
  persiana que cae y se arranca, desenfoque de movimiento en el render.
- **Guía más libre**, salvo en los «banners»: titulares en bloques-sticker con borde Tinta y sombra sólida,
  tarjetas flotantes, botón Coral, tipografías de marca y un cierre Crema que sigue la guía al pie de la letra.
- **Fotos reales** de Wikimedia Commons (créditos en `README.md`) y los banners de campaña del repo.
  El nombre real de la farmacia fotografiada queda tapado y no aparecen personas identificables.

## Qué se midió

| Prueba | Resultado |
|---|---|
| `hyperframes check` | 0 errores (lint, runtime, diseño, movimiento, contraste, audio) |
| Formato (`ffprobe`) | 1080 × 1920, 30 fps, H.264 + AAC 48 kHz, 24,000 s, 20,7 MB (7,2 Mbps) |
| Sonoridad (EBU R128) | −14,8 LUFS integrado, pico verdadero −1,1 dBTP |
| Sincronía (`sync-check`) | 16/17 cortes a ±100 ms de un golpe fuerte, sin saltos > 6 dB |
| Primer y último cuadro | sin negro (el primero es la noche con el reloj 20:59) |

El corte de 19,2 s («Cerrás el local») figura a +110 ms en `sync-check`, pero el detector de
HyperFrames marca el golpe en 19,205 s; está dentro de un cuadro de diferencia.
**El sonido se midió, no se escuchó.** Conviene oírlo en el parlante de un celular.

## Avisos que quedaron a propósito

- `line_unread` en los detalles de las notificaciones (horarios) y en «Campañas hechas por la red»:
  son información secundaria; el ritmo es parte del pedido. Los titulares se leen.
- `contrast_aa_failure` en «TU FARMACIA» a 17,3 s: el texto se funde con el Lima a propósito antes de
  que el sticker se vuelva el fondo.
- `outside_safe_zone` de «La venta» y «Cerrás»: solo durante su golpe de entrada o la salida de la persiana.

## Lo más flojo y qué haría con más tiempo

- **Las fotos no son de farmacias de la red.** Son reales y con licencia libre, pero para publicar conviene
  reemplazarlas por fotos propias y autorizadas (se cambian los archivos en `assets/photos/`).
- La foto de la puerta está ampliada ~1,7×: se ve algo blanda; una foto propia en alta resolución la mejora.
- La música es sintética: un tema con licencia a 150 BPM con drop le daría más pegada.

## Antes de publicar

- [ ] Pegar los créditos de las fotos en la descripción (ver `README.md`): las licencias CC BY / CC BY-SA lo exigen.
- [ ] Confirmar dónde se postula (link en la bio, WhatsApp o web).
- [ ] Escuchar la mezcla en un celular.
