# Guion del video demo · "Caso Fudo: Diagnóstico + Tu Fudo ya armado"

> A7 (Guionista) · 27/10/2026 · **Borrador para G-OK2** (Matías aprueba antes de generar la voz).
> Salida: 16:9 1080p (1920×1080), con 9:16 opcional. Locución en español neutro latinoamericano (sin voseo), voz en off única.

## 1. Resumen

| | |
|---|---|
| Local del recorrido | **El Campeón de la Pizza** (Lanús, AR): 4,2 · 6.167 reseñas, sin web propia, en PedidosYa y Rappi. Datos reales capturados el 26/10/2026 |
| Palabras de locución | **182** (a ~2,4 palabras/s) |
| Duración de la voz | **≈ 75.8 s** |
| Duración total del video | **≈ 77.0 s** (incluye 1,5 s de cola final sin voz). Rango del encargo: 60–90 s |
| Rótulo de marca | "Demo de entrevista · no oficial": grande al inicio (escena 1, 0,0–0,8 s) y fijo, discreto, en el pie de toda la pieza |
| Real / simulado | **Real:** datos del local, notas por área, planes y precios de Fudo, costos de Places. **Simulado:** la plata que se escapa (estimación con supuestos), la carta de la cuenta y el alta ("el botón solo simula") |

La duración sale de `palabras ÷ 2,4`, redondeada a 0,5 s por escena. **El tiempo real lo manda el audio generado:** A8 mide cada escena en el audio y ajusta la imagen (no la voz). Si la voz pasa de 85 s, bajar el `speed` a 1,0 o aplicar los recortes de la sección 6.

| N.º | Escena | Palabras | Voz | Escena | Tiempo |
|---|---|---|---|---|---|
| 1 | Hook: el problema | 32 | 13.3 s | 13,5 s | 0:00,0–0:13,5 |
| 2 | Buscar y confirmar el local real | 22 | 9.2 s | 9,0 s | 0:13,5–0:22,5 |
| 3 | Cuatro preguntas | 10 | 4.2 s | 4,0 s | 0:22,5–0:26,5 |
| 4 | La comanda de resultado | 21 | 8.8 s | 9,0 s | 0:26,5–0:35,5 |
| 5 | Plata que se escapa (simulada) | 12 | 5.0 s | 5,0 s | 0:35,5–0:40,5 |
| 6 | Tu Fudo ya armado | 23 | 9.6 s | 9,5 s | 0:40,5–0:50,0 |
| 7 | Línea base y experimento | 28 | 11.7 s | 11,5 s | 0:50,0–1:01,5 |
| 8 | Costo por diagnóstico vs pauta | 18 | 7.5 s | 7,5 s | 1:01,5–1:09,0 |
| 9 | Cierre con URLs | 16 | 6.7 s | 8,0 s | 1:09,0–1:17,0 |
| | **Total** | **182** | **75.8 s** | **77.0 s** | 0:00,0–1:17,0 |

## 2. Locución completa (texto para la voz)

Listo para pegar en ElevenLabs. Está escrito "como se dice" (números en palabras, URLs deletreadas). Una línea en blanco = una escena = pausa de ~0,3 s.

```text
Viernes, nueve y media. Alguien busca pizza en Lanús. Si no te encuentra, pide en otro lado. Y por una app, la comisión va del veinticinco al treinta y cinco por ciento.

Escribimos El Campeón de la Pizza y lo confirma con su ficha pública: cuatro coma dos estrellas, más de seis mil reseñas.

Cuatro preguntas rápidas: negocio, canales, cobro y locales. Sin registro.

Sale la comanda: Google, cien sobre cien; pero la web, treinta y cinco, y el cobro a mano, treinta y dos.

Y una estimación simulada: casi un millón setecientos mil pesos por mes.

Ahora, Tu Fudo ya armado: la cuenta viene con nombre, dirección y horarios reales del local. En la demo, el alta es simulada.

El caso parte de novecientas sesenta cuentas por mes y diez por ciento que paga. Probamos llevarlo a quince, con unas seiscientas ochenta y cinco cuentas por grupo.

Hoy, cada cliente por pauta cuesta doscientos dólares: veinte por cuenta. Un diagnóstico, unos seis centavos de dólar.

Pruébalo en fudo diagnostico punto vercel punto app. El código, en GitHub: matiasrubano barra fudo diagnostico.
```

**Guía para la voz:** neutra latinoamericana, cálida y directa, ritmo conversacional (no publicitario). Sin voseo ("Pruébalo"). Micro pausa en "punto vercel punto app" y en "barra". Énfasis suave en los números de la escena 7.

## 3. Marca y estilo

| Elemento | Valor |
|---|---|
| Logo | `video/assets/fudo-logo-white.svg` sobre fondos oscuros; `video/assets/fudo-logo.svg` sobre crema. Sin recolorear ni deformar |
| Colores | Naranja `#FF5023` (acentos, números, URL principal) · Azul `#3937FF` (acentos, pastillas, barra "control") · Azul noche `#0F1B4E` (fondo principal) · Crema `#FFFAEC` (tarjetas y fondo claro) |
| Tipografías | **Barlow** (títulos y números, 700–800) + **Inter** (texto y subtítulos, 500–600) |
| Accesibilidad | Texto chico naranja sobre claro: `#D03F00` (blanco sobre `#FF5023` no pasa AA salvo texto grande). `#FF5023` sobre azul noche sí pasa AA (4,99:1; `docs/research/brand.md`) |
| Sellos | "SIMULADO": pastilla amarilla `#FFF0B3`, texto `#7A5A00`, con borde (escenas 5, 6 y 8). "REAL · 26/10/2026": verde `#D2F2C2`, texto `#2E6B12`, igual que los badges de la app |
| Marco de teléfono | Pantalla 375×812 (captura @2x = 750×1624) dentro de un marco redondeado (radio ~44 px, bisel `#0A0F2C`, isla superior chica), sombra suave. Alto en 16:9: ~900 px (ancho ≈ 416 px), a un costado; el otro lado lleva el texto animado. Fondo de marca: degradé radial azul noche `#0F1B4E` → `#3937FF` (25 %) en una esquina. Planos 1280×800 casi a pantalla completa con borde crema y sombra |
| Subtítulos | Inter 600, 42–44 px, blanco sobre caja `#0F1B4E` al 70 %, abajo al centro, máx. 2 líneas de ≤ 42 caracteres, quemados en el render. Ya vienen cortados en la tabla; A8 reparte el tiempo de cada cue con las marcas de palabra del audio |
| Rótulo "Demo de entrevista · no oficial" | Pastilla discreta (Inter 500, ~20 px, 70 % de opacidad) en el pie izquierdo de toda la pieza; versión grande de 0,8 s en la apertura |
| Aviso del local | Escenas 2–6, línea chica bajo el teléfono: "Local real, datos públicos de su ficha. Sin relación con el local ni con Fudo." |

## 4. Tabla de escenas

Tiempos acumulados (m:ss,d). "En pantalla" nombra las capturas de la sección 5. Las líneas con "— — —" separan cues de subtítulo.

| N.º | Tiempo | Palabras · dur. | Locución exacta | En pantalla | Motion graphics | Subtítulo (≤ 42 car./línea) |
|---|---|---|---|---|---|---|
| 1 | 0:00,0–0:13,5 | 32 p. · 13,5 s | Viernes, nueve y media. Alguien busca pizza en Lanús. Si no te encuentra, pide en otro lado. Y por una app, la comisión va del veinticinco al treinta y cinco por ciento. | Fondo azul noche #0F1B4E. 0,0–0,8 s: logo `fudo-logo-white.svg` + rótulo "Demo de entrevista · no oficial". Luego teléfono (marco) con **m-01-home-hero** (hero "Viernes 21:30. Alguien busca 'pizza en Lanús'"). | Zoom lento 100→115 % a "Viernes 21:30." (naranja, Barlow). Al decir "comisión": cae sobre el teléfono un cartel grande "25–35 %" con **contador 0→35 %**, y debajo en chico "comisión de PedidosYa en AR · iProfesional, 14/05/2026". | Viernes, nueve y media.<br>— — —<br>Alguien busca pizza en Lanús.<br>— — —<br>Si no te encuentra, pide en otro lado.<br>— — —<br>Y por una app, la comisión va del<br>veinticinco al treinta y cinco por ciento. |
| 2 | 0:13,5–0:22,5 | 22 p. · 9,0 s | Escribimos El Campeón de la Pizza y lo confirma con su ficha pública: cuatro coma dos estrellas, más de seis mil reseñas. | Teléfono con **m-03-buscador-escrito** (texto tipeado) → clic en "Diagnosticar" → **m-04-confirmar** recortado a la **primera tarjeta** (El Campeón De La Pizza · Av. 9 de Julio 1253, Lanús · ★ 4,2 · 6.167 reseñas · badge verde). | Tipeo animado del nombre (70 ms/letra). Zoom 120 % a "★ 4,2 · 6.167 reseñas" con **contadores 0→4,2 y 0→6.167**. Resalta el badge "real · capturado el 26/10/2026" con halo naranja. | Escribimos El Campeón de la Pizza y lo<br>confirma con su ficha pública:<br>— — —<br>cuatro coma dos estrellas,<br>más de seis mil reseñas. |
| 3 | 0:22,5–0:26,5 | 10 p. · 4,0 s | Cuatro preguntas rápidas: negocio, canales, cobro y locales. Sin registro. | Teléfono con cortes rápidos (~1,2 s c/u): **m-05-pregunta-1** → **m-06-pregunta-2-marcada** → **m-07-pregunta-3** → **m-08-pregunta-4**. Se ven la barra de progreso y las opciones. | Pastilla azul #3937FF fija arriba: "4 preguntas · sin registro". La barra de progreso de la app avanza 25→100 %; destello sobre la opción marcada en cada corte. | Cuatro preguntas rápidas:<br>— — —<br>negocio, canales, cobro y locales.<br>— — —<br>Sin registro. |
| 4 | 0:26,5–0:35,5 | 21 p. · 9,0 s | Sale la comanda: Google, cien sobre cien; pero la web, treinta y cinco, y el cobro a mano, treinta y dos. | Teléfono con **m-10-comanda-resultado** (ticket completo, 686×2290 px): panorámica vertical de arriba hacia abajo. Plano alterno en 1280: **d-10-comanda-resultado** a la derecha del teléfono si se quiere llenar el 16:9. | Pan suave sobre el ticket. Zooms a las filas: "Google 100/100 · MUY BIEN" (verde), "Web y redes 35/100 · URGENTE" y "Operación 32/100 · URGENTE" (rojo). **Contadores 0→100, 0→35, 0→32**. Cierra en "NOTA GENERAL 65/100". | Sale la comanda:<br>— — —<br>Google, cien sobre cien;<br>— — —<br>pero la web, treinta y cinco, y el<br>cobro a mano, treinta y dos. |
| 5 | 0:35,5–0:40,5 | 12 p. · 5,0 s | Y una estimación simulada: casi un millón setecientos mil pesos por mes. | **m-11-plata-simulada** (bloque "TOTAL QUE SE TE ESCAPA POR MES · simulado · $ 1.688.000 · Rango entre $ 1.013.000 y $ 2.363.000"). Corte final a **m-12-como-calculamos** (supuestos a la vista). | Zoom 130 % al monto con **contador 0→$ 1.688.000** (separador de miles argentino). Sello amarillo "SIMULADO" (#FFF0B3, texto #7A5A00) estampado sobre el número. Texto: "Estimación simulada · supuestos a la vista". | Y una estimación simulada:<br>— — —<br>casi un millón setecientos<br>mil pesos por mes. |
| 6 | 0:40,5–0:50,0 | 23 p. · 9,5 s | Ahora, Tu Fudo ya armado: la cuenta viene con nombre, dirección y horarios reales del local. En la demo, el alta es simulada. | **m-14-tu-fudo-ya-armado** recortado desde el título "TU FUDO YA ARMADO" (sin la línea "Por qué te mostramos esto… Caliente"). Luego **m-15-modal-alta-simulada** ("Simulación: crear tu cuenta"). Plano ancho opcional: **d-14-tu-fudo-ya-armado** (1280). | Wipe naranja revela el título. Halos secuenciales sobre **Nombre del local → Dirección → Horarios** con la etiqueta "REAL · 26/10/2026" (verde). Al decir "simulada": sello amarillo "ALTA SIMULADA" sobre el botón "Crear mi cuenta de Fudo" y sobre la Carta ("simulado"). | Ahora, Tu Fudo ya armado:<br>— — —<br>la cuenta viene con nombre, dirección<br>y horarios reales del local.<br>— — —<br>En la demo, el alta es simulada. |
| 7 | 0:50,0–1:01,5 | 28 p. · 11,5 s | El caso parte de novecientas sesenta cuentas por mes y diez por ciento que paga. Probamos llevarlo a quince, con unas seiscientas ochenta y cinco cuentas por grupo. | Sin captura de app: gráfico animado sobre azul noche (opcional: **d-09-resultado-top** muy atenuado al 10 % de opacidad como textura). | Embudo: "80.000 visitas/mes" → ×1,2 % → "**960** cuentas/mes" → ×10 % → "96 pagos/mes" (**contadores**). Luego dos barras: "Control 10 %" (azul) vs "Con diagnóstico 15 %" (naranja) con flecha +5 pts. Texto grande: "**~685** cuentas por brazo" (**contador 0→685**), debajo "cuenta → pago a 60 días · α 0,05 · potencia 80 %". | El caso parte de novecientas sesenta<br>— — —<br>cuentas por mes y diez<br>por ciento que paga.<br>— — —<br>Probamos llevarlo a quince, con unas<br>— — —<br>seiscientas ochenta y cinco<br>cuentas por grupo. |
| 8 | 1:01,5–1:09,0 | 18 p. · 7,5 s | Hoy, cada cliente por pauta cuesta doscientos dólares: veinte por cuenta. Un diagnóstico, unos seis centavos de dólar. | Sin captura de app: dos tarjetas enfrentadas sobre azul noche (crema #FFFAEC). | Tarjeta A: "**USD 200** por cliente · USD 20 por cuenta · pauta" (**contador 0→20**). Tarjeta B: "**USD 0,06** por diagnóstico" (contador 0→0,06; texto "0,057 con Google Places · primeros 1.000/mes gratis"). Barra proporcional (B apenas visible). Nota chica: "Un diagnóstico no es una cuenta: a 1–10 % de diagnóstico→cuenta, USD 5,70–0,57 por cuenta (supuesto)". | Hoy, cada cliente por pauta<br>cuesta doscientos dólares:<br>— — —<br>veinte por cuenta.<br>— — —<br>Un diagnóstico, unos seis<br>centavos de dólar. |
| 9 | 1:09,0–1:17,0 | 16 p. · 8,0 s | Pruébalo en fudo diagnostico punto vercel punto app. El código, en GitHub: matiasrubano barra fudo diagnostico. | Fondo azul noche. Teléfono pequeño con **m-09-resultado-top** a la izquierda; a la derecha las dos URLs. Logo `fudo-logo-white.svg` arriba. Rótulo inferior fijo. | URL 1 entra en naranja #FF5023: "**fudo-diagnostico.vercel.app**"; URL 2 en crema: "**github.com/matiasrubano/fudo-diagnostico**" (typewriter). Rótulo: "Demo de entrevista · no oficial · datos reales del 26/10/2026 · plata y alta simuladas". Mantener 1,5 s de cola sin voz y fundido a azul noche. | Pruébalo en fudo diagnostico<br>punto vercel punto app.<br>— — —<br>El código, en GitHub:<br>— — —<br>matiasrubano barra fudo diagnostico. |

### Notas de montaje por escena

1. **Escena 1.** El gancho es el dolor del dueño, no el producto: logo y rótulo duran menos de un segundo. El cartel "25–35 %" debe entrar justo con la palabra "comisión". La cifra es de prensa argentina y aplica a PedidosYa en AR; "35" se anima como tope del rango, no como promedio.
2. **Escena 2.** `m-04-confirmar` trae **dos tarjetas** (la segunda es Diavola, de São Paulo): recortar a la primera. Es un comportamiento conocido de la búsqueda (ver `docs/feedback/persona-ruben.md`).
3. **Escena 3.** Cortes de ~1,2 s. No hace falta leer las opciones; basta con que se vea que son 4 pantallas simples.
4. **Escena 4.** La comanda tiene 5 áreas (Google 100 · Reseñas 90 · Web 35 · Delivery 55 · Operación 32). La voz nombra las tres que cuentan la historia; las otras pasan en la panorámica. Nota general: 65/100.
5. **Escena 5.** Única cifra de plata y es **simulada**: la voz lo dice, la imagen estampa el sello y el texto lo repite. No convertir a dólares ni sumar ahorros.
6. **Escena 6.** El momento central. Recortar `m-14` desde el título "TU FUDO YA ARMADO" para no mostrar la etiqueta interna "Caliente". La voz dice "reales" para nombre, dirección y horarios (con badge real) y "simulada" para el alta (aviso amarillo de la app: "Hoy el alta de fu.do no acepta precarga de datos… este botón es una simulación").
7. **Escena 7.** "Por grupo" = por brazo del experimento. La métrica es **cuenta → pago a 60 días**.
8. **Escena 8.** Comparar con cuidado: USD 20 es por **cuenta** vía pauta (USD 200 de CAC por cliente × 10 % de cuenta→pago) y USD 0,06 es por **diagnóstico**. La nota chica aclara que no son la misma unidad.
9. **Escena 9.** Dos URLs grandes, legibles en celular. Cola de 1,5 s sin voz.

## 5. Capturas a generar (Playwright)

Todas contra **https://fudo-diagnostico.vercel.app** (producción), con **El Campeón de la Pizza**. Dos contextos: móvil 375×812 a escala 2 (`m-*`, 750 px de ancho) y escritorio 1280×800 a escala 1 (`d-*`). Respuestas del recorrido: **Pizzería · En el salón + Mostrador / retiro + Apps de delivery · A mano: papel, Excel o calculadora · 1 local**. Con esas respuestas el resultado es: 100 / 90 / 35 / 55 / 32, nota general 65, "$ 1.688.000" (verificado el 27/10/2026).

| Archivo | Viewport | URL y acciones | Escena |
|---|---|---|---|
| `m-01-home-hero.png` | 375×812 @2x | `/`, esperar `article.ticket`; captura de pantalla (parte alta) | 1 |
| `m-02-home-comanda-real.png` | 375 @2x (elemento) | `/`; captura de `article.ticket` (comanda real de ejemplo en la home) | ref. |
| `m-03-buscador-escrito.png` | 375×812 @2x | `/`; clic en "Nombre de tu local" y tipear "El Campeón de la Pizza" (70 ms/letra); captura | 2 |
| `m-04-confirmar.png` | 375×812 @2x | clic en "Diagnosticar"; esperar "¿Cuál es tu local?"; captura (recortar a la 1.ª tarjeta) | 2 |
| `m-05-pregunta-1.png` | 375×812 @2x | clic en "Elegir este" (el primero); esperar "Pregunta 1 de 4"; captura | 3 |
| `m-06-pregunta-2-marcada.png` | 375×812 @2x | clic en "Pizzería"; en P2 marcar "En el salón", "Mostrador / retiro" y "Apps de delivery"; captura | 3 |
| `m-07-pregunta-3.png` | 375×812 @2x | "Siguiente"; esperar "Pregunta 3 de 4"; captura | 3 |
| `m-08-pregunta-4.png` | 375×812 @2x | clic en "A mano"; esperar "Pregunta 4 de 4"; captura | 3 |
| `m-09-resultado-top.png` | 375×812 @2x | clic en "1 local"; esperar `section[aria-labelledby=money-title]`; captura (parte alta) | 9 |
| `m-10-comanda-resultado.png` | 375 @2x (686×2290) | captura de `article.ticket` | 4 |
| `m-11-plata-simulada.png` | 375 @2x (elemento) | captura de `section[aria-labelledby=money-title]` | 5 |
| `m-12-como-calculamos.png` | 375 @2x (elemento) | clic en "¿Cómo calculamos esto?"; captura del mismo elemento | 5 |
| `m-13-vecinos.png` | 375 @2x (elemento) | captura de `section[aria-labelledby=neighbors-title]` (opcional; revisar el texto antes de usarla) | opc. |
| `m-14-tu-fudo-ya-armado.png` | 375 @2x (686×2690) | captura de `section[aria-labelledby=route-reason]` (recortar desde el título) | 6 |
| `m-15-modal-alta-simulada.png` | 375×812 @2x | clic en "Crear mi cuenta de Fudo"; esperar `dialog[open]`; captura | 6 |
| `m-16-simulacion-hecha.png` | 375×812 @2x | clic en "Simular la creación"; esperar 0,8 s; captura | opc. |
| `d-01-home-hero.png` | 1280×800 | `/`; captura | 1 (alterno) |
| `d-04-confirmar.png` | 1280×800 | mismo recorrido; captura | 2 (alterno) |
| `d-09-resultado-top.png` | 1280×800 | captura al llegar al resultado | 7 (textura) |
| `d-10-comanda-resultado.png` | 1280 (elemento) | captura de `article.ticket` | 4 (alterno) |
| `d-11-plata-simulada.png` | 1280 (elemento) | captura de `section[aria-labelledby=money-title]` | 5 (alterno) |
| `d-13-vecinos.png` | 1280 (elemento) | captura de `section[aria-labelledby=neighbors-title]` | opc. |
| `d-14-tu-fudo-ya-armado.png` | 1280 (elemento) | captura de `section[aria-labelledby=route-reason]` | 6 (plano ancho) |
| `d-15-modal-alta-simulada.png` | 1280×800 | captura con el modal abierto | 6 (alterno) |

**Script listo (Python + Playwright)**, probado el 27/10/2026 contra producción: genera las 24 capturas de la tabla (16 móviles y 8 de escritorio). Guardarlo como `video/scripts/capturas.py` y correr `python capturas.py video/captures`.

```python
# Capturas para el video demo. Uso: python capturas.py <carpeta_salida>
import sys, pathlib
from playwright.sync_api import sync_playwright

BASE = "https://fudo-diagnostico.vercel.app"
OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "capturas"); OUT.mkdir(parents=True, exist_ok=True)

def flow(page, prefix, shots):
    """Recorre El Campeón de la Pizza y saca las capturas (todas si shots es None)."""
    def snap(name, target=None):
        if shots is not None and name not in shots: return
        (target or page).screenshot(path=str(OUT / f"{prefix}-{name}.png"))
    opt = lambda t: page.locator("button.option", has_text=t).first   # opciones de las preguntas (radio/checkbox)
    page.goto(BASE + "/", wait_until="networkidle")
    page.wait_for_selector("article.ticket")
    snap("01-home-hero")
    page.locator("article.ticket").scroll_into_view_if_needed()
    snap("02-home-comanda-real", page.locator("article.ticket"))
    page.evaluate("window.scrollTo(0,0)")
    box = page.get_by_label("Nombre de tu local")
    box.click()
    box.press_sequentially("El Campeón de la Pizza", delay=70)
    snap("03-buscador-escrito")
    page.get_by_role("button", name="Diagnosticar").click()
    page.get_by_text("¿Cuál es tu local?").wait_for()
    snap("04-confirmar")
    page.get_by_role("button", name="Elegir este").first.click()
    page.get_by_text("Pregunta 1 de 4").wait_for()
    snap("05-pregunta-1")
    opt("Pizzería").click()
    page.get_by_text("Pregunta 2 de 4").wait_for()
    for n in ("En el salón", "Mostrador / retiro", "Apps de delivery"):
        opt(n).click()
    snap("06-pregunta-2-marcada")
    page.get_by_role("button", name="Siguiente").click()
    page.get_by_text("Pregunta 3 de 4").wait_for()
    snap("07-pregunta-3")
    opt("A mano").click()
    page.get_by_text("Pregunta 4 de 4").wait_for()
    snap("08-pregunta-4")
    opt("1 local").click()
    page.wait_for_selector("section[aria-labelledby=money-title]", timeout=20000)
    page.wait_for_timeout(600)
    snap("09-resultado-top")
    snap("10-comanda-resultado", page.locator("article.ticket"))
    snap("11-plata-simulada", page.locator("section[aria-labelledby=money-title]"))
    page.get_by_text("¿Cómo calculamos esto?").first.click()
    page.wait_for_timeout(300)
    snap("12-como-calculamos", page.locator("section[aria-labelledby=money-title]"))
    snap("13-vecinos", page.locator("section[aria-labelledby=neighbors-title]"))
    sec = page.locator("section[aria-labelledby=route-reason]")
    sec.scroll_into_view_if_needed()
    snap("14-tu-fudo-ya-armado", sec)
    page.get_by_role("button", name="Crear mi cuenta de Fudo").click()
    page.locator("dialog[open]").wait_for()
    page.wait_for_timeout(400)
    snap("15-modal-alta-simulada")
    page.get_by_role("button", name="Simular la creación").click()
    page.wait_for_timeout(800)
    snap("16-simulacion-hecha")

with sync_playwright() as p:
    b = p.chromium.launch()
    # 1) Móvil 375x812 @2x: todas las capturas
    m = b.new_context(viewport={"width": 375, "height": 812}, device_scale_factor=2,
                      is_mobile=True, has_touch=True, locale="es-AR")
    flow(m.new_page(), "m", None)
    m.close()
    # 2) Escritorio 1280x800 @1: solo los planos anchos
    d = b.new_context(viewport={"width": 1280, "height": 800}, device_scale_factor=1, locale="es-AR")
    flow(d.new_page(), "d", {"01-home-hero", "04-confirmar", "09-resultado-top", "10-comanda-resultado",
                             "11-plata-simulada", "13-vecinos", "14-tu-fudo-ya-armado", "15-modal-alta-simulada"})
    d.close()
    b.close()
```

**Verificaciones antes de usar las capturas:**
- La home de producción cambia el hero según el país por IP (`x-vercel-ip-country`). Si `m-01` no dice "Alguien busca “pizza en Lanús”", partir desde la landing `/ar/`.
- No mostrar el link "Panel de eventos (/debug)" del pie ni la etiqueta "Caliente" de la sección de ruteo.
- Son capturas del estado de producción del 27/10/2026. Si hay un redeploy antes del render, rehacerlas y comparar nota (65), monto ($ 1.688.000) y datos del local.
- Respaldo opcional: grabar el recorrido completo con `record_video_dir` a 375×812 para tener el tipeo y los clics reales.

## 6. Notas para A8 y para el aprobador

- **Cortable si la voz se pasa de 85 s:** en la escena 8, "Hoy, "; en la escena 3, "Sin registro." (ya está en la pastilla de pantalla). Si sobra tiempo, antes de la escena 2 se puede sumar "Un diagnóstico gratis." (+1,3 s).
- **Sin voseo en la locución.** Los textos de pantalla que son citas de la app conservan su voseo (por ejemplo "¿Cobrás y facturás sin errores?").
- **Es un local real con datos públicos.** Nunca decir que Fudo lo armó ni que el local participó. El pie de las escenas 2–6 lo aclara.
- **Qué NO se dice ni se muestra:** conversión a dólares de la plata perdida, promedios de mercado, otros locales de la demo, ni la promesa de que el experimento "va a" dar 15 %: es una hipótesis a probar.
- **Cobertura del encargo:** (1) hook con el problema: escena 1; (2) recorrido con el local real: escenas 2–5; (3) "Tu Fudo ya armado" con alta simulada aclarada: escena 6; (4) números de línea base y experimento: escenas 7–8; (5) cierre con las dos URLs: escena 9.

## 7. Fuentes (cada número del guion)

| Dato en el guion | Valor | Fuente |
|---|---|---|
| Hook | "Viernes 21:30", "pizza en Lanús" | Hero de la app en producción (https://fudo-diagnostico.vercel.app, 27/10/2026); `app/src/content/copy.ts` (`hero`) |
| Comisión de las apps | 25–35 % (PedidosYa, AR); "35" es el tope | Nota de iProfesional del 14/05/2026, citada en la app y en `app/src/domain/moneyLost.ts` (`appCommission`). Dato de prensa argentina: aplica a AR |
| Rating y reseñas | 4,2 · 6.167 reseñas | Snapshot `app/data/snapshots/ar-el-campeon-de-la-pizza-lanus.json`, ficha pública de Google, capturado el 26/10/2026 (`provenance.real = true`) |
| Sin web propia; PedidosYa y Rappi | — | Mismo snapshot (`website` ausente; `delivery.pedidosya` y `delivery.rappi`) |
| Dirección y horarios de la cuenta | Av. 9 de Julio 1253, Lanús; lun–vie 07:00–00:00, sáb–dom 07:00–01:00 | Mismo snapshot |
| Notas por área | Google 100 · Reseñas 90 · Web 35 · Delivery 55 · Operación 32 · General 65 | App en producción con las respuestas del recorrido (27/10/2026); reglas en `app/src/domain/scoring.ts` (por reglas, sin IA) |
| Plata que se escapa | casi $ 1.688.000 por mes (rango $ 1.013.000–$ 2.363.000). **Estimación simulada** | App en producción (27/10/2026); cuenta en `app/src/domain/moneyLost.ts`: 4.000 pedidos/mes (volumen "alto" por reseñas) × ticket $ 15.000 × supuestos de la demo (apps 35 % × 25 % de comisión × 15 % redirigible, más merma de cobro a mano 1,5 %). No es un dato real del negocio |
| Línea base del caso | 80.000 visitas/mes · 1,2 % → **960 cuentas** · 10 % cuenta→pago → 96 pagos/mes | Caso Fudo, línea de base (`PLAN.md` §0) |
| CAC | USD 200 por cliente pagante (pauta) | Caso Fudo (`PLAN.md` §0; `docs/research/costos.md` §4) |
| USD 20 por cuenta | 200 × 10 % = 20 | `docs/research/costos.md` §4 (CAC por cuenta creada) |
| Experimento | 10 % → 15 % cuenta→pago; medición a 60 días | `PLAN.md` §0 y §2-G6 |
| ~685 cuentas por brazo | n = 685,6 | Cálculo propio, dos proporciones: p1 = 0,10, p2 = 0,15, α = 0,05 bilateral, potencia 80 %; `n = (1,96·√(2·p̄·q̄) + 0,8416·√(p1q1+p2q2))² / (p2−p1)²`, p̄ = 0,125. El `PLAN.md` dice "~680"; el guion usa el valor calculado redondeado |
| USD 0,06 por diagnóstico | USD 0,057 (Text Search Pro 0,032 + Place Details Enterprise + Atmosphere 0,025) | `docs/research/costos.md` §1–2, precios de Google Maps Platform al 23/10/2026; primeros 1.000 por mes gratis (§3.1) |
| USD 5,70–0,57 por cuenta | a 1 %–10 % de diagnóstico→cuenta | `docs/research/costos.md` §4. Las tasas 1–10 % son **supuestos** de esa tabla, no datos del caso |
| "Plan Inicial desde $ 22.500/mes" (solo si se ve en pantalla) | — | `app/src/config/countries.json`, publicado en fu.do, capturado el 26/10/2026 |
| Alta simulada | "Hoy el alta de fu.do no acepta precarga de datos" | Aviso de la app y hallazgo de G1 (`PLAN.md` §2-G1, evidencia) |
| URLs | fudo-diagnostico.vercel.app · github.com/matiasrubano/fudo-diagnostico | `PLAN.md` §7 (Entregables) |
