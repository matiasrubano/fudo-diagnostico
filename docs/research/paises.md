# Tabla de países: AR, MX, CL, CO, BR

Fecha de captura: **2026-10-26**. Datos legibles de `app/src/config/countries.json` (misma información, con fuente por dato). Regla: lo que no se encontró dice "no encontrado".

## 1. Resumen

| | Argentina | México | Chile | Colombia | Brasil |
|---|---|---|---|---|---|
| Idioma | es-AR | es-MX | es-CL | es-CO | pt-BR |
| Moneda | ARS (`$`) | MXN (`$`) | CLP (`$`) | COP (`$`) | BRL (`R$`) |
| Ente fiscal | ARCA (ex AFIP) | SAT | SII | DIAN | SEFAZ estadual + Receita Federal (Portal NF-e) |
| Documento | Factura electrónica / controlador fiscal | CFDI 4.0 | Boleta y factura electrónica (DTE) | Factura electrónica de venta | NFC-e (consumidor) / NF-e |
| Apps de delivery (orden de relevancia) | PedidosYa, Rappi (+ Mercado Libre y Uber Eats, entrantes) | DiDi Food, Rappi, Uber Eats | PedidosYa, Uber Eats, Rappi | Rappi, DiDi Food | iFood (+ 99Food, Keeta, entrantes) |
| Plan Inicial / mes | $22.500 | $360 + IVA | $25.500 + IVA | $62.900 + IVA | R$ 83,90 |
| Plan Avanzado / mes | $43.900 | $690 + IVA | $34.500 + IVA | $118.900 + IVA | R$ 125,90 |
| Plan Pro / mes | $69.500 | $1,050 + IVA | $52.500 + IVA | $144.900 + IVA | R$ 178,90 |
| Crear cuenta | https://fu.do/es-ar/crear-cuenta/ | https://fu.do/es-mx/crear-cuenta/ | https://fu.do/es-cl/crear-cuenta/ | https://fu.do/es-co/crear-cuenta/ | https://deli.com.br/pt-br/criar-uma-conta/ |
| Sitio | https://fu.do/es-ar/ | https://fu.do/es-mx/ | https://fu.do/es-cl/ | https://fu.do/es-co/ | https://deli.com.br/pt-br/ |

Los precios de los planes **están publicados en los 5 países**, así que `fudoPlans` no es `null` en ninguno. En AR el precio publicado es "final" (con impuestos nacionales); en MX, CL y CO figura "sin IVA"; en BR la página no aclara si incluye impuestos (no encontrado).

## 2. Hallazgo importante: Brasil se vende como "Deli", no como "Fudo"

- fu.do declara `hreflang="pt-br"` hacia **https://deli.com.br/pt-br/** (fuente: `<link rel=alternate>` en https://fu.do/es-ar/). No existe una versión `fu.do/pt-br/` (el hreflang apunta a otro dominio).
- deli.com.br usa **el mismo CSS** (`main-6c65faf4.css` + `redesign-ce4f2c01.css`), la misma estructura de menús y los mismos módulos (Recepcionista IA, KDS, delivery, reservas, pedidos QR). Pie de página: "© 2026 Deli · Comandarina Brasil Ltda · CNPJ 47.362.577/0001-07" (https://deli.com.br/pt-br/preços/).
- La política de privacidad de fu.do México identifica como "FUDO" a **COMANDARINA S.A. DE C.V.** (https://fu.do/es-mx/politicas-de-privacidad/). Es decir, el nombre del grupo coincide (Comandarina), pero **ninguna de las páginas que revisé dice textualmente "Deli es la marca de Fudo en Brasil"**. Conclusión razonable (no declarada): misma plataforma, marca local distinta.
- Implicancia para la app: para BR el CTA no puede decir "tu cuenta de **Fudo**"; hay que decir "tu cuenta de **Deli**" o dejar el nombre del producto como variable por país. Recomiendo agregar `productName` por país en la config de la app (AR/MX/CL/CO = "Fudo", BR = "Deli"). Lo dejo como sugerencia: no lo agregué al JSON para no inventar un campo fuera del esquema pedido.
- Datos de Brasil (planes, módulos) provienen de https://deli.com.br/pt-br/preços/ (URL con `ç`; en el JSON está codificada como `%C3%A7`).

## 3. Argentina

- **Moneda:** ARS, símbolo `$`.
- **Ente fiscal:** ARCA, ex AFIP. El micrositio oficial se llama "Factura electrónica | ARCA" → https://www.arca.gob.ar/fe/ (verificado: HTTP 200). Hay "Comprobantes en línea" como servicio de emisión. Fudo: módulo "Facturación Electrónica" +$13.500/mes y compatibilidad con impresoras fiscales Epson o Hasar (https://fu.do/es-ar/preguntas-frecuentes/).
- **Cambio normativo (fuente secundaria):** la prensa informa que la RG 5893/2026 de ARCA extiende la obligación de comprobantes electrónicos (monotributo social desde 2026-11-01; no alcanzados por IVA desde 2027-03-01). Fuente: https://www.perfil.com/noticias/economia/arca-extiende-la-obligacion-de-emitir-factura-electronica-a-quienes-afecta-a40.phtml. No pude abrir el texto oficial: **verificar antes de citar en el informe**.
- **Delivery:**
  - PedidosYa y Rappi son "las aplicaciones líderes" (iProfesional, 14/05/2026: https://www.iprofesional.com/negocios/454816-mas-pedidos-y-cargos-de-hasta-35-por-cento-la-presion-del-delivery-sobre-comercios-y-repartidores). Esa nota cita comisiones de PedidosYa de 25% a 35% de las ventas y dice que Rappi declara no superar 25%.
  - Mercado Libre entró hace poco, con comisiones cercanas al 13% (misma nota).
  - Uber Eats anunció su regreso en 2026 tras irse en octubre de 2020 (iProfesional, 22/01/2026: https://www.iprofesional.com/negocios/446682-uber-eats-vuelve-a-argentina-para-competir-con-rappi-y-pedidosya-en-el-delivery).
  - Fudo integra Uber Eats, PedidosYa y Rappi en un solo panel (https://fu.do/es-ar/tu-gestion/).
  - **Cuota de mercado por app: no encontrada** en una fuente fechada.
- **Planes Fudo (ARS, precio final mensual, https://fu.do/es-ar/precios/):** Inicial $22.500 (sin impuestos nacionales: $18.595) · Avanzado $43.900 ($36.281) · Pro $69.500 ($57.438).
- **Módulos (ARS/mes):** Gestión de Mesas $8.500 · Facturación Electrónica $13.500 · Delivery Apps $19.500 · Recepcionista IA $55.000.

## 4. México

- **Moneda:** MXN, `$`.
- **Ente fiscal:** SAT. Documento: **CFDI** (Comprobante Fiscal Digital por Internet), versión 4.0. Portal: https://www.sat.gob.mx/ (HTTP 200, pero el contenido es dinámico y mi lector no lo pudo leer). Guía técnica oficial: Anexo 20 del SAT (http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/Anexo_20_Guia_de_llenado_CFDI.pdf, que según el buscador incluye guías para 3.3 y 4.0). Que 4.0 es la versión vigente lo confirman fuentes secundarias (https://www.siigo.com/mx/blog/obligaciones-fiscales/datos-relevantes-cfdi-4-0/); **la fecha exacta de obligatoriedad: fuentes en desacuerdo, no la fijo**.
- **Delivery:**
  - DiDi Food 38% y Rappi 36% de usuarios activos mensuales en 2024 (Sensor Tower, citado por Expansión el 30/05/2025: https://expansion.mx/tecnologia/2025/05/30/mexico-segundo-mercado-delivery-latinoamerica). México es el segundo mercado de delivery de la región, tras Brasil (misma nota).
  - Uber Eats opera en México (misma nota, estudio de Quadrant Strategies sobre MiPymes afiliadas); cuota: no encontrada.
- **Planes Fudo (MXN, sin IVA, https://fu.do/es-mx/precios/):** Inicial $360 · Avanzado $690 · Pro $1,050.
- **Módulos (MXN/mes, sin IVA):** Ventas por Comensal $100 · KDS $200 · Delivery Apps $200 · Gestión de Mesas $100 · Facturación Electrónica $200 · Recepcionista IA $850.
- Nota de página: "Con débito automático obtienes un 5% de descuento sobre el pago mensual".

## 5. Chile

- **Moneda:** CLP, `$`.
- **Ente fiscal:** SII (Servicio de Impuestos Internos). Boleta electrónica obligatoria desde 2021 (Ley 21.210) y envío al SII (https://www.sii.cl/preguntas_frecuentes/bol_electr_vtas_serv/001_380_7666.htm). La Resolución Exenta N° 12 de 2025 refuerza la entrega al cliente: copia impresa desde 2025-05-01 y envío digital para quien no tenga impresora desde 2026-03-01 (https://www.sii.cl/noticias/2025/270225noti01aav.htm; fechas tomadas de un resumen de búsqueda sobre esas páginas, **verificar en la resolución**). Entrada oficial: https://www.sii.cl/factura_electronica/.
- **Fudo en Chile:** "Boleta electrónica incluida, sin costo, en todos los planes" y "Conexión directa con el SII" (https://fu.do/es-cl/precios/).
- **Delivery:**
  - PedidosYa lidera en usuarios activos semanales en T4 2025 (~1,36 M a fin de diciembre); Uber Eats ~926 mil; Rappi ~406 mil (Sensor Tower: https://sensortower.com/blog/2025-q4-unified-top-5-food-delivery-services-units-cl-63da96fbe1714cfff1c1e5a1; el orden sale de las cifras, el artículo no publica un ranking explícito).
  - Preferencia declarada 2024 (AIM Chile, vía ODECU): PedidosYa 34,4%, Uber Eats 23,9%, Rappi 5,6% (https://odecu.cl/practicas-de-las-plataformas-de-delivery-y-su-impacto-en-los-consumidores-en-chile-minuta-n15/minuta-15-delivery).
  - Según Euromonitor 2024 (vía ODECU), PedidosYa, Uber Eats y Rappi concentran el 61% de las ventas del formato delivery.
- **Planes Fudo (CLP, sin IVA, https://fu.do/es-cl/precios/):** Inicial $25.500 · Avanzado $34.500 · Pro $52.500.
- **Módulos (CLP/mes, sin IVA):** Ventas por Comensal $4.500 · Delivery Apps $9.500 · Gestión de Mesas $4.500 · KDS $9.500 · Recepcionista IA $42.500.

## 6. Colombia

- **Moneda:** COP, `$`.
- **Ente fiscal:** DIAN. Entrada oficial: https://www.dian.gov.co/impuestos/factura-electronica/Paginas/inicio.aspx (HTTP 200). Obligados a facturar electrónicamente: https://www.dian.gov.co/impuestos/sociedades/Paginas/obligadosfacturar.aspx y guía https://www.dian.gov.co/impuestos/factura-electronica/Documents/Abece-FE-Facturador.pdf (según el buscador, cita la Resolución 000165 de 2023: responsables de IVA y del impuesto nacional al consumo, inscritos en el régimen SIMPLE y personas jurídicas; personas naturales si superan 3.500 UVT de ingresos brutos o cumplen otros requisitos).
- **Delivery:** el dato más reciente que encontré es de **septiembre de 2022** (GIG Latam, vía La República): Rappi 51%, domicilios propios 38%, DiDi Food 8%, iFood 3% (https://www.larepublica.co/empresas/cual-sera-el-nuevo-competidor-de-rappi-en-el-delivery-luego-de-la-salida-de-ifood-3482380). iFood se retiró en noviembre de 2022 (misma nota). **Cifra de 2025/2026: no encontrada.**
- **Planes Fudo (COP, sin IVA, https://fu.do/es-co/precios/):** Inicial $62.900 · Avanzado $118.900 · Pro $144.900.
- **Módulos (COP/mes, sin IVA):** Ventas por Comensal $12.900 · Facturación Electrónica desde $9.000 · Gestión de Mesas $12.900 · Delivery Apps $38.900 · KDS $38.900 · Tu Delivery $110.900 · Recepcionista IA $135.000.

## 7. Brasil (marca Deli)

- **Moneda:** BRL, `R$`. Idioma pt-BR (la app no tendrá i18n a portugués: BR es "recorte declarado" según el PLAN).
- **Ente fiscal:** no hay un único ente como en los demás países. La NFC-e (modelo 65, venta al consumidor) la autoriza la **SEFAZ de cada estado**; la documentación técnica nacional está en el **Portal Nacional da NF-e** (https://www.nfe.fazenda.gov.br/, HTTP 200) y la Receita Federal mantiene el SPED (http://sped.rfb.gov.br/pagina/show/1519). Los restaurantes son contribuyentes del ICMS y deben emitir NFC-e por cada comida, incluido el delivery (SEFAZ-AM: https://nfamazonense.sefaz.am.gov.br/restaurantes-e-bares-devem-emitir-nota-fiscal-para-toda-refeicao-fornecida-2/; es un ejemplo estatal, la regla varía por estado). Requiere certificado digital ICP-Brasil.
- **Delivery:** iFood es el líder (Money Times, 12/06/2026: https://www.moneytimes.com.br/nossa-lideranca-nao-vem-de-amarras-contratuais-ifood-responde-a-concorrencia-e-detalha-estrategia-para-se-manter-no-topo/). 99Food (DiDi) y Keeta (Meituan) son entrantes, con litigios y denuncias ante el Cade (Mercado & Consumo, 16/09/2026: https://mercadoeconsumo.com.br/16/09/2026/noticias/ifood-anuncia-investimento-recorde-de-r-24-bi-em-meio-a-disputas-na-justica-e-no-cade/). **Cuota de mercado de iFood: no encontrada en fuente verificable** (circula "~80%" atribuido a Abrasel/Sebrae, pero no logré confirmarlo en la nota donde aparecía).
- **Planes Deli (BRL, https://deli.com.br/pt-br/preços/):** Inicial R$ 83,90 · Avançado R$ 125,90 · Pro R$ 178,90. Impuestos: no aclarado en la página.
- **Módulos (BRL/mes):** Comandas Individuais R$ 24,90 · KDS R$ 49,90 · Vendas por Delivery R$ 49,90 · Gestão de Mesas R$ 24,90 · Recepcionista IA R$ 160 · Balanças R$ 49,90 · Gestão Fiscal (NFC-e) R$ 1,50 por 25 notas (gratis en el Plano Pro).

## 8. Descuentos y condiciones comunes (texto literal de las páginas de precios)

- Pago semestral −10% y anual −15% por adelantado (AR, MX, CL, CO, BR).
- Un descuento adicional del 5% con "suscripción mensual" (AR, CL, CO, BR) o "débito automático" (MX). Las condiciones exactas no se detallan en la página.
- "Sin contratos y sin costo de instalación: cancelas cuando quieras", "Sin tarjeta de crédito", "Listo en 15 minutos" (hero de precios de cada país).
- Incluido en todos los planes: usuarios ilimitados, capacitaciones gratuitas, app móvil.
- El precio mostrado por defecto es el mensual: **no capturé** los precios con descuento semestral/anual como números porque la página los calcula con JavaScript; solo registré el porcentaje publicado.

## 9. Formulario de crear cuenta (relevante para "tu Fudo ya armado")

Capturado de https://fu.do/es-ar/crear-cuenta/ (HTML + `signup_form-07f76b8f.js`):
- Campos: nombre del negocio (`name`, 3 a 45 caracteres, alfanuméricos y `& - _`), nombre de la persona (`user_name`), teléfono (`phone`), e-mail (`email`), contraseña (`password`, mínimo 8 con mayúscula, minúscula y número), código promocional (`promotional_code`), checkbox de condiciones. Lema del botón: "Crear cuenta gratis · Sin tarjeta de crédito".
- El JS lee de la URL `promotional_code` (lo guarda en cookie 7 días), `gclid`, `fbclid` y `utm_source`. **No encontré parámetros públicos para pre-cargar nombre del negocio, horarios o carta.** Por lo tanto, "tu cuenta ya viene con tu nombre, horarios y carta" en esta demo es **simulado**; en producción haría falta un endpoint/API de Fudo (no documentado públicamente: no encontrado).
- Hay un código promocional visible en el sitio: `?promotional_code=TERMINALFUDO` (botón "Probar gratis" de la home). Se puede usar de ejemplo de parámetro de campaña.

## 10. Otros países de Fudo (fuera del alcance de la demo)

fu.do declara versiones para Perú (`/es-pe/`), Paraguay (`/es-py/`), Uruguay (`/es-uy/`) y una versión neutra (`/es/`) además de AR/MX/CL/CO. No las analicé.

## 11. No encontrado (resumen)

- Cuota de mercado por app de delivery en AR, MX y BR en una fuente fechada y verificable.
- Cifra de delivery de Colombia posterior a 2022.
- Texto oficial de la RG 5893/2026 (ARCA) y de la Resolución Exenta 12/2025 (SII): solo vía resúmenes.
- Contenido legible de sat.gob.mx (sitio dinámico) y fecha de obligatoriedad de CFDI 4.0.
- Si los precios de Deli (BR) incluyen impuestos.
- Una API pública de Fudo para precargar cuenta, horarios o carta.
- Una declaración textual de que Deli es la marca de Fudo en Brasil (solo evidencia indirecta: hreflang desde fu.do, mismo CSS y producto, "Comandarina").
