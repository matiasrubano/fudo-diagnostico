---
title: "CFDI 4.0 en restaurantes: facturación y propinas en 2026"
slug: "cfdi-4-restaurante-propinas"
country: "MX"
lang: "es-MX"
description: "CFDI 4.0 en tu restaurante: datos del cliente, uso G03, factura global y propina. No hallamos criterio oficial del SAT específico para restaurantes: confírmalo."
keyword: "CFDI 4.0 restaurante propinas"
question: "¿La propina va en el CFDI de mi restaurante?"
updatedAt: "2026-10-26"
author: "Equipo del diagnóstico (borrador de demo)"
status: "borrador-demo"
faq:
  - q: "¿Tengo que timbrar la propina?"
    a: "No encontramos una respuesta oficial del SAT específica para restaurantes y las fuentes privadas no coinciden: una consultora recomienda separar la propina antes de timbrar y un proveedor de software dice que puede incluirse. Pregúntale a tu contador antes de decidir."
  - q: "¿Qué clave de producto uso para un restaurante?"
    a: "Una consultora (Praxium) lista la clave 90101501 para restaurantes y 90101500 para establecimientos para comer y beber, del catálogo c_ClaveProdServ. Confírmala en el catálogo vigente del SAT con tu contador."
  - q: "¿Qué es la factura global y cuándo se emite?"
    a: "Es el CFDI con el que se factura lo vendido al público en general. Según Praxium, se emite dentro de las 24 horas siguientes al cierre del periodo elegido (regla 2.7.1.21 de la RMF 2026). Es una sola fuente secundaria: verifícalo."
  - q: "¿Qué uso de CFDI se pone en una consumición?"
    a: "El uso suele ser G03, 'gastos en general', según Praxium. Lo elige el cliente al pedir su factura. Si tienes dudas, confirma con tu contador qué uso corresponde."
  - q: "¿Cómo hago para que mis clientes se autofacturen?"
    a: "Necesitas un portal de autofacturación. Algunos sistemas de gestión lo incluyen: Fudo, por ejemplo, ofrece un portal donde el cliente genera su propia factura. Revisa que pida RFC, nombre o razón social, código postal y régimen fiscal del receptor."
sources:
  - label: "SAT — Servicio de facturación CFDI 4.0 (vigencia: 3.3 hasta 31/03/2023, solo 4.0 desde 01/04/2023)"
    url: "https://wwwmat.sat.gob.mx/aplicacion/75169/servicio-de-facturacion-cfdi-version-4.0-(vigente-a-partir-del-1-de-enero-de-2022)"
  - label: "Praxium Consultores (12/09/2026) — Propinas en restaurante: IVA, ISR y cómo registrarlas"
    url: "https://praxiumconsultores.com/blog/propinas-en-restaurante-iva-isr-y-como-registrarlas"
  - label: "Praxium Consultores (12/09/2026) — Factura de restaurante: requisitos del CFDI"
    url: "https://praxiumconsultores.com/blog/factura-de-restaurante-requisitos-del-cfdi-para-que-el-cliente-deduzca"
  - label: "Edifact — Sistema de facturación para restaurantes con propinas (proveedor de software)"
    url: "https://www.edifact.com.mx/masinfo/sistema-de-facturacion-para-restaurantes-con-propinas.html"
  - label: "Fudo — Tu Gestión México (facturación electrónica CFDI 4.0 y portal de autofacturación)"
    url: "https://fu.do/es-mx/tu-gestion/"
verifyNotes:
  - "Revisión de un contador matriculado en México pendiente antes de publicar"
  - "No hay respuesta oficial del SAT específica para restaurantes sobre la propina en el CFDI. Las fuentes privadas se contradicen: Praxium dice que la propina se separa antes de timbrar la factura global; Edifact (proveedor de software) dice que puede incluirse. El texto adopta la postura conservadora y lo marca como a confirmar."
  - "El criterio normativo 35/ISR/N del SAT (propinas como ingreso del trabajador) que cita geo-blog.md NO pudo abrirse (sat.gob.mx respondió 403). No se afirma en el cuerpo; el tratamiento laboral sale de Praxium (LFT arts. 346 y 347, LISR art. 96)."
  - "El plazo de la factura global (24 horas siguientes al cierre del periodo, regla 2.7.1.21 de la RMF 2026) viene de una sola fuente secundaria (Praxium). Verificar en la RMF 2026."
  - "La guía del SAT de venta de comida (claves 90101501 y 90101503) estaba inaccesible (conexión rechazada): las claves se citan según Praxium."
  - "Uso de CFDI 'G03': sugerencia de consultora; no confirmada con fuente oficial."
  - "La nota de Mercado Pago MX sobre propinas devolvió 403 y no se leyó."
  - "Las afirmaciones sobre Fudo (CFDI 4.0 y portal de autofacturación) son de su sitio público (marketing); el sitio no menciona al SAT."
cta:
  text: "Revisa cómo cobras y facturas hoy: el diagnóstico gratis te muestra tu nota de Operación y qué pedirle a tu sistema para separar consumo y propina."
---

**Respuesta corta:** desde el 1 de abril de 2023 la única versión válida del CFDI es la 4.0, según el SAT. Sobre la propina no encontramos una respuesta oficial específica para restaurantes: una consultora recomienda separarla del consumo antes de timbrar la factura global. Confírmalo con tu contador.

*Actualizado el 26/10/2026. Esta guía no reemplaza a tu contador.*

## ¿Qué versión del CFDI se usa hoy?

El SAT indica que la versión 4.0 entró en vigor el 1 de enero de 2022. La 3.3 se pudo usar hasta el 31 de marzo de 2023. Desde el 1 de abril de 2023 "la única versión válida es la versión 4.0". El SAT también ofrece un servicio de facturación gratuito para personas físicas y morales, pensado para quienes emiten pocas facturas.

## ¿Qué datos del cliente pide el CFDI 4.0?

Según Praxium (septiembre de 2026), citando el artículo 29-A fracción IV del Código Fiscal de la Federación, el CFDI lleva:

- RFC del receptor
- Nombre o razón social
- Código postal de su domicilio fiscal
- Régimen fiscal del receptor (campo obligatorio del estándar 4.0)

La misma consultora dice que la **forma de pago** es la razón más común por la que se rechazan facturas de restaurante: si el cliente pagó con tarjeta, no pongas "efectivo".

## ¿Qué uso de CFDI y qué clave de producto se usan?

- **Uso de CFDI:** para un consumo de alimentos suele ser **G03** ("gastos en general"). Lo define el cliente.
- **Clave de producto o servicio:** Praxium lista **90101501** (restaurantes) y 90101500 (establecimientos para comer y beber).

Ambas son indicaciones de una consultora, no del SAT: confírmalas.

## ¿La propina va en el CFDI?

No hay un criterio oficial que hayamos podido abrir sobre este punto específico, y las fuentes privadas no coinciden.

| Fuente | Qué dice |
|---|---|
| Praxium (12/09/2026) | La factura global debe cubrir consumo más IVA. La propina cobrada con tarjeta se separa antes de generar la factura. Si ya se incluyó, recomienda cancelar y reemitir sin ella |
| Edifact (software) | El restaurante puede emitir un CFDI que incluye la propina |

Lo que sí es consistente en Praxium: la propina voluntaria no causa IVA ni IEPS porque no es ingreso del restaurante, y es parte del salario del personal de hoteles, restaurantes y bares (Ley Federal del Trabajo, art. 346). Un **cargo por servicio obligatorio** es distinto: forma parte del precio, es ingreso del restaurante y lleva IVA de 16%, según la misma fuente.

Mientras tu contador decide, lo útil es que tu sistema permita **separar consumo y propina en el ticket**, para poder hacerlo de cualquier manera.

## ¿Cómo registrar y repartir las propinas con tarjeta?

Praxium propone llevar un **reporte de propinas por turno** que separe consumo, IVA y propina (tarjeta y efectivo), más el monto repartido por persona. Cuadra el total mensual de propinas con tarjeta contra lo descontado de las ventas antes de facturar y lo incluido en nómina. Pide a cada persona un acuse (firma o recibo digital).

## ¿Qué es la factura global y qué pasa si el cliente pide factura después?

Las ventas al público en general van en una factura global. Según Praxium, se envía dentro de las 24 horas siguientes al cierre del periodo elegido (regla 2.7.1.21 de la RMF 2026; fuente única, a verificar). Si un cliente pide factura nominativa de una venta que ya entró en la global, esa venta se cuenta dos veces salvo que canceles y reemitas la global.

Por eso conviene la **autofactura**: que el cliente genere su factura desde un portal, con su ticket, antes de que cierres el periodo.

## ¿Qué pedirle a tu sistema?

- Que emita CFDI 4.0 y pida los cuatro datos del receptor.
- Que separe consumo y propina en el ticket y en el reporte de turno.
- Que ofrezca un portal de autofacturación.
- Que te permita cancelar y reemitir.

Como referencia, el sitio de Fudo dice que su módulo de facturación respeta la versión 4.0 del CFDI y que incluye un [portal de autofacturación](https://fu.do/es-mx/tu-gestion/). Úsalo como checklist aunque elijas otro sistema.
