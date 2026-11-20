# REVIEW · render del 20/11/2026

Archivo: `renders/aliar-rosario-fundadoras-9x16.mp4`

## Decisiones creativas

- **Público:** dueñas y dueños de farmacias de barrio (B2B). Es la acción abierta hoy (inscripción de
  Farmacias Fundadoras hasta el 10 de diciembre) y el plan de negocio dice «primero a las farmacias».
- **Guion construido:** A, «Cuatro farmacias, una red»: el isotipo cuenta la idea (cuatro módulos =
  cuatro farmacias, el punto = la red). No construidos: B «Cuando bajás la persiana» (necesita fotos
  reales autorizadas, la guía prohíbe imágenes generadas de farmacias) y C, campaña para vecinos
  (conviene después del 10 de diciembre). Ver `STORYLINES.md`.
- **Sin fotos ni medicamentos:** todo es tipografía, componentes de la web (tarjetas flotantes, cinta de
  barrios, botón) y el isotipo. Coral solo en el botón y en el punto de urgencia.
- **Música:** sintetizada en código (skill `soundtrack`), porque no hay catálogo de música conectado.

## Qué se midió

| Prueba | Resultado |
|---|---|
| `hyperframes check` | 0 errores (lint, runtime, diseño, movimiento, contraste, audio) |
| Formato (`ffprobe`) | 1080 × 1920, 30 fps, H.264 yuv420p + AAC 48 kHz estéreo, 26,000 s, 3,8 MB |
| Sonoridad (EBU R128) | −15,8 LUFS integrado, pico verdadero −1,6 dBTP |
| Sincronía (`sync-check`) | 10/10 cortes y golpes caen a ±100 ms de un pulso fuerte, sin saltos > 6 dB |
| Primer y último cuadro | sin negro (luma media 243 y 228 de 255) |

Se miraron: hojas de beats, de cortes (±0,2 s) y de celular a 360 px, y cuadros decodificados del MP4.
**El sonido se midió, no se escuchó.** Conviene escucharlo con auriculares y en el parlante de un celular.

## Avisos que quedaron a propósito

- `outside_safe_zone` en los stickers FISHERTON / ECHESORTU / ALBERDI: solo mientras los módulos están
  fuera de cuadro, antes de entrar. En su lugar final están dentro de la zona segura.
- `line_unread` en la nota manuscrita «el punto es la red» (1,1 s): es un condimento; la imagen cuenta lo mismo.
- `container_overflow` y `text_occluded` en el cierre: la cortina Tinta saliendo y el barrido de «ROSARIO».
- Bitrate medio de 1,2 Mbps: son gráficos planos con CRF de calidad alta (tope 12 Mbps); no se ven
  artefactos. Las plataformas recomprimen igual.

## Lo más flojo y qué haría con más tiempo

- Las tres escenas de beneficios duran 2 s cada una: las tarjetas («¡Pedido nuevo!», «Receta cotizada»)
  se leen ~1,1 s. Si la retención lo permite, pasarlas a 2,5 s o hacer un reel corto por beneficio.
- La mitad inferior de esas escenas queda libre (es la zona que tapan la descripción y los botones de
  la app); una versión 4:5 para el feed podría usarla.
- La música es correcta y medida, pero sintética: un tema con licencia a 120 BPM la mejoraría.

## Antes de publicar (checklist de la guía, sección 16)

- [ ] Confirmar la lista de barrios del piloto (la idea de negocio dice «a validar»).
- [ ] Confirmar dónde se postula (link en la bio, WhatsApp o web) y ajustar el texto del posteo.
- [ ] Pegar el texto del posteo y el texto alternativo del `README.md`.
- [ ] Escuchar la mezcla en un celular.
